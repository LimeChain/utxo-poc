import RawTransaction from '../../eth-observer/entities/RawTransaction';
import MerkleTree from '../../merkle-tree/entities/MerkleTree';
import UtxoNode from './UtxoNode';
import UtxoTransaction from './UtxoTransaction';

export default class UtxoGraph {

    merkleTree: MerkleTree<UtxoNode> = new MerkleTree();

    wallets: Map<string, Set<string>> = new Map();

    graph: Map<string, UtxoNode> = new Map();

    getPubKeyX: (address: string) => string;
    getPubKeyY: (address: string) => string;

    constructor(getPubKeyX: (address: string) => string, getPubKeyY: (address: string) => string) {
        this.getPubKeyX = getPubKeyX;
        this.getPubKeyY = getPubKeyY;
    }

    processRawTransation(rawTransaction: RawTransaction): UtxoTransaction | null {
        const utxoTransaction = new UtxoTransaction(this.getPubKeyX(rawTransaction.signerAddr), this.getPubKeyY(rawTransaction.signerAddr), rawTransaction.signature, rawTransaction.hash);

        let totalUnspentValue = 0n;
        if (rawTransaction.isTransfer() === true || rawTransaction.isWithdraw() === true) {
            // get all unspent nodes' hashes
            const utxoNodeHashes = this.wallets.get(rawTransaction.fromAddr);
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
                if (totalUnspentValue >= rawTransaction.value) {
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
                utxoTransaction.inputs.push(unspentNodes[i]);
                this.burnUtxoNode(unspentNodes[i]);
            }
        }

        if (rawTransaction.isTransfer() === true || rawTransaction.isDeposit() === true) {
            // create unspent nodes
            const utxoNode = this.mintUtxoNode(this.getPubKeyX(rawTransaction.toAddr), this.getPubKeyX(rawTransaction.toAddr), rawTransaction.toAddr, rawTransaction.value, rawTransaction.erc20Addr);
            utxoTransaction.outputs.push(utxoNode);
        }

        if (rawTransaction.isTransfer() === true || rawTransaction.isWithdraw() === true) {
            // create the unspent change node
            const change = totalUnspentValue - rawTransaction.value;
            if (change > 0n) {
                const utxoNode = this.mintUtxoNode(this.getPubKeyX(rawTransaction.fromAddr), this.getPubKeyX(rawTransaction.fromAddr), rawTransaction.fromAddr, change, rawTransaction.erc20Addr);
                utxoTransaction.outputs.push(utxoNode);
            }
        }

        return utxoTransaction;
    }

    mintUtxoNode(pubKeyX: string, pubKeyY: string, addr: string, value: bigint, erc20Addr: string): UtxoNode {
        const utxoNode = UtxoNode.newUnspentUtxoNode(pubKeyX, pubKeyY, addr, value, erc20Addr);

        this.addToWallet(addr, utxoNode);
        this.graph.set(utxoNode.getHashAsString(), utxoNode);
        this.merkleTree.appendLeaf(utxoNode);

        return utxoNode;
    }

    burnUtxoNode(utxoNode: UtxoNode): void {
        utxoNode.spend();
        this.removeFromWallet(utxoNode);
    }

    addToWallet(addr: string, utxoNode: UtxoNode): void {
        let set = this.wallets.get(addr);
        if (set === undefined) {
            this.wallets.set(addr, set = new Set());
        }

        set.add(utxoNode.getHashAsString());
    }

    removeFromWallet(utxoNode: UtxoNode): void {
        const set = this.wallets.get(utxoNode.addr);
        if (set === undefined) {
            console.log('Error: Trying to remove utxo from a wallet that does not exists');
            return;
        }

        set.delete(utxoNode.getHashAsString());
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
