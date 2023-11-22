import { ValidiumSmartContractRepo } from '../use-cases/repos/ValidiumSmartContractRepo';
import { ethers } from 'ethers';
// @ts-ignore
import CudosMarketsContract from '../../../contracts/CudosMarkets';

export class ValidiumSmartContractRepoImpl implements ValidiumSmartContractRepo {

    validiumSmartContract: ethers.Contract;

    constructor() {
        const provider = new ethers.JsonRpcProvider(process.env.ETH_ENDPOINT);
        this.validiumSmartContract = new ethers.Contract(process.env.VALIDIUM_SMART_CONTRACT_ADDRESS as string, CudosMarketsContract.abi, provider);
    }

    async fetchEvents(fromHeight: number, toHeight: number): Promise<void> {
        console.log('fetching contract events', fromHeight.toString(), toHeight.toString());
        const paymentEvents = await this.validiumSmartContract.queryFilter('NftMinted', fromHeight, toHeight);
        // console.log(paymentEvents);
    }

}
