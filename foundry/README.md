# utxo-poc
Foundry project interacting with zk verifier for the UTXO PoC

# L1Exiter
- calls UltraVerifier for ZK proof
- validates that the proof supplied is for the correct UTXO graph. Allows instant exit using merkle proof or delayed exit with challenge period

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
```
- Prepopulate the contract with 3 UTXOs

```
cast send --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --rpc-url http:127.0.0.1:8545 --value 1ether $EXITER_ADDRESS
cast send --private-key 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d --rpc-url http:127.0.0.1:8545 --value 2ether $EXITER_ADDRESS
cast send --private-key 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a --rpc-url http:127.0.0.1:8545 --value 3ether $EXITER_ADDRESS
```

- send a transfer (1 wei from acc 1 -> acc 2; 2 wei from acc 2 -> acc 3; 3 wei from acc 3 -> acc 1)
```
cast send --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --rpc-url http:127.0.0.1:8545 --value 0.5ether 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
cast send --private-key 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d --rpc-url http:127.0.0.1:8545 --value 1ether 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
cast send --private-key 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a --rpc-url http:127.0.0.1:8545 --value 1.5ether 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
```