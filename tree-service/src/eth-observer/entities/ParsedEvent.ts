export default class ParsedEvent {

    static TYPE_DEPOSIT = 1;
    static TYPE_WITHDRAW = 2;
    static TYPE_TRANSFER = 3;

    type: number = ParsedEvent.TYPE_TRANSFER;
    value: bigint = 0n;
    privKey: string = '';
    pubKey: string = '';

    static newInstance(type: number, value: bigint, privKey: string, pubKey: string) {
        const event = new ParsedEvent();

        event.type = type;
        event.value = value;
        event.privKey = privKey;
        event.pubKey = pubKey;

        return event;
    }

    isDeposit(): boolean {
        return this.type === ParsedEvent.TYPE_DEPOSIT;
    }

    isWithdraw(): boolean {
        return this.type === ParsedEvent.TYPE_WITHDRAW;
    }

    isTransfer(): boolean {
        return this.type === ParsedEvent.TYPE_TRANSFER;
    }

}
