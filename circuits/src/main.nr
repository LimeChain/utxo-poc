
mod indexed_merkle_leaf;
mod output;
mod transaction;
mod signed_transaction;

use dep::noir_biguint;
use dep::std;
use crate::output::Output;
use crate::transaction::Transaction;
use crate::signed_transaction::SignedTransaction;
use crate::indexed_merkle_leaf::IndexedMerkleLeaf;

// NOTE: we need to initially compress the Output leaf to 32 bytes before passing it to the function
fn compute_merkle_root(leaf: [u8; 32], path_indices: [Field; 32], siblings: [[u8; 32]; 32]) -> [u8; 32] {
    let mut current = leaf;
    for i in 0..32 { //depth 32
        let is_right = (path_indices[i] == 1) as bool;
        let mut arr: [u8; 64] = [0; 64];
        let mut index = 0;
        for j in 0..32 { // each one of 32 bytes
            if(is_right) {
                arr[index] = siblings[i][j];
                index += 1;
            } else {
                arr[index] = current[j];
                index += 1;
            }
        }
        
        for j in 0..32 { // each one of 32 bytes
            if(is_right) {
                arr[index] = current[j];
                index += 1;
            } else {
                arr[index] = siblings[i][j];
                index += 1;
            }
        }
        
        current = std::hash::keccak256(arr, 64);

    }

    current
}

//then check inputs are available and required amount is available
fn check_input_output_values(input: Output, output: Output) {
    let mut total_value_inputs = noir_biguint::BigUint56::zero();
    let mut total_value_outputs = noir_biguint::BigUint56::zero(); // we are using BigInt library to accumulate UTXO values

    //maybe add with carry and assert there is no overflow
    total_value_inputs = total_value_inputs.add(noir_biguint::BigUint56::from_bytes(input.value));
    total_value_outputs = total_value_outputs.add(noir_biguint::BigUint56::from_bytes(output.value));


    // the transaction total value must be more than zero, but input value must be less than output value
    assert(!total_value_outputs.is_zero());
    assert(!total_value_inputs.is_zero());
    assert(total_value_inputs.lt(total_value_outputs));
}

// utxo_before and utxo_after are the sets of UTXOs before and after executing the transaction traces
// each one of them is represented as merkle tree root, path indices (0 or 1 representing left or right side) and sibling path (array of intermediary tree values).
// The nullifier tree will be append-only and should be used to proove UTXO has not been spent using merkle non-inclusion proof.
// nullifier
// Merkle tree of depth 32 should be enough to represent 4 billion UTXOs, enough to cover the next 27 years at 5 TPS at full usage.
fn main(utxo_before_root: [u8; 32], utxo_before_path_indices: [Field; 32], utxo_before_siblings: [[u8; 32]; 32], utxo_after_root: [u8; 32], utxo_after_path_indices: [Field; 32], utxo_after_siblings: [[u8; 32]; 32], low_nullifier_leaf: IndexedMerkleLeaf, low_nullifier_root: [u8; 32], low_nullifier_path_indices: [Field; 32], low_nullifier_siblings: [[u8; 32]; 32], signed_transaction: SignedTransaction) {

        //Ensure that the signature is signed by the same owner that claims to have access to UTXO before
        assert(signed_transaction.verify());
        let transaction = signed_transaction.transaction;

        check_input_output_values(transaction.input, transaction.output);
        
        //assert utxo input index exists in utxo set before (use it as leaf index)
        let computed_root = compute_merkle_root(transaction.input.to_bytes_32(), utxo_before_path_indices, utxo_before_siblings);
        assert(utxo_before_root == computed_root);
        std::println(computed_root);

        //assert the new utxo output has been added to the utxo tree after the transaction
        let computed_root = compute_merkle_root(transaction.output.to_bytes_32(), utxo_after_path_indices, utxo_after_siblings);
        assert(utxo_after_root == computed_root);
        std::println(computed_root);

        //ownership check
        //assert the transaction signer public key is the same as the input utxo spender public key
        assert(signed_transaction.pub_key_x == transaction.input.spender_pub_key_x);
        assert(signed_transaction.pub_key_y == transaction.input.spender_pub_key_y);

        //UTXO input merkle non-inclusion proof
        // https://docs.aztec.network/concepts/advanced/data_structures/indexed_merkle_tree#non-membership-proof

        //hash the low nullifier
        let low_nullifier_hash = low_nullifier_leaf.to_bytes_32();

        //Prove the low leaf exists in the tree: n hashes.
        let computed_root = compute_merkle_root(low_nullifier_hash, low_nullifier_path_indices, low_nullifier_siblings);
        assert(low_nullifier_root == computed_root);
        std::println(computed_root);
        
        let low_nullifier_value = noir_biguint::BigUint56::from_bytes(low_nullifier_leaf.val.value);
        let new_nullifier_value = noir_biguint::BigUint56::from_bytes(transaction.input.value);
        if(low_nullifier_leaf.nextIdx == 0) {
            //Special case, the low leaf is at the very end, so the new_value must be higher than all values in the tree
            assert(low_nullifier_value.lt(new_nullifier_value));
        } else {
            let low_nullifier_next_value = noir_biguint::BigUint56::from_bytes(low_nullifier_leaf.nextVal.value);
            assert(low_nullifier_next_value.gt(new_nullifier_value));
            assert(low_nullifier_value.lt(new_nullifier_value));
        }
}
