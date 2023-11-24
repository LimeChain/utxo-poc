import ParsedEvent from '../../../eth-observer/entities/ParsedEvent';
import UtxoNode from '../../../utxo/entities/UtxoNode';
import NullifierNode from '../../entities/NullifierNode';
import { NullifierTree } from '../../entities/NullifierTree';

export default class NullifierStore {

    nullifierTree: NullifierTree = new NullifierTree();

    async update(parsedEvents: ParsedEvent[], spendUtxoNodesPerEvent: Array<UtxoNode[] | null>) {
        for (let i = parsedEvents.length; i-- > 0;) {
            const parsedEvent = parsedEvents[i];
            const spendUtxoNodes = spendUtxoNodesPerEvent[i];

            spendUtxoNodes?.forEach((spendUtxoNode) => {
                const nullifierNode = NullifierNode.newInstance(parsedEvent.privKey, spendUtxoNode.hash);
                this.nullifierTree.appendNullifierNode(nullifierNode);
            });
        }

        console.log(this.nullifierTree);
    }

}
