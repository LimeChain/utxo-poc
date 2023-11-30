import MerkleTree from '../../../merkle-tree/entities/MerkleTree';
import MerkleTreeNode from '../../../merkle-tree/entities/MerkleTreeNode';
import UtxoTransaction from '../../entities/UtxoTransaction';

export default interface NoirSerializerRepo {

    writeUtxoSignature(utxoTransaction: UtxoTransaction): Promise<void>;
    writeUtxoOwnership(utxoTransaction: UtxoTransaction): Promise<void>;
    writeUtxoInputs(merkleTree: MerkleTree<MerkleTreeNode>, utxoTransaction: UtxoTransaction): Promise<void>;
    writeUtxoOutputs(merkleTree: MerkleTree<MerkleTreeNode>, utxoTransaction: UtxoTransaction): Promise<void>;

}
