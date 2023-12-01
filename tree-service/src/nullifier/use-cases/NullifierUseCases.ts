import MerkleTree from '../../merkle-tree/entities/MerkleTree';
import MerkleTreeNode from '../../merkle-tree/entities/MerkleTreeNode';
import UtxoTransaction from '../../utxo/entities/UtxoTransaction';
import NullifierNode from '../entities/NullifierNode';
import NullifierNoirSerializerRepo from './repos/NullifierNoirSerializerRepo';

export default class NullifierUseCases {

    nullifierNoirSerializerRepo: NullifierNoirSerializerRepo;

    constructor(nullifierNoirSerializerRepo: NullifierNoirSerializerRepo) {
        this.nullifierNoirSerializerRepo = nullifierNoirSerializerRepo;
    }

    writeLowNullifier(merkleTree: MerkleTree<MerkleTreeNode>, lowNullifierNode: NullifierNode, utxoTransaction: UtxoTransaction): Promise<void> {
        return this.nullifierNoirSerializerRepo.writeLowNullifier(merkleTree, lowNullifierNode, utxoTransaction);
    }

}
