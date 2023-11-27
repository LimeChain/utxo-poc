# UTXO Model for Validium Exit Games

The entrypoint for the prover is called "main". It receives public (pub) and private inputs, deserialized and read from Prover.toml file.
The resulting proof is stored in proofs/utxo_poc.proof file. The verifier expects the public inputs in Verifier.toml file

# Usage
- Check (generates Prover.toml and Verifier.toml)
```
/usr/bin/time -p -l nargo check --package <utxo or low_nullifier>
```
- Compile:
```
/usr/bin/time -p -l nargo compile --package <utxo or low_nullifier>
```

- Prove:
```
/usr/bin/time -p -l nargo prove --package <utxo or low_nullifier>
```

- Generate solidity verifier
```
/usr/bin/time -p -l nargo check --package <utxo or low_nullifier>
```

We cannot compile and run the aggregation until we have proper Prover.toml files so we can prove and get proper proof size