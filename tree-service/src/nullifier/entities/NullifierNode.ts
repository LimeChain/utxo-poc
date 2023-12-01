import BigIntUtils from '../../core/utilities/BigIntUtils';
import MerkleTreeNode from '../../merkle-tree/entities/MerkleTreeNode';

export default class NullifierNode extends MerkleTreeNode {

    value: bigint = 0n;
    nextIndex: number = 0;
    nextValue: bigint = 0n;

    static newInstance(utxoNodeHash: Buffer) {
        const node = new NullifierNode();

        node.value = BigInt(`0x${utxoNodeHash.toString('hex')}`);
        node.nextIndex = 0;
        node.nextValue = 0n;
        node.hash = utxoNodeHash;

        return node;
    }

    getValueAsUint8Array(): Uint8Array {
        return BigIntUtils.convertBigIntToUint8Array(this.value);
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
        return BigIntUtils.convertBigIntToUint8Array(this.nextValue);
    }

}
