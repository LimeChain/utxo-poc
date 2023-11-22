import injector from '../../core/utilities/injector/Injector';
import NullifierStore from '../../nullifier/presentation/state/NullifierStore';
import UtxoStore from '../../utxo/presentation/state/UtxoStore';
import { ValidiumSmartContractStore } from './state/ValidiumSmartContractStore';

export default class EthObserver {

    timeoutRef: NodeJS.Timeout | null = null;
    validiumSmartContractStore: ValidiumSmartContractStore;
    utxoStore: UtxoStore;
    nullifierStore: NullifierStore;

    constructor() {
        this.validiumSmartContractStore = injector.getValidiumSmartContractStore();
        this.utxoStore = injector.getUtxoStore();
        this.nullifierStore = injector.getNullifierStore();
    }

    async start() {
        this.timeoutRef = setInterval(this.run, parseInt(process.env.VALIDIUM_PULL_INTERVAL ?? "15000"));
    }

    run = async () => {
        this.validiumSmartContractStore.fetchEvents();
        this.utxoStore.update();
        this.nullifierStore.update();
    }

}
