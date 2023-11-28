
use dep::std;
use dep::util::transaction::Transaction;
use dep::util::signed_transaction::SignedTransaction;

global MAX_INPUTS = 1;
global MAX_OUTPUTS = 1;

fn main(signed_transaction: SignedTransaction<MAX_INPUTS, MAX_OUTPUTS>) {
    assert(signed_transaction.verify());
}