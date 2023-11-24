import NullifierNode from './NullifierNode';
import MerkleTree from '../../merkle-tree/entities/MerkleTree';

export class NullifierTree {

    merkleTree: MerkleTree<NullifierNode> = new MerkleTree();

    constructor() {
        this.merkleTree.appendLeaf(new NullifierNode());
    }

    appendNullifierNode(nullifierNode: NullifierNode) {
        this.merkleTree.appendLeaf(nullifierNode);
        this.updateLinks(nullifierNode, this.merkleTree.leaves.length - 1);
    }

    updateLinks(nullifierNode: NullifierNode, index: number) {
        const leaves = this.merkleTree.leaves;

        let insertAfterIndex = 0;
        for (; ;) {
            const node = leaves[insertAfterIndex];
            if (node.nextIndex === 0 || node.nextValue > nullifierNode.value) {
                break;
            }

            insertAfterIndex = node.nextIndex;
        }

        const previousNode = leaves[insertAfterIndex];
        nullifierNode.nextValue = previousNode.nextValue;
        nullifierNode.nextIndex = previousNode.nextIndex;

        previousNode.nextValue = nullifierNode.value;
        previousNode.nextIndex = index;
    }
}
