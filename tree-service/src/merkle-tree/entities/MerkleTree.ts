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
        const merkleLeafIndex = (MERKLE_ROOT_INDEX << (BigInt(this.depth - 1))) + BigInt(merkleTreeNode.leafIndex);

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

    getPathToRoot(merkleTreeNode: T): Uint8Array {
        const path = new Uint8Array(this.depth);
        const leafIndex = merkleTreeNode.leafIndex;

        // last index is always 0
        path[this.depth - 1] = 0;
        for (let i = path.length - 1; i-- > 0;) {
            const bigI = BigInt(i);
            path[i] = Number((leafIndex >> bigI) & 1n);
        }

        return path;
    }

    getPathToRootSiblingsHashes(merkleTreeNode: T): Uint8Array[] {
        const result: Uint8Array[] = [];
        let leafIndex = merkleTreeNode.leafIndex;

        while (leafIndex > MERKLE_ROOT_INDEX) {
            const siblingIndex = this.getSiblingIndex(leafIndex);
            const siblingHash = this.merkleTree.get(siblingIndex);
            if (siblingHash === undefined) {
                console.log('unable to find sibling with index', siblingIndex, 'from index', leafIndex);
                process.exit(1);
            }
            result.push(Uint8Array.from(siblingHash));

            leafIndex >>= 1n;
        }

        return result;
    }

}
