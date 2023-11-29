import { JsonMap } from '@iarna/toml';
import UtxoNode from '../../entities/UtxoNode';

export default class Output {

    erc20_address: number[] = [];
    spender_pub_key_x: number[] = [];
    spender_pub_key_y: number[] = [];
    value: number[] = [];

    static fromUtxoNode(utxoNode: UtxoNode): Output {
        const dto = new Output();

        dto.erc20_address = Array.from(utxoNode.getErc20AddrAsUint8Array());
        dto.spender_pub_key_x = Array.from(utxoNode.getPubKeyXAsUint8Array());
        dto.spender_pub_key_y = Array.from(utxoNode.getPubKeyYAsUint8Array());
        dto.value = Array.from(utxoNode.getValueAsUint8Array());

        return dto;
    }

    toJsonMap(): JsonMap {
        return {
            'erc20_address': this.erc20_address,
            'spender_pub_key_x': this.spender_pub_key_x,
            'spender_pub_key_y': this.spender_pub_key_y,
            'value': this.value,
        }
    }

}
