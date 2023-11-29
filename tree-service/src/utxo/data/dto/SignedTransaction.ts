import UtxoTransaction from '../../entities/UtxoTransaction';
import Transaction from './Transaction';

export default class SignedTransaction {

    pub_key_x: number[] = [];
    pub_key_y: number[] = [];
    signature: number[] = [];
    tx_hash: number[] = [];
    transaction: Transaction = new Transaction();

    static fromUtxoTransaction(utxoTransaction: UtxoTransaction) {
        const signedTransaction = new SignedTransaction();

        signedTransaction.pub_key_x = Array.from(utxoTransaction.getPubKeyXAsUint8Array());
        signedTransaction.pub_key_y = Array.from(utxoTransaction.getPubKeyYAsUint8Array());
        signedTransaction.signature = Array.from(utxoTransaction.getSignatureAsUint8Array());
        signedTransaction.tx_hash = Array.from(utxoTransaction.getHashAsUint8Array());
        signedTransaction.transaction = Transaction.fromUtxoNodes(utxoTransaction.inputs[0], utxoTransaction.outputs);

        return signedTransaction;
    }

    toToml(path: string): string {
        const buffers: string[] = [];

        buffers.push(`[${path}]`)
        buffers.push(`pub_key_x = ${JSON.stringify(this.pub_key_x)}`);
        buffers.push(`pub_key_y = ${JSON.stringify(this.pub_key_y)}`);
        buffers.push(`signature = ${JSON.stringify(this.signature)}`);
        buffers.push(`tx_hash = ${JSON.stringify(this.tx_hash)}`);
        buffers.push(`\n`);
        buffers.push(this.transaction.toToml(path + '.transaction'));

        return buffers.join('\n');
    }

}
