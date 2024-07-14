import { Ed25519Keypair } from '@0xobelisk/sui-client';
import { bytesToHex, remove0x } from '@metamask/utils';
import { SovWasm } from './wasm1';
import {ethers, Wallet} from 'ethers';

const cleanPublicKeyResponse = (metamaskPublicKeyResponse: any) => {
  // Slicing is to skip the key byte flags prefix, which Metamask prepends the public key with.
  return remove0x(metamaskPublicKeyResponse).slice(2);
};

const wasm = new SovWasm();
const main = () => {
  const keypair = new Ed25519Keypair();
  const wallet = Wallet.createRandom();
  // 获取私钥
  const privateKey = wallet.privateKey;
  console.log(`Private Key: ${privateKey}`);

  // 获取公钥
  const publicKey = wallet.publicKey;
  console.log(`ETH Public Key: ${publicKey}`);

  const pk = bytesToHex(keypair.getPublicKey().toRawBytes());
  // const publicKey = cleanPublicKeyResponse(pk);
  console.log(`Sui Public Key: ${pk}`);
  // console.log(`Instance Exports: ${JSON.stringify(wasm.getInstanceExports())}`);
  // console.log(`Allocations: ${JSON.stringify(wasm.getAllocs())}`);

  const new_pk = cleanPublicKeyResponse(publicKey);

  const address = wasm.bechEncodePublicKey(new_pk);
  console.log(address);
  wasm.dealloc();
};
main();
