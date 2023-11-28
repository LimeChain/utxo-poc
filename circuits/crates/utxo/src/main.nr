
use dep::std;
use dep::util::utxo::UTXO;
use dep::util::transaction::Transaction;
use dep::util::signed_transaction::SignedTransaction;

global MAX_INPUTS = 1;
global MAX_OUTPUTS = 2;

fn main(utxo_before_root: [u8; 32], utxo_before_path_indices: [Field; 32], utxo_before_siblings: [[u8; 32]; 32], utxo_after_root: pub [u8; 32], utxo_after_path_indices: [Field; 32], utxo_after_siblings: [[u8; 32]; 32], signed_transaction: SignedTransaction<MAX_INPUTS, MAX_OUTPUTS>) {
    assert(signed_transaction.verify());
    let transaction = signed_transaction.transaction;

    transaction.verify_utxo_inputs(utxo_before_root, utxo_before_path_indices, utxo_before_siblings);
    transaction.verify_utxo_outputs(utxo_after_root, utxo_after_path_indices, utxo_after_siblings);
    transaction.verify_ownership(signed_transaction.pub_key_x, signed_transaction.pub_key_y);
    transaction.check_transaction_values();
}