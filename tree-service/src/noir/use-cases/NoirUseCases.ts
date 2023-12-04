import Path from 'path';
import FS from 'fs';
import OS from 'os';
import { CompiledProgram, compile } from '@noir-lang/noir_wasm';
import { BarretenbergBackend } from '@noir-lang/backend_barretenberg';
// @ts-ignore
import { Noir } from '@noir-lang/noir_js';
import NoirRepo from './repos/NoirRepo';
import UtxoTransaction from '../../utxo/entities/UtxoTransaction';
import { Artifacts } from '../entities/Artifacts';
import MerkleTreeNode from '../../merkle-tree/entities/MerkleTreeNode';
import MerkleTree from '../../merkle-tree/entities/MerkleTree';
import NullifierNode from '../../nullifier/entities/NullifierNode';

export default class NoirUseCases {

    noirRepo: NoirRepo;

    constructor(noirRepo: NoirRepo) {
        this.noirRepo = noirRepo;
    }

    async getCircuit(name: string): Promise<CompiledProgram> {
        const circuitsPath = Path.resolve('../circuits');
        const content = FS.readFileSync(Path.join(circuitsPath, 'target', name + '.json')).toString();
        return JSON.parse(content) as CompiledProgram;
    }

    async getBackend(compiledProgram: CompiledProgram) {
        return new BarretenbergBackend(compiledProgram, { threads: OS.cpus().length });
    }

    async getNoir(compiledProgram: CompiledProgram, backend: BarretenbergBackend) {
        return new Noir(compiledProgram, backend);
    }

    // generateUtxoSignatureArtifacts(utxoTransaction: UtxoTransaction, backend: BarretenbergBackend, noir: Noir): Promise<Artifacts> {
    //     return this.noirRepo.generateUtxoSignatureArtifacts(utxoTransaction, backend, noir);
    // }

    // generateUtxoOwnershipArtifacts(utxoTransaction: UtxoTransaction, backend: BarretenbergBackend, noir: Noir): Promise<Artifacts> {
    //     return this.noirRepo.generateUtxoOwnershipArtifacts(utxoTransaction, backend, noir);
    // }

    // generateUtxoInputsArtifacts(merkleTree: MerkleTree<MerkleTreeNode>, utxoTransaction: UtxoTransaction, backend: BarretenbergBackend, noir: Noir): Promise<Artifacts> {
    //     return this.noirRepo.generateUtxoInputsArtifacts(merkleTree, utxoTransaction, backend, noir);
    // }

    // generateUtxoOutputsArtifacts(merkleTree: MerkleTree<MerkleTreeNode>, utxoTransaction: UtxoTransaction, backend: BarretenbergBackend, noir: Noir): Promise<Artifacts> {
    //     return this.noirRepo.generateUtxoOutputsArtifacts(merkleTree, utxoTransaction, backend, noir);
    // }

    // generateLowNullifierArtifacts(merkleTree: MerkleTree<MerkleTreeNode>, lowNullifierNode: NullifierNode, utxoTransaction: UtxoTransaction, backend: BarretenbergBackend, noir: Noir): Promise<Artifacts> {
    //     return this.noirRepo.generateLowNullifierArtifacts(merkleTree, lowNullifierNode, utxoTransaction, backend, noir);
    // }

}
