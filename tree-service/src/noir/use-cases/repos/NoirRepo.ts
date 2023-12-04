import { BarretenbergBackend } from '@noir-lang/backend_barretenberg';
// @ts-ignore
import { Noir } from '@noir-lang/noir_js';
import UtxoTransaction from '../../../utxo/entities/UtxoTransaction';
import MerkleTree from '../../../merkle-tree/entities/MerkleTree';
import MerkleTreeNode from '../../../merkle-tree/entities/MerkleTreeNode';
import NullifierNode from '../../../nullifier/entities/NullifierNode';
import { Artifacts } from '../../entities/Artifacts';

export default interface NoirRepo {

    // generateUtxoSignatureArtifacts(utxoTransaction: UtxoTransaction, backend: BarretenbergBackend, noir: Noir): Promise<Artifacts>;
    // generateUtxoOwnershipArtifacts(utxoTransaction: UtxoTransaction, backend: BarretenbergBackend, noir: Noir): Promise<Artifacts>;
    // generateUtxoInputsArtifacts(merkleTree: MerkleTree<MerkleTreeNode>, utxoTransaction: UtxoTransaction, backend: BarretenbergBackend, noir: Noir): Promise<Artifacts>
    // generateUtxoOutputsArtifacts(merkleTree: MerkleTree<MerkleTreeNode>, utxoTransaction: UtxoTransaction, backend: BarretenbergBackend, noir: Noir): Promise<Artifacts>
    // generateLowNullifierArtifacts(merkleTree: MerkleTree<MerkleTreeNode>, lowNullifierNode: NullifierNode, utxoTransaction: UtxoTransaction, backend: BarretenbergBackend, noir: Noir): Promise<Artifacts>

}
