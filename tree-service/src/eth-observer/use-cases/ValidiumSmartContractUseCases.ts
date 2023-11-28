import RawTransaction from '../entities/RawTransaction';
import { ValidiumSmartContractRepo } from './repos/ValidiumSmartContractRepo';

export class ValidiumSmartContractUseCases {

    validiumSmartContractRepo: ValidiumSmartContractRepo;

    constructor(validiumSmartContractRepo: ValidiumSmartContractRepo) {
        this.validiumSmartContractRepo = validiumSmartContractRepo;
    }

    fetchRawTransactions(fromHeight: number, toHeight: number): Promise<RawTransaction[]> {
        return this.validiumSmartContractRepo.fetchRawTransactions(fromHeight, toHeight);
    }

}
