import EthObserverUseCases from '../../use-cases/EthObserverUseCases';

export default class EthObserverStore {

    ethObserverUseCases: EthObserverUseCases;

    constructor(ethObserverUseCases: EthObserverUseCases) {
        this.ethObserverUseCases = ethObserverUseCases;
    }

    fetchBlockNumber(): Promise<number> {
        return this.ethObserverUseCases.fetchBlockNumber();
    }

}
