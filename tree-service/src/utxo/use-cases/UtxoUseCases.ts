import MerkleTree from '../../merkle-tree/entities/MerkleTree';
import MerkleTreeNode from '../../merkle-tree/entities/MerkleTreeNode';
import UtxoTransaction from '../entities/UtxoTransaction';
import UtxoNoirSerializerRepo from './repos/UtxoNoirSerializerRepo';

export default class UtxoUseCases {

    utxoNoirSerializerRepo: UtxoNoirSerializerRepo;

    constructor(utxoNoirSerializerRepo: UtxoNoirSerializerRepo) {
        this.utxoNoirSerializerRepo = utxoNoirSerializerRepo;
    }

    writeUtxoSignature(utxoTransaction: UtxoTransaction): Promise<void> {
        return this.utxoNoirSerializerRepo.writeUtxoSignature(utxoTransaction);
    }

    writeUtxoOwnership(utxoTransaction: UtxoTransaction): Promise<void> {
        return this.utxoNoirSerializerRepo.writeUtxoOwnership(utxoTransaction);
    }

    writeUtxoInputs(merkleTree: MerkleTree<MerkleTreeNode>, utxoTransaction: UtxoTransaction): Promise<void> {
        return this.utxoNoirSerializerRepo.writeUtxoInputs(merkleTree, utxoTransaction);
    }

    writeUtxoOutputs(merkleTree: MerkleTree<MerkleTreeNode>, utxoTransaction: UtxoTransaction): Promise<void> {
        return this.utxoNoirSerializerRepo.writeUtxoOutputs(merkleTree, utxoTransaction);
    }


}
