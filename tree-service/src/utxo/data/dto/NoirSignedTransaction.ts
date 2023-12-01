import UtxoTransaction from '../../entities/UtxoTransaction';
import NoirTransaction from './NoirTransaction';

export default class NoirSignedTransaction {

    pub_key_x: number[] = [];
    pub_key_y: number[] = [];
    signature: number[] = [];
    tx_hash: number[] = [];
    transaction: NoirTransaction = new NoirTransaction();

    static fromUtxoTransaction(utxoTransaction: UtxoTransaction) {
        const dto = new NoirSignedTransaction();

        dto.pub_key_x = Array.from(utxoTransaction.getPubKeyXAsUint8Array());
        dto.pub_key_y = Array.from(utxoTransaction.getPubKeyYAsUint8Array());
        dto.signature = Array.from(utxoTransaction.getSignatureAsUint8Array());
        dto.tx_hash = Array.from(utxoTransaction.getUnsignedTxHashAsUint8Array());
        dto.transaction = NoirTransaction.fromUtxoNodes(utxoTransaction.inputs[0], utxoTransaction.outputs);

        return dto;
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
