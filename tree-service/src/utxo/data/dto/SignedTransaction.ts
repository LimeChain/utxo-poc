import { JsonMap } from '@iarna/toml';
import UtxoTransaction from '../../entities/UtxoTransaction';
import Transaction from './Transaction';

export default class SignedTransaction {

    pub_key_x: Uint8Array = new Uint8Array(0);
    pub_key_y: Uint8Array = new Uint8Array(0);
    signature: Uint8Array = new Uint8Array(0);
    tx_hash: Uint8Array = new Uint8Array(0);
    transaction: Transaction = new Transaction();

    static fromUtxoTransaction(utxoTransaction: UtxoTransaction) {
        const signedTransaction = new SignedTransaction();

        signedTransaction.pub_key_x = utxoTransaction.getPubKeyXAsUint8Array();
        signedTransaction.pub_key_y = utxoTransaction.getPubKeyYAsUint8Array();
        signedTransaction.signature = utxoTransaction.getSignatureAsUint8Array();
        signedTransaction.tx_hash = utxoTransaction.getHashAsUint8Array();
        signedTransaction.transaction = Transaction.fromUtxoNodes(utxoTransaction.inputs[0], utxoTransaction.outputs);

        return signedTransaction;
    }

    toJsonMap(): JsonMap {
        return {
            'signed_transaction': {
                'pub_key_x': Array.from(this.pub_key_x),
                'pub_key_y': Array.from(this.pub_key_y),
                'signature': Array.from(this.signature),
                'tx_hash': Array.from(this.tx_hash),
                'transaction': this.transaction.toJsonMap(),
            }
        };
    }

}
