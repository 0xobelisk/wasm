import { rpcErrors } from '@metamask/rpc-errors';
import fs from 'fs';
import path from 'path';

// 加载 WASM 模块字节码
const wasmFilePath = path.resolve(__dirname, './module.wasm');
const moduleBytes = fs.readFileSync(wasmFilePath);

type Argument = [number, number];
type InstanceMemorySlice = [number, number];
type WasmInstance = {
  alloc: (len: number) => number;
  dealloc: (ptr: number, len: number) => void;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  bech_encode_public_key: (ptr: number, len: number) => number;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  serialize_call: (ptr: number, len: number) => number;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  serialize_unsigned_transaction: (ptr: number, len: number) => number;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  serialize_transaction: (ptr: number, len: number) => number;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  memory: WebAssembly.Memory;
};

export type AllocatedStruct = {
  bytes: Uint8Array;
  ptr: number;
};

export class SovWasm {
  #instance: WebAssembly.Instance;

  #instanceExports: WasmInstance;

  #allocs: InstanceMemorySlice[];

  constructor(moduleBytes: Buffer) {
    this.#allocs = [];

    const wasmModule = new WebAssembly.Module(moduleBytes);
    const instance = new WebAssembly.Instance(wasmModule, {
      env: {
        memory: new WebAssembly.Memory({ initial: 256 }),
        abort: console.log,
      },
    });

    this.#instance = instance;
    this.#instanceExports = instance.exports as unknown as WasmInstance;
    console.log('WASM module loaded successfully');
  }

  public alloc(len: number): number {
    const ptr = this.#instanceExports.alloc(len);
    this.#allocs.push([ptr, len]);
    return ptr;
  }

  public dealloc(): void {
    for (const pair of this.#allocs) {
      const [ptr, len] = pair;
      this.#instanceExports.dealloc(ptr, len);
    }
    this.#allocs = [];
  }

  public bechEncodePublicKey(publicKey: string): string {
    console.trace(`bechEncodePublicKey:${JSON.stringify(publicKey)}`);
    const bechEncodedStrBytes = this.callWasmFunction(
      publicKey,
      this.#instanceExports.bech_encode_public_key,
    );
    return new TextDecoder().decode(bechEncodedStrBytes);
  }

  public serializeCall(callMessage: object): Uint8Array {
    console.trace(`serializeCall:${JSON.stringify(callMessage)}`);
    return this.callWasmFunction(
      callMessage,
      this.#instanceExports.serialize_call,
    );
  }

  public serializeUnsignedTransaction(unsignedTransaction: object): Uint8Array {
    console.trace(
      `serializeUnsignedTransaction:${JSON.stringify(unsignedTransaction)}`,
    );
    return this.callWasmFunction(
      unsignedTransaction,
      this.#instanceExports.serialize_unsigned_transaction,
    );
  }

  public serializeTransaction(transaction: object): Uint8Array {
    console.trace(`serializeTransaction:${JSON.stringify(transaction)}`);
    return this.callWasmFunction(
      transaction,
      this.#instanceExports.serialize_transaction,
    );
  }

  private callWasmFunction(
    args: any,
    wasmFunction: (ptr: number, len: number) => number,
  ): Uint8Array {
    const [argument_ptr, argument_len] = this.passArgumentsToWasmAsJson(args);
    const ptr = wasmFunction(argument_ptr, argument_len);
    return this.allocatedStruct(ptr).bytes;
  }

  private passArgumentsToWasmAsJson(args: any): Argument {
    const argumentsAsJsonString = JSON.stringify(args);
    const encodedArguments = new TextEncoder().encode(argumentsAsJsonString);
    const argumentsPtr = this.alloc(encodedArguments.length);
    const argumentsBuffer = new Uint8Array(
      this.#instanceExports.memory.buffer,
      argumentsPtr,
      encodedArguments.length,
    );
    argumentsBuffer.set(encodedArguments);
    return [argumentsPtr, encodedArguments.length];
  }

  private allocatedStruct(ptr: number): AllocatedStruct {
    if (ptr === 0) {
      throw rpcErrors.internal('Error in Serde/JSON deserialization.');
    }
    if (ptr === 1) {
      throw rpcErrors.internal('Error in serialization.');
    }
    if (ptr === 2) {
      throw rpcErrors.internal('Error when returning serialized bytes.');
    }
    const len = new DataView(this.#instanceExports.memory.buffer).getUint32(
      ptr,
      true,
    );
    const arr = this.#instanceExports.memory.buffer.slice(
      ptr + 4,
      ptr + 4 + len,
    );
    this.#allocs.push([ptr, len + 4]);
    return {
      bytes: new Uint8Array(arr),
      ptr: ptr + 4,
    };
  }
}
