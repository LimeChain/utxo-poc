import { Signature } from 'ethers';

export default class RawTransaction {

    static TYPE_DEPOSIT = 1;
    static TYPE_WITHDRAW = 2;
    static TYPE_TRANSFER = 3;

    type: number;
    value: bigint;
    erc20Addr: string;
    fromAddr: string;
    toAddr: string;
    signerAddr: string;
    hash: string;
    signature: Signature;

    constructor(type: number, value: bigint, erc20Addr: string, fromAddr: string, toAddr: string, signerAddr: string, hash: string, signature: Signature) {
        this.type = type;
        this.value = value;
        this.erc20Addr = erc20Addr;
        this.fromAddr = fromAddr;
        this.toAddr = toAddr;
        this.signerAddr = signerAddr;
        this.hash = hash;
        this.signature = signature;
    }

    static newInstanceDeposit(value: bigint, erc20Addr: string, depositAddr: string, hash: string, signature: Signature) {
        return new RawTransaction(RawTransaction.TYPE_DEPOSIT, value, erc20Addr, '', depositAddr, depositAddr, hash, signature);
    }

    static newInstanceWithdraw(value: bigint, erc20Addr: string, withdrawAddr: string, hash: string, signature: Signature) {
        return new RawTransaction(RawTransaction.TYPE_WITHDRAW, value, erc20Addr, withdrawAddr, '', withdrawAddr, hash, signature);
    }

    static newInstanceTransfer(value: bigint, erc20Addr: string, fromAddr: string, toAddr: string, hash: string, signature: Signature) {
        return new RawTransaction(RawTransaction.TYPE_TRANSFER, value, erc20Addr, fromAddr, toAddr, fromAddr, hash, signature);
    }

    isDeposit(): boolean {
        return this.type === RawTransaction.TYPE_DEPOSIT;
    }

    isWithdraw(): boolean {
        return this.type === RawTransaction.TYPE_WITHDRAW;
    }

    isTransfer(): boolean {
        return this.type === RawTransaction.TYPE_TRANSFER;
    }

}
