import { BarretenbergBackend } from '@noir-lang/backend_barretenberg';
import MerkleTree from '../../merkle-tree/entities/MerkleTree';
import MerkleTreeNode from '../../merkle-tree/entities/MerkleTreeNode';
import UtxoTransaction from '../entities/UtxoTransaction';
import UtxoNoirSerializerRepo from './repos/UtxoNoirSerializerRepo';
//@ts-ignore
import { Noir } from '@noir-lang/noir_js';
import { Artifacts } from '../../noir/entities/Artifacts';

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

    generateUtxoSignatureArtifacts(utxoTransaction: UtxoTransaction, backend: BarretenbergBackend, noir: Noir): Promise<Artifacts> {
        return this.utxoNoirSerializerRepo.generateUtxoSignatureArtifacts(utxoTransaction, backend, noir);
    }

    generateUtxoOwnershipArtifacts(utxoTransaction: UtxoTransaction, backend: BarretenbergBackend, noir: Noir): Promise<Artifacts> {
        return this.utxoNoirSerializerRepo.generateUtxoOwnershipArtifacts(utxoTransaction, backend, noir);
    }

    generateUtxoInputsArtifacts(merkleTree: MerkleTree<MerkleTreeNode>, utxoTransaction: UtxoTransaction, backend: BarretenbergBackend, noir: Noir): Promise<Artifacts> {
        return this.utxoNoirSerializerRepo.generateUtxoInputsArtifacts(merkleTree, utxoTransaction, backend, noir);
    }

    generateUtxoOutputsArtifacts(merkleTree: MerkleTree<MerkleTreeNode>, utxoTransaction: UtxoTransaction, backend: BarretenbergBackend, noir: Noir): Promise<Artifacts> {
        return this.utxoNoirSerializerRepo.generateUtxoOutputsArtifacts(merkleTree, utxoTransaction, backend, noir);
    }


}
