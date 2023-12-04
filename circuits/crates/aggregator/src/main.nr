use dep::std;

// assuming 32 hex characters per field (16 bytes or 128 out of 254 bits)
// verification keys should always be 114 elements long (16 bytes each element or 128 bits out of 256. VK is from generated contract and has )
fn main(
    verification_key_utxo_signature : [Field; 114],
    verification_key_utxo_ownership : [Field; 114],
    verification_key_utxo_inputs : [Field; 114],
    verification_key_utxo_outputs : [Field; 114],
    verification_key_low_nullifier : [Field; 114],
    proof_utxo_signature : [Field; 134],
    proof_utxo_ownership : [Field; 134],
    proof_utxo_inputs : [Field; 134],
    proof_utxo_outputs : [Field; 134],
    proof_low_nullifier : [Field; 134],
    public_inputs_utxo_signature : [Field; 0],
    public_inputs_utxo_ownership : [Field; 0],
    public_inputs_utxo_inputs : [Field; 0],
    public_inputs_utxo_outputs : [Field; 32],
    public_inputs_low_nullifier : [Field; 32],
    key_hash_utxo_signature : Field,
    key_hash_utxo_ownership : Field,
    key_hash_utxo_inputs : Field,
    key_hash_utxo_outputs : Field,
    key_hash_low_nullifier : Field,
   input_aggregation_object : [Field; 16], // all zeros
) -> pub [Field; 16] {
    let output_aggregation_object_a = std::verify_proof(
        verification_key_utxo_signature.as_slice(),
        proof_utxo_signature.as_slice(),
        public_inputs_utxo_signature.as_slice(),
        key_hash_utxo_signature,
        input_aggregation_object
    );

    let output_aggregation_object_b = std::verify_proof(
        verification_key_utxo_ownership.as_slice(),
        proof_utxo_ownership.as_slice(),
        public_inputs_utxo_ownership.as_slice(),
        key_hash_utxo_ownership,
        output_aggregation_object_a
    );
    
    let output_aggregation_object_c = std::verify_proof(
        verification_key_utxo_inputs.as_slice(),
        proof_utxo_inputs.as_slice(),
        public_inputs_utxo_inputs.as_slice(),
        key_hash_utxo_inputs,
        output_aggregation_object_b
    );

    let output_aggregation_object_d = std::verify_proof(
        verification_key_utxo_outputs.as_slice(),
        proof_utxo_outputs.as_slice(),
        public_inputs_utxo_outputs.as_slice(),
        key_hash_utxo_outputs,
        output_aggregation_object_c
    );

        let output_aggregation_object = std::verify_proof(
        verification_key_low_nullifier.as_slice(),
        proof_low_nullifier.as_slice(),
        public_inputs_low_nullifier.as_slice(),
        key_hash_low_nullifier,
        output_aggregation_object_d
    );

    let mut output = [0; 16];
    for i in 0..16 {
        output[i] = output_aggregation_object[i];
    }
    output
}