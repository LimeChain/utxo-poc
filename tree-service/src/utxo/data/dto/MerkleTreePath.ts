import MerkleTree from '../../../merkle-tree/entities/MerkleTree';
import MerkleTreeNode from '../../../merkle-tree/entities/MerkleTreeNode';

export default class MerkleTreePath {

    utxo_before_root: number[] = [];
    utxo_before_path_indices: number[][] = [];
    utxo_before_siblings: number[][][] = [];

    static fromMerkleTreeData(merkleTree: MerkleTree<MerkleTreeNode>, merkleTreeNodes: MerkleTreeNode[]): MerkleTreePath {
        const merkleTreePath = new MerkleTreePath();

        merkleTreePath.utxo_before_root = Array.from(merkleTree.getRootHashAsUint8Array());
        merkleTreeNodes.forEach((merkleTreeNode) => {
            merkleTreePath.utxo_before_path_indices.push(Array.from(merkleTree.getPathToRootAsUint8Array(merkleTreeNode)));
            merkleTreePath.utxo_before_siblings.push(merkleTree.getPathToRootSiblingsHashesAsUint8Array(merkleTreeNode).map((byteArray) => Array.from(byteArray)));
        });

        return merkleTreePath;
    }

    toToml(): string {
        const buffers: string[] = [];

        buffers.push(`root = ${JSON.stringify(this.utxo_before_root)}`);
        buffers.push(`are_nodes_right = ${JSON.stringify(this.utxo_before_path_indices)}`);
        buffers.push(`siblings = ${JSON.stringify(this.utxo_before_siblings)}`);

        return buffers.join('\n');
    }

}
