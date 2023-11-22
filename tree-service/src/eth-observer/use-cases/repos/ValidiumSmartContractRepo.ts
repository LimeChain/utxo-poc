export interface ValidiumSmartContractRepo {

    fetchEvents(fromHeight: number, toHeight: number): Promise<void>;

}
