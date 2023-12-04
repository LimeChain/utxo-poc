
use dep::std;
use dep::util::signed_transaction::SignedTransaction;

global MAX_INPUTS = 1;
global MAX_OUTPUTS = 2;

fn main(root: [u8; 32], are_nodes_right: [[Field; 32]; MAX_OUTPUTS], siblings: [[[u8; 32]; 32]; MAX_OUTPUTS], signed_transaction: SignedTransaction<MAX_INPUTS, MAX_OUTPUTS>) {
    signed_transaction.transaction.verify_utxo_outputs(root, are_nodes_right, siblings);
}