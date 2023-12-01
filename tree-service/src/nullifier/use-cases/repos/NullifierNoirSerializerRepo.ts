import MerkleTree from '../../../merkle-tree/entities/MerkleTree';
import MerkleTreeNode from '../../../merkle-tree/entities/MerkleTreeNode';
import UtxoTransaction from '../../../utxo/entities/UtxoTransaction';
import NullifierNode from '../../entities/NullifierNode';

export default interface NullifierNoirSerializerRepo {

    writeLowNullifier(merkleTree: MerkleTree<MerkleTreeNode>, lowNullifierNode: NullifierNode, utxoTransaction: UtxoTransaction): Promise<void>;

}
