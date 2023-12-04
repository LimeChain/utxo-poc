import injector from '../../core/utilities/injector/Injector';
import NoirStore from '../../noir/presentation/state/NoirStore';
import NullifierStore from '../../nullifier/presentation/state/NullifierStore';
import ShellStore from '../../shell/presentation/state/ShellStore';
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
    shellStore: ShellStore;
    noirStore: NoirStore;

    constructor() {
        this.publicKeysStore = injector.getPublicKeysStore();
        this.ethObserverStore = injector.getEthObserverStore();
        this.validiumSmartContractStore = injector.getValidiumSmartContractStore();
        this.utxoStore = injector.getUtxoStore();
        this.nullifierStore = injector.getNullifierStore();
        this.shellStore = injector.getShellStore();
        this.noirStore = injector.getNoirStore();
    }

    async start() {
        this.run();
    }

    run = async () => {
        const rawTransactions = await this.validiumSmartContractStore.fetchRawTransactions();

        this.publicKeysStore.updatePubKeys(rawTransactions);
        for (let i = 0; i < rawTransactions.length; ++i) {
            const rawTransaction = rawTransactions[i];
            console.log("Transaction", rawTransaction.hash);

            const utxoTransaction = await this.utxoStore.update(rawTransaction);
            if (utxoTransaction.isSupportedByCircuits() === false) {
                console.log('    Tx is not supported by circuits:', rawTransaction.hash);
                continue;
            }

            console.log('    Processing tx:', rawTransaction.hash);

            // try {
            //     console.log('    Serializing data for proves...');
            //     await this.utxoStore.generateUtxoSignatureProve(utxoTransaction);
            //     await this.utxoStore.generateUtxoOwnershipProve(utxoTransaction);
            //     await this.utxoStore.generateUtxoOutputsProve(utxoTransaction);
            //     await this.utxoStore.generateUtxoInputsProve(utxoTransaction);
            //     await this.nullifierStore.generateLowNullifierProve(utxoTransaction);


            //     console.log('    Executing circuits using cli...');
            //     await this.shellStore.executeCircuits();
            //     console.log('    Done...Ok');
            // } catch (e) {
            //     console.log('    Done...Error');
            //     console.error(e);
            //     process.exit(1);
            // }

            try {
                console.log('    Executing circuits using noir_js...');
                await this.noirStore.executeCircuits(utxoTransaction);
                console.log('    Done...Ok');
            } catch (e) {
                console.log('    Done...Error');
                console.error(e);
                process.exit(1);
            }

            // TODO: Update the smart contract. In order to do so one must provide the necessary parameters to prove function and implement it
            await this.validiumSmartContractStore.prove();

            this.nullifierStore.update(utxoTransaction);
        }

        setTimeout(this.run, parseInt(process.env.VALIDIUM_PULL_INTERVAL ?? "15000"));
    }

}
