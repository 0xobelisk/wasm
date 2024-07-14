import { Ed25519Keypair } from '@0xobelisk/sui-client';
import { bytesToHex, remove0x } from '@metamask/utils';
// import { SovWasm } from './wasm1';
import { ethers, Wallet } from 'ethers';
import { createHash } from 'crypto';
import { bech32 } from 'bech32';
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

// const wasm = new SovWasm();
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

	// const address = wasm.bechEncodePublicKey(new_pk);
	// console.log(address);
	// wasm.dealloc();

	const bech32Address = pubkeyToBech32(new_pk);
	console.log(bech32Address);
};
main();
