
use dep::std;
use dep::util::output::Output;
use dep::util::transaction::Transaction;
use dep::util::signed_transaction::SignedTransaction;
use dep::util::indexed_merkle_leaf::IndexedMerkleLeaf;
use dep::util::merkle_root;
use dep::util::biguint::BigUint56;

fn verify_utxo_input(utxo_before_root: [u8; 32], utxo_before_path_indices: [Field; 32], utxo_before_siblings: [[u8; 32]; 32], transaction: Transaction) {
    let computed_root = merkle_root::compute_merkle_root(transaction.input.to_bytes_32(), utxo_before_path_indices, utxo_before_siblings);
    assert(utxo_before_root == computed_root);
}

fn verify_utxo_output(utxo_after_root: [u8; 32], utxo_after_path_indices: [Field; 32], utxo_after_siblings: [[u8; 32]; 32], transaction: Transaction) {
    let computed_root = merkle_root::compute_merkle_root(transaction.output.to_bytes_32(), utxo_after_path_indices, utxo_after_siblings);
    assert(utxo_after_root == computed_root);
}

fn verify_ownership(signed_transaction: SignedTransaction, transaction: Transaction) {
    assert(signed_transaction.pub_key_x == transaction.input.spender_pub_key_x);
    assert(signed_transaction.pub_key_y == transaction.input.spender_pub_key_y);
}

fn check_transaction_values(transaction: Transaction) {
    let mut total_value_inputs = BigUint56::zero();
    let mut total_value_outputs = BigUint56::zero(); // we are using BigInt library to accumulate UTXO values

    //maybe add with carry and assert there is no overflow
    total_value_inputs = total_value_inputs.add(BigUint56::from_bytes_32(transaction.input.value));
    total_value_outputs = total_value_outputs.add(BigUint56::from_bytes_32(transaction.output.value));

    // the transaction total value must be more than zero, but input value must be less than output value
    assert(!total_value_inputs.is_zero());
    assert(!total_value_outputs.is_zero());
    //sanity check:  is this correct?
    assert(total_value_inputs.gte(total_value_outputs));
}

fn main(utxo_before_root: [u8; 32], utxo_before_path_indices: [Field; 32], utxo_before_siblings: [[u8; 32]; 32], pub utxo_after_root: [u8; 32], utxo_after_path_indices: [Field; 32], utxo_after_siblings: [[u8; 32]; 32], signed_transaction: SignedTransaction) {
    assert(signed_transaction.verify());
    let transaction = signed_transaction.transaction;

    verify_utxo_input(utxo_before_root, utxo_before_path_indices, utxo_before_siblings, transaction);
    verify_utxo_output(utxo_after_root, utxo_after_path_indices, utxo_after_siblings, transaction);
    verify_ownership(signed_transaction, transaction);

    check_transaction_values(transaction);
}