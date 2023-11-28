import injector from '../../../core/utilities/injector/Injector';
import RawTransaction from '../../../eth-observer/entities/RawTransaction';
import PublicKeysStore from '../../../eth-observer/presentation/state/PublicKeysStore';
import UtxoGraph from '../../entities/UtxoGraph';
import UtxoTransaction from '../../entities/UtxoTransaction';

export default class UtxoStore {

    publicKeysStore: PublicKeysStore;

    utxoGraph: UtxoGraph;

    constructor() {
        this.publicKeysStore = injector.getPublicKeysStore();
        this.utxoGraph = new UtxoGraph(this.publicKeysStore.getPublicKeyX, this.publicKeysStore.getPublicKeyY);
    }

    async update(rawTransactions: RawTransaction[]): Promise<UtxoTransaction[]> {
        const utxoTransactions: UtxoTransaction[] = [];

        rawTransactions.forEach((rawTransaction) => {
            const utxoTransaction = this.utxoGraph.processRawTransation(rawTransaction);
            if (utxoTransaction === null) {
                console.error('Error processing', rawTransaction);
                process.exit(1);
            }

            utxoTransactions.push(utxoTransaction);
            // console.log('rootHash', this.utxoGraph.merkleTree.getRootHash());
        });

        console.log("UTXO GRAPH ============================================");
        console.log(this.utxoGraph);
        console.log("ACCOUNT BALANCES ============================================");
        this.utxoGraph.printAccountBalances();

        return utxoTransactions;
    }

}
