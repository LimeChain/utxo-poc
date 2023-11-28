use crate::utxo::UTXO;
use crate::merkle_root;
use crate::biguint::BigUint56;

struct Transaction<N,M> {
    inputs: [UTXO; N], // reference to the previous UTXO output
    outputs: [UTXO; M] // current new UTXO output
}

impl<N,M> Transaction<N,M> {

    fn verify_utxo_inputs(self: Self, utxo_before_root: [u8; 32], utxo_before_path_indices: [Field; 32], utxo_before_siblings: [[u8; 32]; 32]) {
        for i in 0..self.inputs.len() {
            let input = self.inputs[i];
            let computed_root = merkle_root::compute_merkle_root(input.to_bytes_32(), utxo_before_path_indices, utxo_before_siblings);
            assert(utxo_before_root == computed_root);
        }
    }

    fn verify_utxo_outputs(self: Self, utxo_after_root: [u8; 32], utxo_after_path_indices: [Field; 32], utxo_after_siblings: [[u8; 32]; 32]) {
        for i in 0..self.outputs.len() {
            let output = self.outputs[i];
            let computed_root = merkle_root::compute_merkle_root(output.to_bytes_32(), utxo_after_path_indices, utxo_after_siblings);
            assert(utxo_after_root == computed_root);
        }
    }

    fn verify_ownership(self: Self, signer_pub_key_x: [u8; 32], signer_pub_key_y: [u8; 32]) {
        for i in 0..self.inputs.len() {
            let input = self.inputs[i];
            assert(signer_pub_key_x == input.spender_pub_key_x);
            assert(signer_pub_key_y == input.spender_pub_key_y);
        }
    }

    fn check_transaction_values(self: Self) {
        let mut total_value_inputs = BigUint56::zero();
        let mut total_value_outputs = BigUint56::zero(); // we are using BigInt library to accumulate UTXO values

        let input_size = self.inputs.len();
        for i in 0.. input_size {
            total_value_inputs = total_value_inputs.add(BigUint56::from_bytes_32(self.inputs[i].value));
        }

        let output_size = self.outputs.len();
        for i in 0.. output_size {
            total_value_outputs = total_value_outputs.add(BigUint56::from_bytes_32(self.outputs[i].value));
        }
        
        // the transaction total value must be more than zero, but input value must be less than output value
        assert(!total_value_inputs.is_zero());
        assert(!total_value_outputs.is_zero());
        
        //sum of inputs should be less than sum of outputs. The difference is refunded to the sender
        assert(total_value_inputs.gte(total_value_outputs));
    }

}