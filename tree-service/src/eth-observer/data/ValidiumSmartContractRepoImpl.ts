import { ValidiumSmartContractRepo } from '../use-cases/repos/ValidiumSmartContractRepo';
import { JsonRpcProvider, ethers, Transaction } from 'ethers';
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

        for (let block = fromHeight; block <= toHeight; ++block) {
            const blockResp = await this.provider.getBlock(block);
            if (blockResp === null) {
                continue;
            }

            for (let txIndex = 0; txIndex < blockResp.transactions.length; ++txIndex) {
                const txHash = blockResp.transactions[txIndex];
                const txResp = await this.provider.getTransaction(txHash);
                if (txResp === null) {
                    console.error('Unable to fetch tx: ' + txHash);
                    process.exit(-1);
                }
                if (txResp.to === null) {
                    continue;
                }

                const serializedTx = Transaction.from(txResp).unsignedSerialized;
                const unsignedHash = ethers.keccak256(serializedTx);

                if (txResp.to === process.env.VALIDIUM_SMART_CONTRACT_ADDRESS) {
                    rawTransactions.push(RawTransaction.newInstanceDeposit(txResp.value, "", txResp.from, txResp.hash, unsignedHash, txResp.signature));
                } else if (txResp.to === process.env.VALIDIUM_SMART_CONTRACT_ADDRESS) {
                    // rawTransactions.push(RawTransaction.newInstanceWithdraw(txResp.value, "", "0x8cdeD8F7d124f4Bc54617663fdC58dF75946D0Ff", txResp.hash, digest, txResp.signature));
                } else {
                    rawTransactions.push(RawTransaction.newInstanceTransfer(txResp.value, "", txResp.from, txResp.to, txResp.hash, unsignedHash, txResp.signature));
                }
            }
        }

        return rawTransactions;
    }

}
