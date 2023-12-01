import NullifierNode from './NullifierNode';
import MerkleTree from '../../merkle-tree/entities/MerkleTree';

export class NullifierTree {

    merkleTree: MerkleTree<NullifierNode> = new MerkleTree();

    constructor() {
        this.merkleTree.appendLeaf(NullifierNode.newInstance(Buffer.alloc(32)));
    }

    getLowNullifierIndex(nullifierNode: NullifierNode): number {
        const leaves = this.merkleTree.leaves;

        let lowNullifierIndex = 0;
        for (; ;) {
            const node = leaves[lowNullifierIndex];
            if (node.nextIndex === 0 || node.nextValue > nullifierNode.value) {
                break;
            }

            lowNullifierIndex = node.nextIndex;
        }

        return lowNullifierIndex;
    }

    getLowNullifier(nullifierNode: NullifierNode): NullifierNode {
        const leaves = this.merkleTree.leaves;
        const lowNullifierIndex = this.getLowNullifierIndex(nullifierNode);
        return leaves[lowNullifierIndex];
    }

    appendNullifierNode(nullifierNode: NullifierNode) {
        this.merkleTree.appendLeaf(nullifierNode);
        this.updateLinks(nullifierNode, this.merkleTree.leaves.length - 1);
    }

    updateLinks(nullifierNode: NullifierNode, index: number) {
        const leaves = this.merkleTree.leaves;
        const lowNullifierIndex = this.getLowNullifierIndex(nullifierNode);
        const previousNode = leaves[lowNullifierIndex];
        nullifierNode.nextValue = previousNode.nextValue;
        nullifierNode.nextIndex = previousNode.nextIndex;

        previousNode.nextValue = nullifierNode.value;
        previousNode.nextIndex = index;
    }
}
