import UtxoNode from '../../entities/UtxoNode';

export default class Output {

    erc20_address: number[] = [];
    spender_pub_key_x: number[] = [];
    spender_pub_key_y: number[] = [];
    value: number[] = [];
    nonce: number = -1;

    static fromUtxoNode(utxoNode: UtxoNode): Output {
        const dto = new Output();

        dto.erc20_address = Array.from(utxoNode.getErc20AddrAsUint8Array());
        dto.spender_pub_key_x = Array.from(utxoNode.getPubKeyXAsUint8Array());
        dto.spender_pub_key_y = Array.from(utxoNode.getPubKeyYAsUint8Array());
        dto.value = Array.from(utxoNode.getValueAsUint8Array());
        dto.nonce = utxoNode.getNonce();

        return dto;
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
