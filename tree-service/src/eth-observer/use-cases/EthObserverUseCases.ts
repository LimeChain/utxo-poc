import EthObserverRepo from './repos/EthObserverRepo';

export default class EthObserverUseCases {

    ethObserverRepo: EthObserverRepo

    constructor(ethObserverRepo: EthObserverRepo) {
        this.ethObserverRepo = ethObserverRepo;
    }

    fetchBlockNumber(): Promise<number> {
        return this.ethObserverRepo.fetchBlockNumber();
    }

}
