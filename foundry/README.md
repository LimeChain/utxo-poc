# utxo-poc
Foundry project interacting with zk verifier for the UTXO PoC

# L1Exiter
- calls UltraVerifier for ZK proof
- validates that the proof supplied is for the correct UTXO graph. Allows instant exit using merkle proof or delayed exit with challenge period

# DummyBlockhashOracle
- holds a mapping from block number to block hash on arbitrary Validium network


## Usage
- set up .env
- set up local network:
```
anvil
```
- deploy using:
```
forge script script/Deploy.s.sol:Deploy --rpc-url $RPC_URL --broadcast -vvvv
```
- send ETH from 3 accounts to the contract:
```
source .env
cast send --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --rpc-url $RPC_URL $EXITER_ADDRESS
cast send --private-key 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d --rpc-url $RPC_URL $EXITER_ADDRESS
cast send --private-key 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a --rpc-url $RPC_URL $EXITER_ADDRESS
```
### Build

```shell
$ forge build
```