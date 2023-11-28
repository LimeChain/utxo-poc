
use dep::std;
use dep::util::indexed_merkle_leaf::IndexedMerkleLeaf;
use dep::util::signed_transaction::SignedTransaction;

global MAX_INPUTS = 1;
global MAX_OUTPUTS = 2;

fn main(low_nullifier_leaf: [IndexedMerkleLeaf; MAX_INPUTS], low_nullifier_root: pub [u8; 32], low_nullifier_path_indices: [Field; 32], low_nullifier_siblings: [[u8; 32]; 32], signed_transaction: SignedTransaction<MAX_INPUTS, MAX_OUTPUTS>) {
    signed_transaction.transaction.verify_low_nullifier(low_nullifier_leaf, low_nullifier_root, low_nullifier_path_indices, low_nullifier_siblings);
}
