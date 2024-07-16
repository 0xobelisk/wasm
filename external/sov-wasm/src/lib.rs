use borsh::{BorshDeserialize, BorshSerialize};
use serde::{Deserialize, Serialize};
use serde_wasm_bindgen::{from_value, to_value};
use wasm_bindgen::prelude::*;

use sov_modules_api::execution_mode::Zk;
use sov_mock_zkvm::MockZkVerifier;
use sov_risc0_adapter::Risc0Verifier;
use sov_modules_api::default_spec::DefaultSpec;
use sov_modules_api::transaction::{UnsignedTransaction};
pub type ZkSpec = DefaultSpec<Risc0Verifier, MockZkVerifier, Zk>;
pub type UnsignedTx = UnsignedTransaction<ZkSpec>;

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
    let data:Vec<u8> = from_value(data).unwrap();
    let mut utx_bytes: Vec<u8> = Vec::new();
    BorshSerialize::serialize(&data, &mut utx_bytes).unwrap();
    utx_bytes
}

#[wasm_bindgen]
pub fn deserialize_call(data: &[u8]) -> JsValue {
    let data: MyData = MyData::try_from_slice(data).unwrap();
    to_value(&data).unwrap()
}

// #[wasm_bindgen]
// pub fn serialize_unsigned_transaction(data: JsValue) -> Vec<u8> {
//     let utx: UnsignedTx = from_value(data).unwrap();
//     let mut utx_bytes: Vec<u8> = Vec::new();
//     BorshSerialize::serialize(&utx, &mut utx_bytes).unwrap();
//     utx_bytes
// }
//
// #[wasm_bindgen]
// pub fn deserialize_unsigned_transaction(data: &[u8]) -> JsValue {
//     let utx: UnsignedTx = UnsignedTransaction::try_from_slice(data).unwrap();
//     to_value(&utx).unwrap()
// }


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
