export default class BigIntUtils {

    static convertBigIntToUint8Array(value: bigint): Uint8Array {
        const valueBufferArray = new Uint8Array(32);
        for (let convertedValue = value, i = valueBufferArray.length - 1; convertedValue > 0n; convertedValue >>= 8n, --i) {
            valueBufferArray[i] = Number(convertedValue & 0xFFn);
        }

        return valueBufferArray;
    }

}
