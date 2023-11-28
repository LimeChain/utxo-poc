import HashUtils from '../../core/utilities/HashUtils';
import MerkleTreeNode from '../../merkle-tree/entities/MerkleTreeNode';

export default class NullifierNode extends MerkleTreeNode {

    value: string = '';
    nextIndex: number = 0;
    nextValue: string = '';

    static newInstance(privKey: string, hash: string) {
        const node = new NullifierNode();

        node.value = privKey + hash;
        node.hash = HashUtils.createHash(node.value);

        return node;
    }

}
