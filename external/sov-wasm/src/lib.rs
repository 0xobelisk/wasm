use borsh::{BorshDeserialize, BorshSerialize};
use serde::{Deserialize, Serialize};
use serde_wasm_bindgen::{from_value, to_value};
use serde_json::Value;


use wasm_bindgen::prelude::*;

use sov_modules_api::execution_mode::Zk;
use sov_mock_zkvm::MockZkVerifier;
use sov_risc0_adapter::Risc0Verifier;
use sov_modules_api::default_spec::DefaultSpec;
use sov_modules_api::transaction::{UnsignedTransaction,Transaction};
pub type ZkSpec = DefaultSpec<Risc0Verifier, MockZkVerifier, Zk>;
pub type UnsignedTx = UnsignedTransaction<ZkSpec>;
pub type SignedTx = Transaction<ZkSpec>;


#[wasm_bindgen]
extern "C" {
    pub fn alert(s: &str);
}

#[derive(Serialize, Deserialize, BorshSerialize, BorshDeserialize)]
struct MyData {
    field1: String,
    field2: i32,
}

#[wasm_bindgen]
pub fn serialize_call(data: JsValue) -> Vec<u8> {
    let data: Value = from_value(data).unwrap();
    let serialized_data = serde_json::to_vec(&data).unwrap();
    serialized_data
}

#[wasm_bindgen]
pub fn deserialize_call(data: &[u8]) -> JsValue {
    let deserialized_data: Value = serde_json::from_slice(data).unwrap();
    to_value(&deserialized_data).unwrap()
}

// #[wasm_bindgen]
// pub fn serialize_txDetails(data: JsValue) -> Vec<u8> {
//     let data: TxDs = from_value(data).unwrap();
//     let serialized_data = serde_json::to_vec(&data).unwrap();
//     serialized_data
// }
//
// #[wasm_bindgen]
// pub fn deserialize_txDetails(data: &[u8]) -> JsValue {
//     let deserialized_data: Value = serde_json::from_slice(data).unwrap();
//     to_value(&deserialized_data).unwrap()
// }

#[wasm_bindgen]
pub fn serialize_unsigned_transaction(data: JsValue) -> Vec<u8> {
    let utx: UnsignedTx = from_value(data).unwrap();
    let mut utx_bytes: Vec<u8> = Vec::new();
    BorshSerialize::serialize(&utx, &mut utx_bytes).unwrap();
    utx_bytes
}

#[wasm_bindgen]
pub fn deserialize_unsigned_transaction(data: &[u8]) -> JsValue {
    let utx: UnsignedTx = UnsignedTransaction::try_from_slice(data).unwrap();
    to_value(&utx).unwrap()
}

#[wasm_bindgen]
pub fn serialize_signed_transaction(data: JsValue) -> Vec<u8> {
    let utx: SignedTx = from_value(data).unwrap();
    let mut utx_bytes: Vec<u8> = Vec::new();
    BorshSerialize::serialize(&utx, &mut utx_bytes).unwrap();
    utx_bytes
}

#[wasm_bindgen]
pub fn deserialize_signed_transaction(data: &[u8]) -> JsValue {
    let utx: SignedTx = SignedTx::try_from_slice(data).unwrap();
    to_value(&utx).unwrap()
}





#[wasm_bindgen]
pub fn serialize(data: JsValue) -> Vec<u8> {
    let data: MyData = from_value(data).unwrap();
    let mut utx_bytes: Vec<u8> = Vec::new();
    BorshSerialize::serialize(&data, &mut utx_bytes).unwrap();
    utx_bytes
}

#[wasm_bindgen]
pub fn deserialize(data: &[u8]) -> JsValue {
    let data: MyData = MyData::try_from_slice(data).unwrap();
    to_value(&data).unwrap()
}
