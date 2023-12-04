import { BarretenbergBackend } from '@noir-lang/backend_barretenberg';
import MerkleTree from '../../../merkle-tree/entities/MerkleTree';
import MerkleTreeNode from '../../../merkle-tree/entities/MerkleTreeNode';
import UtxoTransaction from '../../../utxo/entities/UtxoTransaction';
import NullifierNode from '../../entities/NullifierNode';
//@ts-ignore
import { Noir } from '@noir-lang/noir_js';
import { Artifacts } from '../../../noir/entities/Artifacts';

export default interface NullifierNoirSerializerRepo {

    writeLowNullifier(merkleTree: MerkleTree<MerkleTreeNode>, lowNullifierNode: NullifierNode, utxoTransaction: UtxoTransaction): Promise<void>;
    generateLowNullifierArtifacts(merkleTree: MerkleTree<MerkleTreeNode>, lowNullifierNode: NullifierNode, utxoTransaction: UtxoTransaction, backend: BarretenbergBackend, noir: Noir): Promise<Artifacts>

}
