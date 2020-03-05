# Class: ProposalBuilder

## Hierarchy

* **ProposalBuilder**

## Index

### Constructors

* [constructor](_governance_proposals_.proposalbuilder.md#constructor)

### Methods

* [addJsonTx](_governance_proposals_.proposalbuilder.md#addjsontx)
* [addProxyRepointingTx](_governance_proposals_.proposalbuilder.md#addproxyrepointingtx)
* [addTx](_governance_proposals_.proposalbuilder.md#addtx)
* [addWeb3Tx](_governance_proposals_.proposalbuilder.md#addweb3tx)
* [build](_governance_proposals_.proposalbuilder.md#build)
* [fromJsonTx](_governance_proposals_.proposalbuilder.md#fromjsontx)
* [fromWeb3tx](_governance_proposals_.proposalbuilder.md#fromweb3tx)

## Constructors

###  constructor

\+ **new ProposalBuilder**(`kit`: [ContractKit](_kit_.contractkit.md), `builders`: Array‹function›): *[ProposalBuilder](_governance_proposals_.proposalbuilder.md)*

*Defined in [contractkit/src/governance/proposals.ts:53](https://github.com/celo-org/celo-monorepo/blob/master/packages/contractkit/src/governance/proposals.ts#L53)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`kit` | [ContractKit](_kit_.contractkit.md) | - |
`builders` | Array‹function› | [] |

**Returns:** *[ProposalBuilder](_governance_proposals_.proposalbuilder.md)*

## Methods

###  addJsonTx

▸ **addJsonTx**(`tx`: [ProposalTransactionJSON](../interfaces/_governance_proposals_.proposaltransactionjson.md)): *number*

*Defined in [contractkit/src/governance/proposals.ts:102](https://github.com/celo-org/celo-monorepo/blob/master/packages/contractkit/src/governance/proposals.ts#L102)*

**Parameters:**

Name | Type |
------ | ------ |
`tx` | [ProposalTransactionJSON](../interfaces/_governance_proposals_.proposaltransactionjson.md) |

**Returns:** *number*

___

###  addProxyRepointingTx

▸ **addProxyRepointingTx**(`proxyAddress`: string, `newImplementationAddress`: string): *void*

*Defined in [contractkit/src/governance/proposals.ts:67](https://github.com/celo-org/celo-monorepo/blob/master/packages/contractkit/src/governance/proposals.ts#L67)*

**Parameters:**

Name | Type |
------ | ------ |
`proxyAddress` | string |
`newImplementationAddress` | string |

**Returns:** *void*

___

###  addTx

▸ **addTx**(`tx`: [CeloTransactionObject](_wrappers_basewrapper_.celotransactionobject.md)‹any›, `params`: Partial‹ProposalTxParams›): *void*

*Defined in [contractkit/src/governance/proposals.ts:77](https://github.com/celo-org/celo-monorepo/blob/master/packages/contractkit/src/governance/proposals.ts#L77)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`tx` | [CeloTransactionObject](_wrappers_basewrapper_.celotransactionobject.md)‹any› | - |
`params` | Partial‹ProposalTxParams› | {} |

**Returns:** *void*

___

###  addWeb3Tx

▸ **addWeb3Tx**(`tx`: TransactionObject‹any›, `params`: ProposalTxParams): *number*

*Defined in [contractkit/src/governance/proposals.ts:74](https://github.com/celo-org/celo-monorepo/blob/master/packages/contractkit/src/governance/proposals.ts#L74)*

**Parameters:**

Name | Type |
------ | ------ |
`tx` | TransactionObject‹any› |
`params` | ProposalTxParams |

**Returns:** *number*

___

###  build

▸ **build**(): *Promise‹object[]›*

*Defined in [contractkit/src/governance/proposals.ts:59](https://github.com/celo-org/celo-monorepo/blob/master/packages/contractkit/src/governance/proposals.ts#L59)*

**Returns:** *Promise‹object[]›*

___

###  fromJsonTx

▸ **fromJsonTx**(`tx`: [ProposalTransactionJSON](../interfaces/_governance_proposals_.proposaltransactionjson.md)): *Promise‹object›*

*Defined in [contractkit/src/governance/proposals.ts:87](https://github.com/celo-org/celo-monorepo/blob/master/packages/contractkit/src/governance/proposals.ts#L87)*

**Parameters:**

Name | Type |
------ | ------ |
`tx` | [ProposalTransactionJSON](../interfaces/_governance_proposals_.proposaltransactionjson.md) |

**Returns:** *Promise‹object›*

___

###  fromWeb3tx

▸ **fromWeb3tx**(`tx`: TransactionObject‹any›, `params`: ProposalTxParams): *[ProposalTransaction](../modules/_wrappers_governance_.md#proposaltransaction)*

*Defined in [contractkit/src/governance/proposals.ts:61](https://github.com/celo-org/celo-monorepo/blob/master/packages/contractkit/src/governance/proposals.ts#L61)*

**Parameters:**

Name | Type |
------ | ------ |
`tx` | TransactionObject‹any› |
`params` | ProposalTxParams |

**Returns:** *[ProposalTransaction](../modules/_wrappers_governance_.md#proposaltransaction)*
