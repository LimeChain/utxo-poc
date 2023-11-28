# UTXO Model for Validium Exit Games

The entrypoint for the prover is called "main". It receives public (pub) and private inputs, deserialized and read from Prover.toml file.
The resulting proof is stored in proofs/utxo_poc.proof file. The verifier expects the public inputs in Verifier.toml file

# Usage
- Check (generates Prover.toml and Verifier.toml)
```
/usr/bin/time -p -l nargo check
```
- Compile

```
/usr/bin/time -p -l nargo compile --package utxo_inputs
/usr/bin/time -p -l nargo compile --package utxo_outputs
/usr/bin/time -p -l nargo compile --package utxo_ownership
/usr/bin/time -p -l nargo compile --package utxo_signature
/usr/bin/time -p -l nargo compile --package low_nullifier
/usr/bin/time -p -l nargo compile --package aggregator
```
- Generate verifier
```
/usr/bin/time -p -l nargo codegen-verifier
```
