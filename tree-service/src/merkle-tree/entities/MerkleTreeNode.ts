export default class MerkleTreeNode {

    hash: Buffer = Buffer.alloc(0);
    leafIndex: bigint = -1n;

    getHashAsString(): string {
        return this.hash.toString('hex');
    }

    getMerkleLeafIndex(depth: number): bigint {
        return (1n << (BigInt(depth - 1))) + BigInt(this.leafIndex);
    }

}
