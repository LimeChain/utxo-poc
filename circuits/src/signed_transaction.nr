use dep::ecrecover::secp256k1;
use dep::std;
use crate::transaction::Transaction;

global TRANSACTION_SIZE = 232; // OUTPUT_SIZE * 2

struct SignedTransaction {
    pub_key_x: [u8; 32],
    pub_key_y: [u8; 32],
    signature: [u8; 64],
    transaction: Transaction
}

impl SignedTransaction {
    //verification logic comes from: https://github.com/colinnielsen/ecrecover-noir/tree/main#methods
    fn verify(self) -> bool {
        let transaction_bytes: [u8; TRANSACTION_SIZE] = self.transaction.to_bytes();
        let hashed_transaction = std::hash::keccak256(transaction_bytes, TRANSACTION_SIZE);
        let key = secp256k1::PubKey::from_xy(self.pub_key_x, self.pub_key_y);
        let res = key.verify_sig(self.signature, hashed_transaction);
        res
    }
}