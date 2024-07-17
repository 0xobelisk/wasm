import { Ed25519Keypair } from '@0xobelisk/sui-client';
import { bytesToHex, remove0x } from '@metamask/utils';
import { Wallet } from 'ethers';
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




const call = '{"bank":{"CreateToken":{"salt":11,"token_name":"sov-test-token","initial_balance":1000000,"minter_address":"sov15vspj48hpttzyvxu8kzq5klhvaczcpyxn6z6k0hwpwtzs4a6wkvqwr57gc","authorized_minters":["sov1l6n2cku82yfqld30lanm2nfw43n2auc8clw7r5u5m6s7p8jrm4zqrr8r94","sov15vspj48hpttzyvxu8kzq5klhvaczcpyxn6z6k0hwpwtzs4a6wkvqwr57gc"]}}}'


const main = async () => {
	const keypair = new Ed25519Keypair();
	const signature = await keypair.sign(new Uint8Array())

	console.log("signature",signature)
	const wallet = Wallet.createRandom();
	// 获取私钥
	const privateKey = wallet.privateKey;
	console.log(`Private Key: ${privateKey}`);

	// 获取公钥
	const publicKey = wallet.publicKey;
	console.log(`ETH Public Key: ${publicKey}`);

	const pk = bytesToHex(keypair.getPublicKey().toRawBytes());
	console.log(`Sui Public Key: ${pk}`);
	const new_pk = cleanPublicKeyResponse(publicKey);
	const bech32Address = pubkeyToBech32(new_pk);
	console.log(bech32Address);


};
main();
