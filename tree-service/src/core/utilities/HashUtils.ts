import createKeccakHash from 'keccak';

export default class HashUtils {

    static createHash(data: string | Buffer, encoding?: BufferEncoding) {
        return createKeccakHash('keccak256').update(data, encoding).digest('hex');
    }

}
