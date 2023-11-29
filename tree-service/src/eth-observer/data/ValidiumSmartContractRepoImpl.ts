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
        const depositTx = ["0x015c12f049d4aece78ff2802e1979ff5d411e2f3fb186961a6af125fccc244a3", "0x24ad0b600c51e1d522d14796b333b093c4261e03f9dc2c88709fe95433d6eb3d", "0xc2a41df1501b885d6c21dd7aefe2eb098510014e4f0712324cb4195dad2d5b8a"];
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

        const transferTx = "0x7501f922d58b6a67a3080b5c946e9c344344c9aba5d1e5e88a28b3e15891434a"
        const txResp = await this.provider.getTransaction(transferTx);
        if (txResp === null) {
            console.error('Unable to fetch tx: ' + transferTx);
            process.exit(-1);
        }
        if (txResp.to === null || txResp.from === null) {
            console.error('Trying to process tx: ' + transferTx);
            process.exit(-1);
        }
        rawTransactions.push(RawTransaction.newInstanceTransfer(txResp.value, "",  txResp.from, txResp.to, txResp.hash, txResp.signature));

        // rawTransactions.push(RawTransaction.newInstanceTransfer(3n, "", "0x8cdeD8F7d124f4Bc54617663fdC58dF75946D0Ff", "0xd0a1A2eE2FE029C72dA70515cB8Dd363033233Be", saveHash!, saveSig!));
        // rawTransactions.push(RawTransaction.newInstanceWithdraw(162030712642729870n, "", "0x8cdeD8F7d124f4Bc54617663fdC58dF75946D0Ff", saveHash!, saveSig!));
        console.log('Available address to work with: ', addressesSet);
        // end hard coded values

        return rawTransactions;
    }

}
