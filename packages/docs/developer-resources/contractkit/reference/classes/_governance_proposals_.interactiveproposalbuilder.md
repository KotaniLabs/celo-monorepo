# Class: InteractiveProposalBuilder

## Hierarchy

* **InteractiveProposalBuilder**

## Index

### Constructors

* [constructor](_governance_proposals_.interactiveproposalbuilder.md#constructor)

### Methods

* [outputTransactions](_governance_proposals_.interactiveproposalbuilder.md#outputtransactions)
* [promptTransactions](_governance_proposals_.interactiveproposalbuilder.md#prompttransactions)

## Constructors

###  constructor

\+ **new InteractiveProposalBuilder**(`builder`: [ProposalBuilder](_governance_proposals_.proposalbuilder.md)): *[InteractiveProposalBuilder](_governance_proposals_.interactiveproposalbuilder.md)*

*Defined in [contractkit/src/governance/proposals.ts:105](https://github.com/celo-org/celo-monorepo/blob/master/packages/contractkit/src/governance/proposals.ts#L105)*

**Parameters:**

Name | Type |
------ | ------ |
`builder` | [ProposalBuilder](_governance_proposals_.proposalbuilder.md) |

**Returns:** *[InteractiveProposalBuilder](_governance_proposals_.interactiveproposalbuilder.md)*

## Methods

###  outputTransactions

▸ **outputTransactions**(): *Promise‹void›*

*Defined in [contractkit/src/governance/proposals.ts:108](https://github.com/celo-org/celo-monorepo/blob/master/packages/contractkit/src/governance/proposals.ts#L108)*

**Returns:** *Promise‹void›*

___

###  promptTransactions

▸ **promptTransactions**(`num`: number): *Promise‹[ProposalTransactionJSON](../interfaces/_governance_proposals_.proposaltransactionjson.md)[]›*

*Defined in [contractkit/src/governance/proposals.ts:113](https://github.com/celo-org/celo-monorepo/blob/master/packages/contractkit/src/governance/proposals.ts#L113)*

**Parameters:**

Name | Type |
------ | ------ |
`num` | number |

**Returns:** *Promise‹[ProposalTransactionJSON](../interfaces/_governance_proposals_.proposaltransactionjson.md)[]›*
