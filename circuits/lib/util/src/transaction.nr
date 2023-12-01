use crate::utxo::UTXO;
use crate::merkle_root;
use crate::biguint::BigUint56;
use crate::indexed_merkle_leaf::IndexedMerkleLeaf;

struct Transaction<N,M> {
    inputs: [UTXO; N], // reference to the previous UTXO output
    outputs: [UTXO; M] // current new UTXO output
}

impl<N,M> Transaction<N,M> {

    fn verify_utxo_inputs(self: Self, root: [u8; 32], are_nodes_right: [[Field; 32]; N], siblings: [[[u8; 32]; 32]; N]) {
        for i in 0..self.inputs.len() {
            let input = self.inputs[i];
            let computed_root = merkle_root::compute_merkle_root(input.to_bytes_32(), are_nodes_right[i], siblings[i]);
            assert(root == computed_root);
        }
    }

    fn verify_utxo_outputs(self: Self, root: [u8; 32], are_nodes_right: [[Field; 32]; M], siblings: [[[u8; 32]; 32]; M]) {
        for i in 0..self.outputs.len() {
            let output = self.outputs[i];
            let computed_root = merkle_root::compute_merkle_root(output.to_bytes_32(), are_nodes_right[i], siblings[i]);
            assert(root == computed_root);
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

    // here new nullifier is the value of the input UTXO
    fn verify_low_nullifier(self: Self, low_nullifier_leaf: [IndexedMerkleLeaf; N], root: [u8; 32], are_nodes_right: [[Field; 32]; N], siblings: [[[u8; 32]; 32]; N]) {
        for i in 0 .. self.inputs.len() {
            let low_nullifier_hash = low_nullifier_leaf[i].to_bytes_32();
            let computed_root = merkle_root::compute_merkle_root(low_nullifier_hash, are_nodes_right[i], siblings[i]);
            assert(root == computed_root);

            // we are casting hash to number and checking hash values. 
            // The low_nullifier tree must be indexed and sorted for this to work
            let low_nullifier_value = BigUint56::from_bytes_32(low_nullifier_leaf[i].val);
            let new_nullifier_value = BigUint56::from_bytes_32(self.inputs[i].to_bytes_32());
            if(low_nullifier_leaf[i].nextIdx == 0) {
                //Special case, the low leaf is at the very end, so the new_value must be higher than all values in the tree
                assert(low_nullifier_value.lt(new_nullifier_value));
            } else {
                let low_nullifier_next_value = BigUint56::from_bytes_32(low_nullifier_leaf[i].nextVal);
                assert(low_nullifier_next_value.gt(new_nullifier_value));
                assert(low_nullifier_value.lt(new_nullifier_value));
            }
        }
    }

}