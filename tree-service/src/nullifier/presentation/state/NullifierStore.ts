import UtxoNode from '../../../utxo/entities/UtxoNode';
import UtxoTransaction from '../../../utxo/entities/UtxoTransaction';
import NullifierNode from '../../entities/NullifierNode';
import { NullifierTree } from '../../entities/NullifierTree';

export default class NullifierStore {

    nullifierTree: NullifierTree = new NullifierTree();

    async update(utxoTransactions: UtxoTransaction[]) {
        for (let i = utxoTransactions.length; i-- > 0;) {
            const utxoTransaction = utxoTransactions[i];

            utxoTransaction.inputs.forEach((utxoNode: UtxoNode) => {
                const nullifierNode = NullifierNode.newInstance(utxoNode.addr, utxoNode.getHashAsString());
                this.nullifierTree.appendNullifierNode(nullifierNode);
            });
        }

        // console.log("NULLIFIER TREE ============================================");
        // console.log(this.nullifierTree);
    }

}
