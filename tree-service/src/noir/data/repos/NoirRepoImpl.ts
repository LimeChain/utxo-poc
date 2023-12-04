import Fs from 'fs';
import Path from 'path';

import { BarretenbergBackend } from '@noir-lang/backend_barretenberg';
// @ts-ignore
import { InputMap, Noir } from '@noir-lang/noir_js';
import NoirSignedTransaction from '../../../utxo/data/dto/NoirSignedTransaction';
import UtxoTransaction from '../../../utxo/entities/UtxoTransaction';
import MerkleTree from '../../../merkle-tree/entities/MerkleTree';
import MerkleTreeNode from '../../../merkle-tree/entities/MerkleTreeNode';
import NullifierNode from '../../../nullifier/entities/NullifierNode';
import NoirMerkleTreePath from '../../../merkle-tree/data/dto/NoirMerkleTreePath';
import NoirNullifierNode from '../../../nullifier/data/dto/NoirNullifierNode';
import NoirRepo from '../../use-cases/repos/NoirRepo';
import { Artifacts } from '../../entities/Artifacts';

export default class NoirRepoImpl implements NoirRepo {

    // async generateUtxoSignatureArtifacts(utxoTransaction: UtxoTransaction, backend: BarretenbergBackend, noir: Noir): Promise<Artifacts> {
    //     const noirSignedTransaction = NoirSignedTransaction.fromUtxoTransaction(utxoTransaction);
    //     return NoirRepoImpl.generateArtifacts(backend, noir, noirSignedTransaction.toJson(), 0);
    // }

    // async generateUtxoOwnershipArtifacts(utxoTransaction: UtxoTransaction, backend: BarretenbergBackend, noir: Noir): Promise<Artifacts> {
    //     const noirSignedTransaction = NoirSignedTransaction.fromUtxoTransaction(utxoTransaction);
    //     return NoirRepoImpl.generateArtifacts(backend, noir, noirSignedTransaction.toJson(), 0);
    // }

    // async generateUtxoInputsArtifacts(merkleTree: MerkleTree<MerkleTreeNode>, utxoTransaction: UtxoTransaction, backend: BarretenbergBackend, noir: Noir): Promise<Artifacts> {
    //     const noirSignedTransaction = NoirSignedTransaction.fromUtxoTransaction(utxoTransaction);
    //     const noirMerkleTreePath = NoirMerkleTreePath.fromMerkleTreeData(merkleTree, utxoTransaction.inputs);
    //     const params: InputMap = Object.assign({}, noirMerkleTreePath.toJson(), noirSignedTransaction.toJson());
    //     return NoirRepoImpl.generateArtifacts(backend, noir, params, 0);
    // }

    // async generateUtxoOutputsArtifacts(merkleTree: MerkleTree<MerkleTreeNode>, utxoTransaction: UtxoTransaction, backend: BarretenbergBackend, noir: Noir): Promise<Artifacts> {
    //     const noirSignedTransaction = NoirSignedTransaction.fromUtxoTransaction(utxoTransaction);
    //     const noirMerkleTreePath = NoirMerkleTreePath.fromMerkleTreeData(merkleTree, utxoTransaction.outputs);
    //     const params: InputMap = Object.assign({}, noirMerkleTreePath.toJson(), noirSignedTransaction.toJson());
    //     return NoirRepoImpl.generateArtifacts(backend, noir, params, 1);
    // }

    // async generateLowNullifierArtifacts(merkleTree: MerkleTree<MerkleTreeNode>, lowNullifierNode: NullifierNode, utxoTransaction: UtxoTransaction, backend: BarretenbergBackend, noir: Noir): Promise<Artifacts> {
    //     const noirSignedTransaction = NoirSignedTransaction.fromUtxoTransaction(utxoTransaction);
    //     const noirMerkleTreePath = NoirMerkleTreePath.fromMerkleTreeData(merkleTree, [lowNullifierNode]);
    //     const noirNullifierNode = NoirNullifierNode.fromNullifierNode(lowNullifierNode);
    //     const params: InputMap = Object.assign({}, noirMerkleTreePath.toJson(), noirNullifierNode.toJson(), noirSignedTransaction.toJson());
    //     return NoirRepoImpl.generateArtifacts(backend, noir, params, 1);
    // }


}
