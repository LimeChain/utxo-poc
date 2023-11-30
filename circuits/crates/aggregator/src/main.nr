use dep::std;

// assuming 32 hex characters per field (16 bytes or 128 out of 254 bits)
// verification keys should always be 114 elements long (16 bytes each element or 128 bits out of 256. VK is from generated contract and has )
fn main(
    verification_key_utxo_signature : [Field; 114],
    verification_key_utxo_ownership : [Field; 114], //TODO: check
    verification_key_utxo_inputs : [Field; 114], //TODO: check
    verification_key_utxo_outputs : [Field; 114], //TODO: check
    verification_key_low_nullifier : [Field; 114], //TODO: check
    proof_utxo_signature : [Field; 100], // TODO: check this
    proof_utxo_ownership : [Field; 134], // TODO: check this
    proof_utxo_inputs : [Field; 100], // TODO: check this
    proof_utxo_outputs : [Field; 100], // TODO: check this
    proof_low_nullifier : [Field; 100], // TODO: check this
    key_hash_utxo_signature : Field,
    key_hash_utxo_ownership : Field,
    key_hash_utxo_inputs : Field,
    key_hash_utxo_outputs : Field,
    key_hash_low_nullifier : Field,
    public_inputs_utxo_outputs : [Field; 1],
    public_inputs_low_nullifier : [Field; 1],
   input_aggregation_object : [Field; 16], // al zeros
) -> pub [Field; 16] {
    let output_aggregation_object_a = std::verify_proof(
        verification_key_a.as_slice(),
        proof_a.as_slice(),
        public_inputs_a.as_slice(),
        key_hash_a,
        input_aggregation_object
    );

    let output_aggregation_object = std::verify_proof(
        verification_key_b.as_slice(),
        proof_b.as_slice(),
        public_inputs_b.as_slice(),
        key_hash_b,
        output_aggregation_object_a
    );

    let mut output = [0; 16];
    for i in 0..16 {
        output[i] = output_aggregation_object[i];
    }
    output
}