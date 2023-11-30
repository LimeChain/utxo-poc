import MerkleTree from '../../merkle-tree/entities/MerkleTree';
import MerkleTreeNode from '../../merkle-tree/entities/MerkleTreeNode';
import UtxoTransaction from '../entities/UtxoTransaction';
import NoirSerializerRepo from './repos/NoirSerializerRepo';

export default class UtxoUseCases {

    noirSerializerRepo: NoirSerializerRepo;

    constructor(noirSerializerRepo: NoirSerializerRepo) {
        this.noirSerializerRepo = noirSerializerRepo;
    }

    writeUtxoSignature(utxoTransaction: UtxoTransaction): Promise<void> {
        return this.noirSerializerRepo.writeUtxoSignature(utxoTransaction);
    }

    writeUtxoOwnership(utxoTransaction: UtxoTransaction): Promise<void> {
        return this.noirSerializerRepo.writeUtxoOwnership(utxoTransaction);
    }

    writeUtxoInputs(merkleTree: MerkleTree<MerkleTreeNode>, utxoTransaction: UtxoTransaction): Promise<void> {
        return this.noirSerializerRepo.writeUtxoInputs(merkleTree, utxoTransaction);
    }

    writeUtxoOutputs(merkleTree: MerkleTree<MerkleTreeNode>, utxoTransaction: UtxoTransaction): Promise<void> {
        return this.noirSerializerRepo.writeUtxoOutputs(merkleTree, utxoTransaction);
    }


}
