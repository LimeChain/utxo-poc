import ParsedEvent from '../../eth-observer/entities/ParsedEvent';
import MerkleTree from '../../merkle-tree/entities/MerkleTree';
import UtxoNode from './UtxoNode';

export default class UtxoGraph {

    merkleTree: MerkleTree<UtxoNode> = new MerkleTree();

    wallets: Map<string, Set<string>> = new Map();

    graph: Map<string, UtxoNode> = new Map();

    processParsedEvent(parsedEvent: ParsedEvent): UtxoNode[] | null {
        const spendUtxoNodes: UtxoNode[] = [];

        let totalUnspentValue = 0n;
        if (parsedEvent.isTransfer() === true || parsedEvent.isWithdraw() === true) {
            // get all unspent nodes' hashes
            const utxoNodeHashes = this.wallets.get(parsedEvent.privKey);
            if (utxoNodeHashes === undefined) {
                console.log('Error: Insufficient funds');
                return null;
            }

            // get all unspent nodes
            const unspentNodes: UtxoNode[] = [];
            utxoNodeHashes.forEach((utxoNodeHash) => {
                const utxoNode = this.graph.get(utxoNodeHash)
                if (utxoNode === undefined) {
                    console.log('Error: an utxo node is missing from the graph');
                    return;
                }

                if (utxoNode.isSpent() === true) {
                    console.log('Error: Trying to double spend a node');
                    return;
                }

                unspentNodes.push(utxoNode);
            });

            // sort the unspent nodes
            unspentNodes.sort((a, b) => {
                if (a.value === b.value) {
                    return 0;
                }

                return a.value < b.value ? -1 : 1;
            });

            // find the last unspent node that must be included
            let lastIncludedIndex = -1;
            for (let i = 0; i < unspentNodes.length; ++i) {
                totalUnspentValue += unspentNodes[i].value;
                if (totalUnspentValue >= parsedEvent.value) {
                    lastIncludedIndex = i;
                    break;
                }
            }

            if (lastIncludedIndex === -1) {
                console.log('Error: Insufficient funds');
                return null;
            }

            // spend nodes
            for (let i = 0; i <= lastIncludedIndex; ++i) {
                spendUtxoNodes.push(unspentNodes[i]);
                this.burnUtxoNode(unspentNodes[i]);
            }
        }

        if (parsedEvent.isTransfer() === true || parsedEvent.isDeposit() === true) {
            // create unspent nodes
            this.mintUtxoNode(parsedEvent.pubKey, parsedEvent.value);
        }

        if (parsedEvent.isTransfer() === true || parsedEvent.isWithdraw() === true) {
            // create the unspent change node
            const change = totalUnspentValue - parsedEvent.value;
            if (change > 0n) {
                this.mintUtxoNode(parsedEvent.privKey, change);
            }
        }

        return spendUtxoNodes;
    }

    mintUtxoNode(pubKey: string, value: bigint) {
        const utxoNode = UtxoNode.newUnspentUtxoNode(pubKey, value);

        this.addToWallet(pubKey, utxoNode);
        this.graph.set(utxoNode.hash, utxoNode);
        this.merkleTree.appendLeaf(utxoNode);
    }

    burnUtxoNode(utxoNode: UtxoNode): void {
        utxoNode.spend();
        this.removeFromWallet(utxoNode);
    }

    addToWallet(pubKey: string, utxoNode: UtxoNode): void {
        let set = this.wallets.get(pubKey);
        if (set === undefined) {
            this.wallets.set(pubKey, set = new Set());
        }

        set.add(utxoNode.hash);
    }

    removeFromWallet(utxoNode: UtxoNode): void {
        const set = this.wallets.get(utxoNode.pubKey);
        if (set === undefined) {
            console.log('Error: Trying to remove utxo from a wallet that does not exists');
            return;
        }

        set.delete(utxoNode.hash);
    }

    printAccountBalances() {
        this.wallets.forEach((utxoNodeHashes, pubKey) => {
            const balance = Array.from(utxoNodeHashes).map((utxoNodeHash) => this.graph.get(utxoNodeHash)).reduce((accu, utxoNode) => {
                return accu + (utxoNode?.value ?? 0n);
            }, 0n);
            console.log(pubKey, balance.toString());
        });
    }

}
