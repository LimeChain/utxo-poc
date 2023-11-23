import { ValidiumSmartContractRepo } from '../use-cases/repos/ValidiumSmartContractRepo';
import { ethers } from 'ethers';
// @ts-ignore
import CudosMarketsContract from '../../../contracts/CudosMarkets';
import ParsedEvent from '../entities/ParsedEvent';

export class ValidiumSmartContractRepoImpl implements ValidiumSmartContractRepo {

    validiumSmartContract: ethers.Contract;

    constructor() {
        const provider = new ethers.JsonRpcProvider(process.env.ETH_ENDPOINT);
        this.validiumSmartContract = new ethers.Contract(process.env.VALIDIUM_SMART_CONTRACT_ADDRESS as string, CudosMarketsContract.abi, provider);
    }

    async fetchEvents(fromHeight: number, toHeight: number): Promise<ParsedEvent[]> {
        console.log('fetching contract events', fromHeight.toString(), toHeight.toString());
        const paymentEvents = await this.validiumSmartContract.queryFilter('NftMinted', fromHeight, toHeight);
        // console.log(paymentEvents);

        return [
            ParsedEvent.newInstance(ParsedEvent.TYPE_DEPOSIT, 10n * (10n ** 18n), '', 'Alice'),
            ParsedEvent.newInstance(ParsedEvent.TYPE_DEPOSIT, 2n * (10n ** 18n), '', 'Bob'),
            ParsedEvent.newInstance(ParsedEvent.TYPE_DEPOSIT, 5n * (10n ** 18n), '', 'Carol'),
            ParsedEvent.newInstance(ParsedEvent.TYPE_TRANSFER, 1n * (10n ** 18n), 'Alice', 'Bob'),
            ParsedEvent.newInstance(ParsedEvent.TYPE_WITHDRAW, 3n * (10n ** 18n), 'Bob', ''),
        ]
    }

}
