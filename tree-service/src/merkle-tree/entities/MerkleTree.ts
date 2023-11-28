import HashUtils from '../../core/utilities/HashUtils';
import MerkleTreeNode from './MerkleTreeNode';

const MERKLE_ROOT_INDEX = 1n;

export default class MerkleTree<T extends MerkleTreeNode> {

    depth: bigint;
    merkleTree: Map<bigint, Buffer> = new Map();
    leaves: T[] = [];

    constructor(depth = 32n) {
        this.depth = depth;
    }

    getRootHash(): Buffer {
        return this.merkleTree.get(MERKLE_ROOT_INDEX)!;
    }

    getRootHashAsString(): string {
        return this.getRootHash().toString('hex');
    }

    appendLeaf(merkleTreeNode: T) {
        this.leaves.push(merkleTreeNode);
        this.updateMerkleTree(this.leaves.length - 1);
    }

    updateMerkleTree(leafIndex: number) {
        const nodeHash = this.leaves[leafIndex].hash;
        const merkleLeafIndex = (MERKLE_ROOT_INDEX << this.depth) + BigInt(leafIndex);

        this.merkleTree.set(merkleLeafIndex, nodeHash);

        let currentMerkleLeafIndex = merkleLeafIndex;
        for (; ;) {
            const parentMerkleLeafIndex = currentMerkleLeafIndex >> 1n;
            if (parentMerkleLeafIndex === 0n) {
                break;
            }

            const merkleLeftLeafIndex = parentMerkleLeafIndex << 1n;
            const merkleRightLeafIndex = merkleLeftLeafIndex + 1n;

            const leftNodeHash = this.merkleTree.get(merkleLeftLeafIndex) ?? Buffer.alloc(32);
            const rightNodeHash = this.merkleTree.get(merkleRightLeafIndex) ?? Buffer.alloc(32);
            const parentNodeHashContent = Buffer.concat([leftNodeHash, rightNodeHash]);
            const parentNodeHash = HashUtils.createHash(parentNodeHashContent);
            this.merkleTree.set(parentMerkleLeafIndex, parentNodeHash);

            currentMerkleLeafIndex = parentMerkleLeafIndex;
        }
    }

}
