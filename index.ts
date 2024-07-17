import * as wasm from './external/sov-wasm/pkg'
// import { Wallet } from "ethers";
import {Ed25519Keypair} from "@0xobelisk/sui-client";
import {bytesToHex, remove0x} from "@metamask/utils";

const cleanPublicKeyResponse = (metamaskPublicKeyResponse: any) => {
    // Slicing is to skip the key byte flags prefix, which Metamask prepends the public key with.
    return remove0x(metamaskPublicKeyResponse).slice(2);
};

(async () => {
    const { sign } = await import('@noble/ed25519');
    // const ed25519 = await import('@noble/ed25519');
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
    // const json_call = {
    //     "Mint": {
    //         "coins": {
    //             "amount": 3000,
    //             "token_id": "token_1rwrh8gn2py0dl4vv65twgctmlwck6esm2as9dftumcw89kqqn3nqrduss6"
    //         },
    //         "mint_to_address": "sov15vspj48hpttzyvxu8kzq5klhvaczcpyxn6z6k0hwpwtzs4a6wkvqwr57gc"
    //     }
    // }

    const json_call = {
        "CreateToken": {
            "salt": 11,
            "token_name": "sov-test-token",
            "initial_balance": 1000000,
            "mint_to_address": "sov15vspj48hpttzyvxu8kzq5klhvaczcpyxn6z6k0hwpwtzs4a6wkvqwr57gc",
            "authorized_minters": [
                "sov1l6n2cku82yfqld30lanm2nfw43n2auc8clw7r5u5m6s7p8jrm4zqrr8r94",
                "sov15vspj48hpttzyvxu8kzq5klhvaczcpyxn6z6k0hwpwtzs4a6wkvqwr57gc"
            ]
        }
    }




    // const json_call = '{"bank":{"CreateToken":{"salt":11,"token_name":"sov-test-token","initial_balance":1000000,"minter_address":"sov15vspj48hpttzyvxu8kzq5klhvaczcpyxn6z6k0hwpwtzs4a6wkvqwr57gc","authorized_minters":["sov1l6n2cku82yfqld30lanm2nfw43n2auc8clw7r5u5m6s7p8jrm4zqrr8r94","sov15vspj48hpttzyvxu8kzq5klhvaczcpyxn6z6k0hwpwtzs4a6wkvqwr57gc"]}}}'
    const serializeCall = wasm.serialize_call(json_call)
    const deserializedCall = wasm.deserialize_call(serializeCall)
    console.log("serializeCall",serializeCall)
    console.log("deserializedCall",deserializedCall)

    let runtime_msg = serializeCall
    let nonce = 0
    let details = {
        max_priority_fee_bips:0,
        max_fee:100000000,
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

    // console.log("unsigned_tx",unsigned_tx)
    // console.log("de_unsigned_tx",de_unsigned_tx)
    const test_private_key:Uint8Array = new Uint8Array([
        117, 251, 248, 217, 135, 70, 194, 105, 46, 80, 41, 66, 185, 56, 200, 35,
        121, 253, 9, 234, 159, 91, 96, 212, 211, 158, 135, 225, 180, 36, 104, 253
    ])
    const test_keypair = Ed25519Keypair.fromSecretKey(test_private_key, { skipValidation: true });
    // console.log(test_keypair)

    // const keypair = new Ed25519Keypair();
    // const pub_key = keypair.getPublicKey().toRawBytes()
    // const signature = await keypair.sign(unsigned_tx)
    const pub_key = test_keypair.getPublicKey().toRawBytes()
    const signature = await test_keypair.sign(unsigned_tx)

    // let tx = wasm.serialize_pub_key(keypair.getPublicKey().toRawBytes())
    let tx = wasm.serialize_to_signed_tx(unsigned_tx,pub_key,signature)
    console.log(tx)

    // console.log(de_unsigned_tx)

    // const wallet = Wallet.createRandom();
    // // 获取私钥
    // const privateKey = wallet.privateKey;
    // console.log(`Private Key: ${privateKey}`);
    //
    // // 获取公钥
    // const pub_key = wallet.publicKey;
    // console.log(`ETH Public Key: ${pub_key}`);
    //
    // // const signature = sign(unsigned_tx, privateKey);
    //
    // console.log("signature",signature)

    // const signed_Transaction = {
    //     signature:{
    //         msg_sig:signature
    //     },
    //     pub_key,
    //     ...unsigned_transaction
    // };
    // let signed_tx = wasm.serialize_signed_transaction(signed_Transaction)
    // let de_signed_tx = wasm.deserialize_signed_transaction(signed_tx)
    //
    // console.log(signed_tx)
    // console.log(de_signed_tx)

})();
