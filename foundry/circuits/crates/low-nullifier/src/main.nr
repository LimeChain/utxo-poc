
use dep::std;
use dep::util::indexed_merkle_leaf::IndexedMerkleLeaf;
use dep::util::signed_transaction::SignedTransaction;

global MAX_INPUTS = 1;
global MAX_OUTPUTS = 2;

fn main(low_nullifier_leaf: [IndexedMerkleLeaf; MAX_INPUTS], root: [u8; 32], are_nodes_right: [[Field; 32]; MAX_INPUTS], siblings: [[[u8; 32]; 32]; MAX_INPUTS], signed_transaction: SignedTransaction<MAX_INPUTS, MAX_OUTPUTS>) {
    signed_transaction.transaction.verify_low_nullifier(low_nullifier_leaf, root, are_nodes_right, siblings);
}
