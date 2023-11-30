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

        for (let i = 0; i < rawTransactions.length; ++i) {
            const rawTransaction = rawTransactions[i];
            this.publicKeysStore.updatePubKeys([rawTransaction]);
            const utxoTransactions = await this.utxoStore.update([rawTransaction]);
            this.nullifierStore.update(utxoTransactions);

            for (let j = 0; j < utxoTransactions.length; ++j) {
                const utxoTransaction = utxoTransactions[j];
                if (utxoTransaction.isSupportedByCircuits() === false) {
                    continue;
                }

                await this.utxoStore.generateUtxoSignatureProve(utxoTransaction);
                await this.utxoStore.generateUtxoOwnershipProve(utxoTransaction);
                await this.utxoStore.generateUtxoOutputsProve(utxoTransaction);
                await this.utxoStore.generateUtxoInputsProve(utxoTransaction);
                process.exit(0); // process a single transfer tx for now
            }
        }

        // if (rawTransactions.length !== 0) {
        //     this.publicKeysStore.updatePubKeys(rawTransactions);
        //     const utxoTransactions = await this.utxoStore.update(rawTransactions);
        //     this.nullifierStore.update(utxoTransactions);

        //     for (let i = 0; i < utxoTransactions.length; ++i) {
        //         const utxoTransaction = utxoTransactions[i];
        //         if (utxoTransaction.isSupportedByCircuits() === false) {
        //             continue;
        //         }

        //         await this.utxoStore.generateUtxoSignatureProve(utxoTransaction);
        //         await this.utxoStore.generateUtxoOwnershipProve(utxoTransaction);
        //         await this.utxoStore.generateUtxoOutputsProve(utxoTransaction);
        //         await this.utxoStore.generateUtxoInputsProve(utxoTransaction);
        //         break;
        //     }
        // }

        setTimeout(this.run, parseInt(process.env.VALIDIUM_PULL_INTERVAL ?? "15000"));
    }

}
