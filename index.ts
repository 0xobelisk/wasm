import * as wasm from './external/sov-wasm/pkg'
import { Ed25519Keypair } from '@0xobelisk/sui-client';
import { bytesToHex, remove0x } from '@metamask/utils';
import { createHash } from 'crypto';
import { bech32m } from '@scure/base';

/**
 * 将公钥转换成 bech32 地址
 * @param pubkey 公钥 (hex 字符串)
 * @returns bech32 地址
 */
function pubkeyToBech32(pubkey: string): string {
    // 1. 对公钥进行 SHA-256 哈希处理
    const sha256Hash = createHash('sha256')
        .update(Buffer.from(pubkey, 'hex'))
        .digest();

    // 2. 将 SHA-256 哈希结果进行 bech32m 编码
    const words = bech32m.toWords(sha256Hash);
    const bech32Address = bech32m.encode('sov', words);

    return bech32Address;
}

const cleanPublicKeyResponse = (metamaskPublicKeyResponse: any) => {
    // Slicing is to skip the key byte flags prefix, which Metamask prepends the public key with.
    return remove0x(metamaskPublicKeyResponse).slice(2);
};

(async () => {

    // // 创建一个 MyData 对象
    // const myData = { field1: "Hello", field2: 42 };
    //
    // // 序列化对象
    // const serializedData: Uint8Array = wasm.serialize(myData);
    // console.log('Serialized data:', serializedData);
    //
    // // 反序列化数据
    // const deserializedData: any = wasm.deserialize(serializedData);
    // console.log('Deserialized data:', deserializedData);

    const json_call = '{"bank":{"CreateToken":{"salt":11,"token_name":"sov-test-token","initial_balance":1000000,"minter_address":"sov15vspj48hpttzyvxu8kzq5klhvaczcpyxn6z6k0hwpwtzs4a6wkvqwr57gc","authorized_minters":["sov1l6n2cku82yfqld30lanm2nfw43n2auc8clw7r5u5m6s7p8jrm4zqrr8r94","sov15vspj48hpttzyvxu8kzq5klhvaczcpyxn6z6k0hwpwtzs4a6wkvqwr57gc"]}}}'
    const serializeCall = wasm.serialize_call(json_call)
    const deserializedCall = wasm.deserialize_call(serializeCall)
    // console.log(serializeCall)
    // console.log(deserializedCall)

    let runtime_msg = serializeCall
    let nonce = 0
    let details = {
        max_priority_fee_bips:0,
        max_fee:10000,
        gas_limit:null,
        chain_id:4321
    }
    let unsigned_transaction = {
        runtime_msg,
        nonce,
        details
    }
    let unsigned_tx = wasm.serialize_unsigned_transaction(unsigned_transaction)
    let de_unsigned_tx = wasm.deserialize_unsigned_transaction(unsigned_tx)
    //
    // console.log(unsigned_tx)
    // console.log(de_unsigned_tx)


    const keypair = new Ed25519Keypair();

    const pub_key = cleanPublicKeyResponse(bytesToHex(keypair.getPublicKey().toRawBytes()));
    console.log(`Sui Public Key: ${pub_key}`);

    const signature = await keypair.sign(unsigned_tx)
    console.log("signature",signature)



    const signed_Transaction = {
        signature,
        pub_key,
        ...unsigned_transaction
    };

    let signed_tx = wasm.serialize_signed_transaction(signed_Transaction)
    let de_signed_tx = wasm.deserialize_signed_transaction(signed_tx)

    console.log(signed_tx)
    console.log(de_signed_tx)

})();
