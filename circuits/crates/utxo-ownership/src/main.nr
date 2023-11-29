
use dep::std;
use dep::util::signed_transaction::SignedTransaction;

global MAX_INPUTS = 1;
global MAX_OUTPUTS = 2;

fn main(signed_transaction: SignedTransaction<MAX_INPUTS, MAX_OUTPUTS>) {
    signed_transaction.transaction.verify_ownership(signed_transaction.pub_key_x, signed_transaction.pub_key_y);
}