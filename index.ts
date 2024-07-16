import * as wasm from './external/sov-wasm/pkg-r'


(async () => {

    // 创建一个 MyData 对象
    const myData = { field1: "Hello", field2: 42 };

    // 序列化对象
    const serializedData: Uint8Array = wasm.serialize(myData);
    console.log('Serialized data:', serializedData);

    // 反序列化数据
    const deserializedData: any = wasm.deserialize(serializedData);
    console.log('Deserialized data:', deserializedData);
})();
