use dep::std;

// assuming 32 hex characters per field (16 bytes or 128 out of 254 bits)
// verification keys should always be 114 elements long (16 bytes each element or 128 bits out of 256. VK is from generated contract and has )
fn main(
    verification_key_utxo_signature: [Field; 114],
    proof_utxo_signature: [Field; 93],
    public_inputs_utxo_signature: [Field; 0],
    key_hash_utxo_signature: Field,
    input_aggregation_object: [Field; 16] // all zeros
) -> pub [Field; 16] {
    let output_aggregation_object = std::verify_proof(
        verification_key_utxo_signature.as_slice(),
        proof_utxo_signature.as_slice(),
        public_inputs_utxo_signature.as_slice(),
        key_hash_utxo_signature,
        input_aggregation_object
    );

    let mut output = [0; 16];
    for i in 0..16 {
        output[i] = output_aggregation_object[i];
    }
    output
}
