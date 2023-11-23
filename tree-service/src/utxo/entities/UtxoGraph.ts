import createKeccakHash from 'keccak';
import ParsedEvent from '../../eth-observer/entities/ParsedEvent';
import { UtxoNode } from './UtxoNode';

const MERKLE_ROOT_INDEX = 1n;
const MERKLE_DEPTH = 32n;

export default class UtxoGraph {

    merkleTree: Map<bigint, string> = new Map();
    utxoLeaves: UtxoNode[] = [];

    wallets: Map<string, Set<string>> = new Map();

    graph: Map<string, UtxoNode> = new Map();

    processParsedEvent(parsedEvent: ParsedEvent) {
        let totalUnspentValue = 0n;
        if (parsedEvent.isTransfer() === true || parsedEvent.isWithdraw() === true) {
            // get all unspent nodes' hashes
            const utxoNodeHashes = this.wallets.get(parsedEvent.privKey);
            if (utxoNodeHashes === undefined) {
                console.log('Error: Insufficient funds');
                return;
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
                return;
            }

            // spend nodes
            for (let i = 0; i <= lastIncludedIndex; ++i) {
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
    }

    mintUtxoNode(pubKey: string, value: bigint) {
        const utxoNode = UtxoNode.newUnspentUtxoNode();

        utxoNode.pubKey = pubKey;
        utxoNode.value = value;
        utxoNode.invalidateHash();

        this.utxoLeaves.push(utxoNode);
        this.addToWallet(pubKey, utxoNode);
        this.graph.set(utxoNode.hash, utxoNode);
        this.updateMerkleTree(this.utxoLeaves.length - 1);
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

    updateMerkleTree(leafIndex: number) {
        const nodeHash = this.utxoLeaves[leafIndex].hash;
        const merkleLeafIndex = (MERKLE_ROOT_INDEX << MERKLE_DEPTH) + BigInt(leafIndex);

        this.merkleTree.set(merkleLeafIndex, nodeHash);

        let currentMerkleLeafIndex = merkleLeafIndex;
        for (; ;) {
            const parentMerkleLeafIndex = currentMerkleLeafIndex >> 1n;
            if (parentMerkleLeafIndex === 0n) {
                break;
            }

            const merkleLeftLeafIndex = parentMerkleLeafIndex << 1n;
            const merkleRightLeafIndex = merkleLeftLeafIndex + 1n;

            const leftNodeHash = this.merkleTree.get(merkleLeftLeafIndex) ?? '';
            const rightNodeHash = this.merkleTree.get(merkleRightLeafIndex) ?? '';
            const parentNodeHashContent = leftNodeHash + rightNodeHash;
            const parentNodeHash = createKeccakHash('keccak256').update(parentNodeHashContent).digest('hex');
            this.merkleTree.set(parentMerkleLeafIndex, parentNodeHash);

            currentMerkleLeafIndex = parentMerkleLeafIndex;
        }
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
