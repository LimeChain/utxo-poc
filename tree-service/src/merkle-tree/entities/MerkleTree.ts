import HashUtils from '../../core/utilities/HashUtils';
import MerkleTreeNode from './MerkleTreeNode';

const MERKLE_ROOT_INDEX = 1n;
const MERKLE_DEPTH = 32n;

export default class MerkleTree<N extends MerkleTreeNode> {

    depth: bigint;
    merkleTree: Map<bigint, string> = new Map();
    leaves: N[] = [];

    constructor(depth = 32n) {
        this.depth = depth;
    }

    getRootHash(): string {
        return this.merkleTree.get(MERKLE_ROOT_INDEX)!;
    }

    appendLeaf(merkleTreeNode: N) {
        this.leaves.push(merkleTreeNode);
        this.updateMerkleTree(this.leaves.length - 1);
    }

    updateMerkleTree(leafIndex: number) {
        const nodeHash = this.leaves[leafIndex].hash;
        const merkleLeafIndex = (MERKLE_ROOT_INDEX << MERKLE_DEPTH) + BigInt(leafIndex);

        this.merkleTree.set(merkleLeafIndex, nodeHash);

        let currentMerkleLeafIndex = merkleLeafIndex;
        for (; ;) {
            const parentMerkleLeafIndex = currentMerkleLeafIndex >> 1n;
            if (parentMerkleLeafIndex === 0n) {
                break;
            }

            const merkleLeftLeafIndex = parentMerkleLeafIndex << 1n;
            const merkleRightLeafIndex = merkleLeftLeafIndex + 1n;

            const leftNodeHash = this.merkleTree.get(merkleLeftLeafIndex) ?? '';
            const rightNodeHash = this.merkleTree.get(merkleRightLeafIndex) ?? '';
            const parentNodeHashContent = leftNodeHash + rightNodeHash;
            const parentNodeHash = HashUtils.createHash(parentNodeHashContent);
            this.merkleTree.set(parentMerkleLeafIndex, parentNodeHash);

            currentMerkleLeafIndex = parentMerkleLeafIndex;
        }
    }

}
