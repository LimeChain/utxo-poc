import { BarretenbergBackend } from '@noir-lang/backend_barretenberg';
import MerkleTree from '../../../merkle-tree/entities/MerkleTree';
import MerkleTreeNode from '../../../merkle-tree/entities/MerkleTreeNode';
import UtxoTransaction from '../../entities/UtxoTransaction';
//@ts-ignore
import { Noir } from '@noir-lang/noir_js';
import { Artifacts } from '../../../noir/entities/Artifacts';

export default interface UtxoNoirSerializerRepo {

    writeUtxoSignature(utxoTransaction: UtxoTransaction): Promise<void>;
    writeUtxoOwnership(utxoTransaction: UtxoTransaction): Promise<void>;
    writeUtxoInputs(merkleTree: MerkleTree<MerkleTreeNode>, utxoTransaction: UtxoTransaction): Promise<void>;
    writeUtxoOutputs(merkleTree: MerkleTree<MerkleTreeNode>, utxoTransaction: UtxoTransaction): Promise<void>;

    generateUtxoSignatureArtifacts(utxoTransaction: UtxoTransaction, backend: BarretenbergBackend, noir: Noir): Promise<Artifacts>;
    generateUtxoOwnershipArtifacts(utxoTransaction: UtxoTransaction, backend: BarretenbergBackend, noir: Noir): Promise<Artifacts>;
    generateUtxoInputsArtifacts(merkleTree: MerkleTree<MerkleTreeNode>, utxoTransaction: UtxoTransaction, backend: BarretenbergBackend, noir: Noir): Promise<Artifacts>
    generateUtxoOutputsArtifacts(merkleTree: MerkleTree<MerkleTreeNode>, utxoTransaction: UtxoTransaction, backend: BarretenbergBackend, noir: Noir): Promise<Artifacts>

}
