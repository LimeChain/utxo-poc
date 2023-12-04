import { BarretenbergBackend } from '@noir-lang/backend_barretenberg';
import UtxoNode from '../../../utxo/entities/UtxoNode';
import UtxoTransaction from '../../../utxo/entities/UtxoTransaction';
import NullifierNode from '../../entities/NullifierNode';
import NullifierTree from '../../entities/NullifierTree';
import NullifierUseCases from '../../use-cases/NullifierUseCases';
//@ts-ignore
import { Noir } from '@noir-lang/noir_js';
import { Artifacts } from '../../../noir/entities/Artifacts';

export default class NullifierStore {

    nullifierTree: NullifierTree;
    nullifierUseCases: NullifierUseCases;

    constructor(nullifierUseCases: NullifierUseCases) {
        this.nullifierUseCases = nullifierUseCases;
        this.nullifierTree = new NullifierTree();
    }

    async update(utxoTransaction: UtxoTransaction) {
        utxoTransaction.inputs.forEach((utxoNode: UtxoNode) => {
            const nullifierNode = NullifierNode.newInstance(utxoNode.hash);
            this.nullifierTree.appendNullifierNode(nullifierNode);
        });

        // console.log("NULLIFIER TREE ============================================");
        // console.log(this.nullifierTree);
    }

    async generateLowNullifierProve(utxoTransaction: UtxoTransaction): Promise<void> {
        const inputNullifierNode = NullifierNode.newInstance(utxoTransaction.inputs[0].hash);
        const lowNullifierNode = this.nullifierTree.getLowNullifier(inputNullifierNode);
        await this.nullifierUseCases.writeLowNullifier(this.nullifierTree.merkleTree, lowNullifierNode, utxoTransaction);
    }

    generateLowNullifierArtifacts(lowNullifierNode: NullifierNode, utxoTransaction: UtxoTransaction, backend: BarretenbergBackend, noir: Noir): Promise<Artifacts> {
        return this.nullifierUseCases.generateLowNullifierArtifacts(this.nullifierTree.merkleTree, lowNullifierNode, utxoTransaction, backend, noir);
    }

}
