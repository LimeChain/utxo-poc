import RawTransaction from '../../entities/RawTransaction';
import { ValidiumSmartContractUseCases } from '../../use-cases/ValidiumSmartContractUseCases';
import EthObserverStore from './EthObserverStore';

export class ValidiumSmartContractStore {

    ethObserverStore: EthObserverStore;
    validiumSmartContractUseCases: ValidiumSmartContractUseCases;

    lastCheckedEthBlockNumber: number;

    constructor(ethObserverStore: EthObserverStore, validiumSmartContractUseCases: ValidiumSmartContractUseCases) {
        this.ethObserverStore = ethObserverStore;
        this.validiumSmartContractUseCases = validiumSmartContractUseCases;

        this.lastCheckedEthBlockNumber = parseInt(process.env.ETH_BLOCK_START ?? "0");
    }

    async fetchRawTransactions(): Promise<RawTransaction[]> {
        const ethBlockHeight = await this.ethObserverStore.fetchBlockNumber();
        if (ethBlockHeight === this.lastCheckedEthBlockNumber) {
            return [];
        }

        const rawTransactions = await this.validiumSmartContractUseCases.fetchRawTransactions(this.lastCheckedEthBlockNumber + 1, ethBlockHeight);
        this.lastCheckedEthBlockNumber = ethBlockHeight;

        return rawTransactions;
    }

    async prove(): Promise<void> {
        await this.validiumSmartContractUseCases.prove();
    }

}
