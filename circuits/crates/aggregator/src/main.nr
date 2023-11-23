use dep::std;

fn main(
    verification_key : [Field],
    proof : [Field],
    public_inputs : [Field],
    key_hash : Field,
    input_aggregation_object : [Field; 16],
    proof_b : [Field],
) -> pub [Field; 16] {
    let output_aggregation_object_a = std::verify_proof(
        verification_key,
        proof,
        public_inputs,
        key_hash,
        input_aggregation_object
    );

    let output_aggregation_object = std::verify_proof(
        verification_key,
        proof_b,
        public_inputs,
        key_hash,
        output_aggregation_object_a
    );

    let mut output = [0; 16];
    for i in 0..16 {
        output[i] = output_aggregation_object[i];
    }
    output
}