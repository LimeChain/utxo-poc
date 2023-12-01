import EthObserverRepoImpl from '../../../eth-observer/data/EthObserverRepoImpl';
import { ValidiumSmartContractRepoImpl } from '../../../eth-observer/data/ValidiumSmartContractRepoImpl';
import EthObserverStore from '../../../eth-observer/presentation/state/EthObserverStore';
import PublicKeysStore from '../../../eth-observer/presentation/state/PublicKeysStore';
import { ValidiumSmartContractStore } from '../../../eth-observer/presentation/state/ValidiumSmartContractStore';
import EthObserverUseCases from '../../../eth-observer/use-cases/EthObserverUseCases';
import { ValidiumSmartContractUseCases } from '../../../eth-observer/use-cases/ValidiumSmartContractUseCases';
import NullifierStore from '../../../nullifier/presentation/state/NullifierStore';
import NullifierUseCases from '../../../nullifier/use-cases/NullifierUseCases';
import UtxoNoirSerializerRepoImpl from '../../../utxo/data/repos/UtxoNoirSerializerRepoImpl';
import NullifierNoirSerializerRepoImpl from '../../../nullifier/data/repos/NullifierNoirSerializerRepoImpl';
import UtxoStore from '../../../utxo/presentation/state/UtxoStore';
import UtxoUseCases from '../../../utxo/use-cases/UtxoUseCases';
import ShellRepoImpl from '../../../shell/data/repos/ShellRepoImpl';
import ShellUseCases from '../../../shell/use-cases/ShellUseCases';
import ShellStore from '../../../shell/presentation/state/ShellStore';

class Injector {

    publicKeysStore: PublicKeysStore | null = null;
    ethObserverStore: EthObserverStore | null = null;
    validiumSmartContractStore: ValidiumSmartContractStore | null = null;
    utxoStore: UtxoStore | null = null;
    nullifierStore: NullifierStore | null = null;
    shellStore: ShellStore | null = null;

    async init() {
        const ethObserverRepo = new EthObserverRepoImpl();
        const validiumSmartContractRepo = new ValidiumSmartContractRepoImpl();
        const utxoNoirSerializerRepo = new UtxoNoirSerializerRepoImpl();
        const nullifierNoirSerializerRepo = new NullifierNoirSerializerRepoImpl();
        const shellRepo = new ShellRepoImpl();

        const ethObserverUseCases = new EthObserverUseCases(ethObserverRepo);
        const validiumSmartContractUseCases = new ValidiumSmartContractUseCases(validiumSmartContractRepo);
        const utxoUseCases = new UtxoUseCases(utxoNoirSerializerRepo);
        const nullifierUseCases = new NullifierUseCases(nullifierNoirSerializerRepo)
        const shellUseCases = new ShellUseCases(shellRepo);

        this.publicKeysStore = new PublicKeysStore();
        this.ethObserverStore = new EthObserverStore(ethObserverUseCases);
        this.validiumSmartContractStore = new ValidiumSmartContractStore(this.getEthObserverStore(), validiumSmartContractUseCases);
        this.utxoStore = new UtxoStore(this.getPublicKeysStore(), utxoUseCases);
        this.nullifierStore = new NullifierStore(nullifierUseCases);
        this.shellStore = new ShellStore(shellUseCases);
    }

    getPublicKeysStore(): PublicKeysStore {
        return this.publicKeysStore as PublicKeysStore;
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

    getShellStore(): ShellStore {
        return this.shellStore as ShellStore;
    }

}

const injector = new Injector();
export default injector;
