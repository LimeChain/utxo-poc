//@ts-ignore
import { InputMap } from '@noir-lang/noir_js';
import UtxoNode from '../../entities/UtxoNode';

export default class NoirUtxo {

    erc20_address: number[] = [];
    spender_pub_key_x: number[] = [];
    spender_pub_key_y: number[] = [];
    value: number[] = [];
    nonce: number = -1;

    static fromUtxoNode(utxoNode: UtxoNode): NoirUtxo {
        const dto = new NoirUtxo();

        dto.erc20_address = Array.from(utxoNode.getErc20AddrAsUint8Array());
        dto.spender_pub_key_x = Array.from(utxoNode.getPubKeyXAsUint8Array());
        dto.spender_pub_key_y = Array.from(utxoNode.getPubKeyYAsUint8Array());
        dto.value = Array.from(utxoNode.getValueAsUint8Array());
        dto.nonce = utxoNode.getNonce();

        return dto;
    }

    toJson(): InputMap {
        return {
            'erc20_address': this.erc20_address,
            'spender_pub_key_x': this.spender_pub_key_x,
            'spender_pub_key_y': this.spender_pub_key_y,
            'value': this.value,
            'nonce': this.nonce,
        }
    }

    toToml(path: string): string {
        const buffers: string[] = [];

        buffers.push(`[[${path}]]`)
        for (const key in this) {
            buffers.push(`${key} = ${JSON.stringify(this[key])}`);
        }

        return buffers.join('\n');
    }

}
