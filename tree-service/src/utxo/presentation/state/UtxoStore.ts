import ParsedEvent from '../../../eth-observer/entities/ParsedEvent';
import UtxoGraph from '../../entities/UtxoGraph';
import UtxoNode from '../../entities/UtxoNode';

export default class UtxoStore {

    utxoGraph: UtxoGraph = new UtxoGraph();

    async update(parsedEvents: ParsedEvent[]): Promise<Array<UtxoNode[] | null>> {
        const spendUtxoNodes: Array<UtxoNode[] | null> = [];

        parsedEvents.forEach((parsedEvent) => {
            const spendUtxoNodesPerEvent = this.utxoGraph.processParsedEvent(parsedEvent);
            spendUtxoNodes.push(spendUtxoNodesPerEvent);
            console.log('rootHash', this.utxoGraph.merkleTree.getRootHash());
        });

        console.log(this.utxoGraph);
        this.utxoGraph.printAccountBalances();

        return spendUtxoNodes;
    }

}
