# UTXO Model for Validium Exit Games

The entrypoint for the prover is called "main". It receives public (pub) and private inputs, deserialized and read from Prover.toml file.
The resulting proof is stored in proofs/utxo_poc.proof file. The verifier expects the public inputs in Verifier.toml file

# Usage
- Prove:
```
nargo prove
```
- Verify:
```
nargo verify
```
- Generate solidity verifier
```
nargo codegen-verifier
```