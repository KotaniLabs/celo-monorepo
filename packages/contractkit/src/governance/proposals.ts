import { concurrentMap } from '@celo/utils/lib/async'
import { isHexString } from '@celo/utils/src/address'
import { isValidAddress, keccak256 } from 'ethereumjs-util'
import * as inquirer from 'inquirer'
import { Transaction, TransactionObject } from 'web3-eth'
import { ABIDefinition } from 'web3-eth-abi'
import { Contract } from 'web3-eth-contract'
import { CeloContract } from '../base'
import { obtainKitContractDetails } from '../explorer/base'
import { BlockExplorer } from '../explorer/block-explorer'
import { ABI as GovernanceABI } from '../generated/Governance'
import { ContractKit } from '../kit'
import { getAbiTypes } from '../utils/web3-utils'
import { CeloTransactionObject, valueToString } from '../wrappers/BaseWrapper'
import { hotfixToParams, Proposal, ProposalTransaction } from '../wrappers/Governance'
import { setImplementationOnProxy } from './proxy'

export const HOTFIX_PARAM_ABI_TYPES = getAbiTypes(GovernanceABI as any, 'executeHotfix')

export const hotfixToEncodedParams = (kit: ContractKit, proposal: Proposal, salt: Buffer) =>
  kit.web3.eth.abi.encodeParameters(HOTFIX_PARAM_ABI_TYPES, hotfixToParams(proposal, salt))

export const hotfixToHash = (kit: ContractKit, proposal: Proposal, salt: Buffer) =>
  keccak256(hotfixToEncodedParams(kit, proposal, salt)) as Buffer

export interface ProposalTransactionJSON {
  contract: CeloContract
  function: string
  args: any[]
  params?: Record<string, any>
  value: string
}

export const proposalToJSON = async (kit: ContractKit, proposal: Proposal) => {
  const contractDetails = await obtainKitContractDetails(kit)
  const blockExplorer = new BlockExplorer(kit, contractDetails)

  return concurrentMap<ProposalTransaction, ProposalTransactionJSON>(4, proposal, async (tx) => {
    const parsedTx = blockExplorer.tryParseTx(tx as Transaction)
    if (parsedTx == null) {
      throw new Error(`Unable to parse ${tx} with block explorer`)
    }
    return {
      contract: parsedTx.callDetails.contract as CeloContract,
      function: parsedTx.callDetails.function,
      args: parsedTx.callDetails.argList,
      params: parsedTx.callDetails.paramMap,
      value: parsedTx.tx.value,
    }
  })
}

type ProposalTxParams = Pick<ProposalTransaction, 'to' | 'value'>
export class ProposalBuilder {
  constructor(
    private readonly kit: ContractKit,
    private readonly builders: Array<() => Promise<ProposalTransaction>> = []
  ) {}

  build = async () => concurrentMap(4, this.builders, (builder) => builder())

  fromWeb3tx = (tx: TransactionObject<any>, params: ProposalTxParams): ProposalTransaction => ({
    value: params.value,
    to: params.to,
    input: tx.encodeABI(),
  })

  addProxyRepointingTx = (proxyAddress: string, newImplementationAddress: string) => {
    this.addWeb3Tx(setImplementationOnProxy(newImplementationAddress), {
      to: proxyAddress,
      value: '0',
    })
  }

  addWeb3Tx = (tx: TransactionObject<any>, params: ProposalTxParams) =>
    this.builders.push(async () => this.fromWeb3tx(tx, params))

  addTx(tx: CeloTransactionObject<any>, params: Partial<ProposalTxParams> = {}) {
    const to = tx.defaultParams && tx.defaultParams.to ? tx.defaultParams.to : params.to
    const value = tx.defaultParams && tx.defaultParams.value ? tx.defaultParams.value : params.value
    if (!to || !value) {
      throw new Error("Transaction parameters 'to' and/or 'value' not provided")
    }
    // TODO fix type of value
    this.addWeb3Tx(tx.txo, { to, value: valueToString(value.toString()) })
  }

  fromJsonTx = async (tx: ProposalTransactionJSON) => {
    const contract = await this.kit._web3Contracts.getContract(tx.contract)
    const methodName = tx.function
    const method = (contract.methods as Contract['methods'])[methodName]
    if (!method) {
      throw new Error(`Method ${methodName} not found on ${tx.contract}`)
    }
    const txo = method(...tx.args)
    if (!txo) {
      throw new Error(`Arguments ${tx.args} did not match ${methodName} signature`)
    }
    const address = await this.kit.registry.addressFor(tx.contract)
    return this.fromWeb3tx(txo, { to: address, value: tx.value })
  }

  addJsonTx = (tx: ProposalTransactionJSON) => this.builders.push(async () => this.fromJsonTx(tx))
}

const DONE_CHOICE = '✔ done'

export class InteractiveProposalBuilder {
  constructor(private readonly builder: ProposalBuilder) {}

  async outputTransactions() {
    const transactionList = this.builder.build()
    console.log(JSON.stringify(transactionList, null, 2))
  }

  async promptTransactions() {
    const transactions: ProposalTransactionJSON[] = []
    while (true) {
      console.log(`Transaction #${transactions.length + 1}:`)

      // prompt for contract
      const contractPromptName = 'Celo Contract'
      const contractAnswer = await inquirer.prompt({
        name: contractPromptName,
        type: 'list',
        choices: [DONE_CHOICE, ...Object.keys(CeloContract)],
      })

      const choice = contractAnswer[contractPromptName]
      if (choice === DONE_CHOICE) {
        break
      }

      const contractName = choice as CeloContract
      const contractABI = require('@celo/contractkit/lib/generated/' + contractName)
        .ABI as ABIDefinition[]

      const txMethods = contractABI.filter(
        (def) => def.type === 'function' && def.stateMutability !== 'view'
      )
      const txMethodNames = txMethods.map((def) => def.name!)

      // prompt for function
      const functionPromptName = contractName + ' Function'
      const functionAnswer = await inquirer.prompt({
        name: functionPromptName,
        type: 'list',
        choices: txMethodNames,
      })
      const functionName = functionAnswer[functionPromptName] as string
      const idx = txMethodNames.findIndex((m) => m === functionName)
      const txDefinition = txMethods[idx]

      // prompt individually for each argument
      const args = []
      for (const functionInput of txDefinition.inputs!) {
        const inputAnswer = await inquirer.prompt({
          name: functionInput.name,
          type: 'input',
          validate: async (input: string) => {
            switch (functionInput.type) {
              case 'uint256':
                const parsed = parseInt(input, 10)
                return !isNaN(parsed)
              case 'boolean':
                return input === 'true' || input === 'false'
              case 'address':
                return isValidAddress(input)
              case 'bytes':
                return isHexString(input)
              default:
                return true
            }
          },
        })
        args.push(inputAnswer[functionInput.name])
      }

      // prompt for value only when tx is payable
      let value: string
      if (txDefinition.payable) {
        const valuePromptName = 'Value'
        const valueAnswer = await inquirer.prompt({
          name: valuePromptName,
          type: 'input',
        })
        value = valueAnswer[valuePromptName]
      } else {
        value = '0'
      }

      const tx: ProposalTransactionJSON = {
        contract: contractName,
        function: functionName,
        args,
        value,
      }

      try {
        // use fromJsonTx as well-formed tx validation
        await this.builder.fromJsonTx(tx)
        transactions.push(tx)
      } catch (error) {
        console.error(error)
        console.error('Please retry forming this transaction')
      }
    }

    return transactions
  }
}
