import RawTransaction from '../../../eth-observer/entities/RawTransaction';
import PublicKeysStore from '../../../eth-observer/presentation/state/PublicKeysStore';
import UtxoGraph from '../../entities/UtxoGraph';
import UtxoTransaction from '../../entities/UtxoTransaction';
import UtxoUseCases from '../../use-cases/UtxoUseCases';

export default class UtxoStore {

    publicKeysStore: PublicKeysStore;
    utxoUseCases: UtxoUseCases;

    utxoGraph: UtxoGraph;

    constructor(publicKeysStore: PublicKeysStore, utxoUseCases: UtxoUseCases) {
        this.publicKeysStore = publicKeysStore;
        this.utxoUseCases = utxoUseCases;

        this.utxoGraph = new UtxoGraph(this.publicKeysStore.getPublicKeyX, this.publicKeysStore.getPublicKeyY);
    }

    async update(rawTransaction: RawTransaction): Promise<UtxoTransaction> {
        const utxoTransaction = this.utxoGraph.processRawTransation(rawTransaction);
        if (utxoTransaction === null) {
            console.error('Error processing', rawTransaction);
            process.exit(1);
        }

        // console.log('rootHash', this.utxoGraph.merkleTree.getRootHash());

        // console.log("UTXO GRAPH ============================================");
        // console.log(this.utxoGraph.merkleTree);
        // console.log("ACCOUNT BALANCES ============================================");
        // this.utxoGraph.printAccountBalances();

        return utxoTransaction;
    }

    async generateUtxoSignatureProve(utxoTransaction: UtxoTransaction): Promise<void> {
        await this.utxoUseCases.writeUtxoSignature(utxoTransaction);
    }

    async generateUtxoOwnershipProve(utxoTransaction: UtxoTransaction): Promise<void> {
        await this.utxoUseCases.writeUtxoOwnership(utxoTransaction);
    }

    async generateUtxoInputsProve(utxoTransaction: UtxoTransaction): Promise<void> {
        await this.utxoUseCases.writeUtxoInputs(this.utxoGraph.merkleTree, utxoTransaction);
    }

    async generateUtxoOutputsProve(utxoTransaction: UtxoTransaction): Promise<void> {
        await this.utxoUseCases.writeUtxoOutputs(this.utxoGraph.merkleTree, utxoTransaction);
    }


}
