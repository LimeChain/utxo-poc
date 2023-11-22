import EthObserverRepoImpl from '../../../eth-observer/data/EthObserverRepoImpl';
import { ValidiumSmartContractRepoImpl } from '../../../eth-observer/data/ValidiumSmartContractRepoImpl';
import EthObserverStore from '../../../eth-observer/presentation/state/EthObserverStore';
import { ValidiumSmartContractStore } from '../../../eth-observer/presentation/state/ValidiumSmartContractStore';
import EthObserverUseCases from '../../../eth-observer/use-cases/EthObserverUseCases';
import { ValidiumSmartContractUseCases } from '../../../eth-observer/use-cases/ValidiumSmartContractUseCases';
import NullifierStore from '../../../nullifier/presentation/state/NullifierStore';
import RestStore from '../../../rest/presentation/state/RestStore';
import RestUseCases from '../../../rest/use-cases/RestUseCases';
import UtxoStore from '../../../utxo/presentation/state/UtxoStore';

class Injector {

    restStore: RestStore | null = null;
    ethObserverStore: EthObserverStore | null = null;
    validiumSmartContractStore: ValidiumSmartContractStore | null = null;
    utxoStore: UtxoStore | null = null;
    nullifierStore: NullifierStore | null = null;

    async init() {
        const ethObserverRepo = new EthObserverRepoImpl();
        const validiumSmartContractRepo = new ValidiumSmartContractRepoImpl();

        const restUseCases = new RestUseCases();
        const ethObserverUseCases = new EthObserverUseCases(ethObserverRepo);
        const validiumSmartContractUseCases = new ValidiumSmartContractUseCases(validiumSmartContractRepo);

        this.restStore = new RestStore(restUseCases);
        this.ethObserverStore = new EthObserverStore(ethObserverUseCases);
        this.validiumSmartContractStore = new ValidiumSmartContractStore(this.getEthObserverStore(), validiumSmartContractUseCases);
        this.utxoStore = new UtxoStore();
        this.nullifierStore = new NullifierStore();
    }

    getRestStore(): RestStore {
        return this.restStore as RestStore;
    }

    getEthObserverStore(): EthObserverStore {
        return this.ethObserverStore as EthObserverStore;
    }

    getValidiumSmartContractStore(): ValidiumSmartContractStore {
        return this.validiumSmartContractStore as ValidiumSmartContractStore;
    }

    getUtxoStore(): UtxoStore {
        return this.utxoStore as UtxoStore;
    }

    getNullifierStore(): NullifierStore {
        return this.nullifierStore as NullifierStore;
    }

}

const injector = new Injector();
export default injector;
