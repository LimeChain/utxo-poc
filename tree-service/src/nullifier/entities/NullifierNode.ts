import HashUtils from '../../core/utilities/HashUtils';
import MerkleTreeNode from '../../merkle-tree/entities/MerkleTreeNode';

export default class NullifierNode extends MerkleTreeNode {

    value: string = '';
    nextIndex: number = 0;
    nextValue: string = '';

    static newInstance(utxoNodeHash: Buffer) {
        const node = new NullifierNode();

        node.value = utxoNodeHash.toString('hex');
        node.nextIndex = 0;
        node.nextValue = Buffer.alloc(32).toString('hex');
        node.hash = node.createHash();

        return node;
    }

    getValueAsUint8Array(): Uint8Array {
        return Uint8Array.from(Buffer.from(this.value, 'hex'));
    }

    getNextIndexAsUint8Array(): Uint8Array {
        const result = new Uint8Array(4);

        for (let i = 0; i < result.length; ++i) {
            const shiftAmount = 24 - (i << 3);
            result[i] = Number((this.nextIndex >> shiftAmount) & 0xFF);
        }

        return result;
    }

    getNextValueAsUint8Array(): Uint8Array {
        return Uint8Array.from(Buffer.from(this.nextValue, 'hex'));
    }

    createHash(): Buffer {
        return HashUtils.createHash(Buffer.concat([
            Buffer.from(this.getValueAsUint8Array()),
            // Buffer.from(this.getNextValueAsUint8Array()),
            // Buffer.from(this.getNextIndexAsUint8Array()),
        ]))
    }

}
