export default class MerkleTreeNode {

    hash: Buffer = Buffer.alloc(0);

    getHashAsString(): string {
        return this.hash.toString('hex');
    }

}
