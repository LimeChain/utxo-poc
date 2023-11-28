
use dep::std;
use dep::util::signed_transaction::SignedTransaction;

global MAX_INPUTS = 1;
global MAX_OUTPUTS = 2;

fn main(utxo_after_root: pub [u8; 32], utxo_after_path_indices: [Field; 32], utxo_after_siblings: [[u8; 32]; 32], signed_transaction: SignedTransaction<MAX_INPUTS, MAX_OUTPUTS>) {
    signed_transaction.transaction.verify_utxo_outputs(utxo_after_root, utxo_after_path_indices, utxo_after_siblings);
}