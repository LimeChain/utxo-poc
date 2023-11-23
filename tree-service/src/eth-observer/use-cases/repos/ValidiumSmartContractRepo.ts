import ParsedEvent from '../../entities/ParsedEvent';

export interface ValidiumSmartContractRepo {

    fetchEvents(fromHeight: number, toHeight: number): Promise<ParsedEvent[]>;

}
