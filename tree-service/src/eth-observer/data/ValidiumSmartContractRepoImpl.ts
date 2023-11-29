import { ValidiumSmartContractRepo } from '../use-cases/repos/ValidiumSmartContractRepo';
import { JsonRpcProvider, Signature, ethers } from 'ethers';
// @ts-ignore
import CudosMarketsContract from '../../../contracts/CudosMarkets';
import RawTransaction from '../entities/RawTransaction';

export class ValidiumSmartContractRepoImpl implements ValidiumSmartContractRepo {

    provider: JsonRpcProvider;
    validiumSmartContract: ethers.Contract;

    constructor() {
        this.provider = new ethers.JsonRpcProvider(process.env.ETH_ENDPOINT);
        this.validiumSmartContract = new ethers.Contract(process.env.VALIDIUM_SMART_CONTRACT_ADDRESS as string, CudosMarketsContract.abi, this.provider);
    }

    async fetchRawTransactions(fromHeight: number, toHeight: number): Promise<RawTransaction[]> {
        const rawTransactions: RawTransaction[] = [];
        console.log('fetching raw transactions', fromHeight.toString(), toHeight.toString());

        // TODO: Use debug trace to get contract information

        // start hard coded values
        const depositTx = ["0x665c629a3977623c163a66a4c8dbb1b4a6b6d5671aa25d523cebc98a99b2e099", "0x3de69f31025aa46783da895550ca70f2b3200b171ba059db1a096e02eaf29070", "0x1f1f8fdde5000b66fbf0e6d406ee6761ccd02988a09db5c145369ef54ec492af"];
        const addressesSet = new Set<string>();
        let saveSig = null;
        let saveHash = null;
        for (let i = 0; i < depositTx.length; ++i) {
            const txResp = await this.provider.getTransaction(depositTx[i]);
            if (txResp === null) {
                console.error('Unable to fetch tx: ' + depositTx[i]);
                process.exit(-1);
            }
            if (txResp.to === null) {
                console.error('Trying to process initcode tx: ' + depositTx[i]);
                process.exit(-1);
            }
            addressesSet.add(txResp.from);
            rawTransactions.push(RawTransaction.newInstanceDeposit(txResp.value, "", txResp.from, txResp.hash, txResp.signature));
            saveSig = txResp.signature;
            saveHash = txResp.hash;
        }
        rawTransactions.push(RawTransaction.newInstanceTransfer(3n, "", "0x8cdeD8F7d124f4Bc54617663fdC58dF75946D0Ff", "0xd0a1A2eE2FE029C72dA70515cB8Dd363033233Be", saveHash!, saveSig!));
        rawTransactions.push(RawTransaction.newInstanceWithdraw(162030712642729870n, "", "0x8cdeD8F7d124f4Bc54617663fdC58dF75946D0Ff", saveHash!, saveSig!));
        console.log('Available address to work with: ', addressesSet);
        // end hard coded values

        return rawTransactions;
    }

}
