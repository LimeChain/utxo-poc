import ParsedEvent from '../entities/ParsedEvent';
import { ValidiumSmartContractRepo } from './repos/ValidiumSmartContractRepo';

export class ValidiumSmartContractUseCases {

    validiumSmartContractRepo: ValidiumSmartContractRepo;

    constructor(validiumSmartContractRepo: ValidiumSmartContractRepo) {
        this.validiumSmartContractRepo = validiumSmartContractRepo;
    }

    fetchEvents(fromHeight: number, toHeight: number): Promise<ParsedEvent[]> {
        return this.validiumSmartContractRepo.fetchEvents(fromHeight, toHeight);
    }

}
