use dep::std;

use crate::secp256k1::PubKey;
use crate::transaction::Transaction;

global TRANSACTION_SIZE = 232; // OUTPUT_SIZE * 2

struct SignedTransaction<N,M> {
    pub_key_x: [u8; 32],
    pub_key_y: [u8; 32],
    signature: [u8; 64],
    tx_hash: [u8; 32],
    transaction: Transaction<N,M>
}

impl<N, M> SignedTransaction<N, M> {
    //verification logic comes from: https://github.com/colinnielsen/ecrecover-noir/tree/main#methods
    fn verify(self) -> bool {
        let key = PubKey::from_xy(self.pub_key_x, self.pub_key_y);
        let res = key.verify_sig(self.signature, self.tx_hash);
        res
    }
}