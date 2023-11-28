import RawTransaction from '../../entities/RawTransaction';

export interface ValidiumSmartContractRepo {

    fetchRawTransactions(fromHeight: number, toHeight: number): Promise<RawTransaction[]>;

}
