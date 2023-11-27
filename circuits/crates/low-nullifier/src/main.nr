
use dep::std;
use dep::util::output::Output;
use dep::util::transaction::Transaction;
use dep::util::signed_transaction::SignedTransaction;
use dep::util::indexed_merkle_leaf::IndexedMerkleLeaf;
use dep::util::merkle_root::compute_merkle_root;
use dep::util::biguint::BigUint56;

fn verify_low_nullifier(low_nullifier_leaf: IndexedMerkleLeaf, pub low_nullifier_root: [u8; 32], low_nullifier_path_indices: [Field; 32], low_nullifier_siblings: [[u8; 32]; 32], new_nullifier: [u8; 32]) {
    let low_nullifier_hash = low_nullifier_leaf.to_bytes_32();
    let computed_root = compute_merkle_root(low_nullifier_hash, low_nullifier_path_indices, low_nullifier_siblings);
    assert(low_nullifier_root == computed_root);

    let low_nullifier_value = BigUint56::from_bytes_32(low_nullifier_leaf.val.value);
    let new_nullifier_value = BigUint56::from_bytes_32(new_nullifier);
    if(low_nullifier_leaf.nextIdx == 0) {
        //Special case, the low leaf is at the very end, so the new_value must be higher than all values in the tree
        assert(low_nullifier_value.lt(new_nullifier_value));
    } else {
        let low_nullifier_next_value = BigUint56::from_bytes_32(low_nullifier_leaf.nextVal.value);
        assert(low_nullifier_next_value.gt(new_nullifier_value));
        assert(low_nullifier_value.lt(new_nullifier_value));
    }
}

fn main(low_nullifier_leaf: IndexedMerkleLeaf, low_nullifier_root: [u8; 32], low_nullifier_path_indices: [Field; 32], low_nullifier_siblings: [[u8; 32]; 32], new_nullifier: [u8; 32]) {
    verify_low_nullifier(low_nullifier_leaf, low_nullifier_root, low_nullifier_path_indices, low_nullifier_siblings, new_nullifier);
}
