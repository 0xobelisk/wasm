use wasm_bindgen_test::*;
use serde_wasm_bindgen::{to_value};
use serde_json::json;
use sov_wasm::{deserialize_call, serialize_call};


// 启用 wasm_bindgen_test
wasm_bindgen_test_configure!(run_in_browser);

#[wasm_bindgen_test]
fn test_serialize_call() {
    let data = json!({
        "bank": {
            "CreateToken": {
                "salt": 11,
                "token_name": "sov-tests-token",
                "initial_balance": 1000000,
                "minter_address": "sov15vspj48hpttzyvxu8kzq5klhvaczcpyxn6z6k0hwpwtzs4a6wkvqwr57gc",
                "authorized_minters": [
                    "sov1l6n2cku82yfqld30lanm2nfw43n2auc8clw7r5u5m6s7p8jrm4zqrr8r94",
                    "sov15vspj48hpttzyvxu8kzq5klhvaczcpyxn6z6k0hwpwtzs4a6wkvqwr57gc"
                ]
            }
        }
    });

    let js_value = to_value(&data).unwrap();
    let serialized = serialize_call(js_value.clone());
    let deserialized = deserialize_call(&serialized);

    assert_eq!(js_value, deserialized);
}

// 你可以为其他函数编写类似的测试
// #[wasm_bindgen_test]
// fn test_serialize_deserialize() {
//     let my_data = json!({
//         "field1": "Hello",
//         "field2": 42
//     });
//
//     let js_value = to_value(&my_data).unwrap();
//     let serialized = serialize(js_value.clone());
//     let deserialized = deserialize(&serialized);
//
//     assert_eq!(js_value, deserialized);
// }