import HashUtils from '../../core/utilities/HashUtils';
import MerkleTreeNode from '../../merkle-tree/entities/MerkleTreeNode';

export default class UtxoNode extends MerkleTreeNode {

    value: bigint = 0n;
    pubKey: string = '';
    spent: boolean = false;

    static newUnspentUtxoNode(pubKey: string, value: bigint): UtxoNode {
        const utxoNode = new UtxoNode();
        utxoNode.pubKey = pubKey;
        utxoNode.value = value;
        utxoNode.spent = false;

        const json = JSON.stringify(utxoNode, (key, value) => {
            return typeof (value) === 'bigint' ? value.toString() : value;
        });
        utxoNode.hash = HashUtils.createHash(json);

        return utxoNode;
    }

    isSpent(): boolean {
        return this.spent;
    }

    spend(): void {
        this.spent = true;
    }

    getHash(): string {
        return this.hash;
    }

}
