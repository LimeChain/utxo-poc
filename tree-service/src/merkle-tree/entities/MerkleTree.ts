import HashUtils from '../../core/utilities/HashUtils';
import MerkleTreeNode from './MerkleTreeNode';

const MERKLE_ROOT_INDEX = 1n;

export default class MerkleTree<T extends MerkleTreeNode> {

    depth: number;
    merkleTree: Map<bigint, Buffer> = new Map();
    leaves: T[] = [];

    constructor(depth = 32) {
        this.depth = depth;
    }

    getRootHash(): Buffer {
        return this.merkleTree.get(MERKLE_ROOT_INDEX)!;
    }

    getRootHashAsString(): string {
        return this.getRootHash().toString('hex');
    }

    getSiblingIndex(i: bigint): bigint {
        return i ^ 1n;
    }

    appendLeaf(merkleTreeNode: T) {
        merkleTreeNode.leafIndex = BigInt(this.leaves.length);
        this.leaves.push(merkleTreeNode);
        this.updateMerkleTree(merkleTreeNode);
    }

    updateMerkleTree(merkleTreeNode: T) {
        const nodeHash = merkleTreeNode.hash;
        const merkleLeafIndex = merkleTreeNode.getMerkleLeafIndex(this.depth);

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

    getRootHashAsUint8Array(): Uint8Array {
        return Uint8Array.from(this.getRootHash());
    }

    getPathToRootAsUint8Array(merkleTreeNode: T): Uint8Array {
        const path = new Uint8Array(this.depth);
        const merkleLeafIndex = merkleTreeNode.getMerkleLeafIndex(this.depth);

        // last index is always 0
        path[this.depth - 1] = 0;
        for (let i = path.length - 1; i-- > 0;) {
            const bigI = BigInt(i);
            path[i] = Number((merkleLeafIndex >> bigI) & 1n);
        }

        return path;
    }

    getPathToRootSiblingsHashesAsUint8Array(merkleTreeNode: T): Uint8Array[] {
        const result: Uint8Array[] = [];
        let merkleLeafIndex = merkleTreeNode.getMerkleLeafIndex(this.depth);

        while (merkleLeafIndex > 0) {
            const siblingIndex = this.getSiblingIndex(merkleLeafIndex);
            let siblingHash = this.merkleTree.get(siblingIndex);
            if (siblingHash === undefined) {
                siblingHash = Buffer.alloc(32);
            }
            result.push(Uint8Array.from(siblingHash));

            merkleLeafIndex >>= 1n;
        }

        return result;
    }

}
