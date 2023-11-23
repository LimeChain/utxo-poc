import ParsedEvent from '../../../eth-observer/entities/ParsedEvent';
import UtxoGraph from '../../entities/UtxoGraph';

export default class UtxoStore {

    utxoGraph: UtxoGraph = new UtxoGraph();

    async update(parsedEvents: ParsedEvent[]) {
        parsedEvents.forEach((parsedEvent) => {
            this.utxoGraph.processParsedEvent(parsedEvent);
            console.log('rootHash', this.utxoGraph.merkleTree.get(BigInt(1)));
        });

        console.log(this.utxoGraph);
        this.utxoGraph.printAccountBalances();
    }

}
