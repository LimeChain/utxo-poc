import { BarretenbergBackend } from '@noir-lang/backend_barretenberg';
import MerkleTree from '../../merkle-tree/entities/MerkleTree';
import MerkleTreeNode from '../../merkle-tree/entities/MerkleTreeNode';
import UtxoTransaction from '../../utxo/entities/UtxoTransaction';
import NullifierNode from '../entities/NullifierNode';
import NullifierNoirSerializerRepo from './repos/NullifierNoirSerializerRepo';
//@ts-ignore
import { Noir } from '@noir-lang/noir_js';
import { Artifacts } from '../../noir/entities/Artifacts';

export default class NullifierUseCases {

    nullifierNoirSerializerRepo: NullifierNoirSerializerRepo;

    constructor(nullifierNoirSerializerRepo: NullifierNoirSerializerRepo) {
        this.nullifierNoirSerializerRepo = nullifierNoirSerializerRepo;
    }

    writeLowNullifier(merkleTree: MerkleTree<MerkleTreeNode>, lowNullifierNode: NullifierNode, utxoTransaction: UtxoTransaction): Promise<void> {
        return this.nullifierNoirSerializerRepo.writeLowNullifier(merkleTree, lowNullifierNode, utxoTransaction);
    }

    generateLowNullifierArtifacts(merkleTree: MerkleTree<MerkleTreeNode>, lowNullifierNode: NullifierNode, utxoTransaction: UtxoTransaction, backend: BarretenbergBackend, noir: Noir): Promise<Artifacts> {
        return this.nullifierNoirSerializerRepo.generateLowNullifierArtifacts(merkleTree, lowNullifierNode, utxoTransaction, backend, noir);
    }

}
