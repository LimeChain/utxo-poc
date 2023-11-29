use dep::std;

fn main(
    verification_key_a : [Field; 114], // TODO: check this
    proof_a : [Field; 100], // TODO: check this
    public_inputs_a : [Field; 1],
    key_hash_a : Field,
    input_aggregation_object : [Field; 16],
    verification_key_b : [Field; 114], // TODO: check this
    proof_b : [Field; 100], // TODO: check this
    public_inputs_b : [Field; 1],
    key_hash_b : Field
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