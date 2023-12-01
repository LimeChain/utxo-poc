import injector from '../../core/utilities/injector/Injector';
import NullifierStore from '../../nullifier/presentation/state/NullifierStore';
import UtxoStore from '../../utxo/presentation/state/UtxoStore';
import EthObserverStore from './state/EthObserverStore';
import PublicKeysStore from './state/PublicKeysStore';
import { ValidiumSmartContractStore } from './state/ValidiumSmartContractStore';

export default class EthObserver {

    publicKeysStore: PublicKeysStore;
    ethObserverStore: EthObserverStore;
    validiumSmartContractStore: ValidiumSmartContractStore;
    utxoStore: UtxoStore;
    nullifierStore: NullifierStore;

    constructor() {
        this.publicKeysStore = injector.getPublicKeysStore();
        this.ethObserverStore = injector.getEthObserverStore();
        this.validiumSmartContractStore = injector.getValidiumSmartContractStore();
        this.utxoStore = injector.getUtxoStore();
        this.nullifierStore = injector.getNullifierStore();
    }

    async start() {
        this.run();
    }

    run = async () => {
        const rawTransactions = await this.validiumSmartContractStore.fetchRawTransactions();

        this.publicKeysStore.updatePubKeys(rawTransactions);
        for (let i = 0; i < rawTransactions.length; ++i) {
            const rawTransaction = rawTransactions[i];

            const utxoTransaction = await this.utxoStore.update(rawTransaction);
            if (utxoTransaction.isSupportedByCircuits() === false) {
                continue;
            }

            await this.utxoStore.generateUtxoSignatureProve(utxoTransaction);
            await this.utxoStore.generateUtxoOwnershipProve(utxoTransaction);
            await this.utxoStore.generateUtxoOutputsProve(utxoTransaction);
            await this.utxoStore.generateUtxoInputsProve(utxoTransaction);
            await this.nullifierStore.generateLowNullifierProve(utxoTransaction);
            console.log(Array.from(this.utxoStore.utxoGraph.merkleTree.getRootHashAsUint8Array()));
            console.log(Array.from(this.nullifierStore.nullifierTree.merkleTree.getRootHashAsUint8Array()));

            this.nullifierStore.update(utxoTransaction);
        }

        setTimeout(this.run, parseInt(process.env.VALIDIUM_PULL_INTERVAL ?? "15000"));
    }

}
