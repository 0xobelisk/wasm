import * as wasm from './external/sov-wasm/pkg'
import {Ed25519Keypair} from "@0xobelisk/sui-client";

// Function to base64 encode a Uint8Array
const toBase64 = (arr: Uint8Array) => {
    return Buffer.from(arr).toString('base64');
};

(async () => {
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

    const pub_key = test_keypair.getPublicKey().toRawBytes()
    const signature = await test_keypair.sign(unsigned_tx)

    // let tx = wasm.serialize_pub_key(keypair.getPublicKey().toRawBytes())
    let tx = wasm.serialize_to_signed_tx(unsigned_tx,pub_key,signature)
    console.log(tx)

    // Convert the tx to a Base64 string
    const txBase64 = toBase64(tx);

    // Prepare the request payload
    // const payload = {
    //     body: txBase64
    // };
    //
    // console.log(txBase64)
    // // Send the transaction to the /txs endpoint
    // const response = await fetch('http://localhost:12346/sequencer/txs', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(payload)
    // });
    //
    // if (response.ok) {
    //     const result = await response.json();
    //     console.log('Transaction submitted successfully:', result);
    // } else {
    //     console.error('Failed to submit transaction:', response.status, response.statusText);
    // }

    // Prepare the batch payload
    const batchPayload = {
        transactions: [txBase64] // You can add more transactions here
    };

    // Send the batch to the /batches endpoint
    const response = await fetch('http://localhost:12346/sequencer/batches', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(batchPayload)
    });

    if (response.ok) {
        const result = await response.json();
        console.log('Batch submitted successfully:', result);
    } else {
        const errorDetails = await response.json();
        console.error('Failed to submit batch:', response.status, response.statusText, JSON.stringify(errorDetails, null, 2));
    }

})();
