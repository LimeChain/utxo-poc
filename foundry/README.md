# utxo-poc
Foundry project interacting with zk verifier for the UTXO PoC

# L1Exiter
- calls UltraVerifier for ZK proof
- validates that the proof supplied is for the correct UTXO graph. Allows instant exit using merkle proof or delayed exit with challenge period

# DummyBlockhashOracle
- holds a mapping from block number to block hash on arbitrary Validium network


## Usage
- set up .env
- deploy using:
```
forge script script/Deploy.s.sol:Deploy --rpc-url $RPC_URL --broadcast -vvvv --verify
```
### Build

```shell
$ forge build
```

### Test

```shell
$ forge test -vvv
```