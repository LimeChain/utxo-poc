import EthObserverRepo from '../use-cases/repos/EthObserverRepo';
import { ethers } from 'ethers';

export default class EthObserverRepoImpl implements EthObserverRepo {

    ethersProvider: ethers.JsonRpcProvider;

    constructor() {
        this.ethersProvider = new ethers.JsonRpcProvider(process.env.ETH_ENDPOINT);
    }

    fetchBlockNumber(): Promise<number> {
        return this.ethersProvider.getBlockNumber();
    }

}
