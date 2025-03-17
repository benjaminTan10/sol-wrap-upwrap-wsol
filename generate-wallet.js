import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';

// Generate a new random keypair
const keypair = Keypair.generate();

console.log('Public Key:', keypair.publicKey.toString());
console.log('Private Key (base58):', bs58.encode(keypair.secretKey));
console.log('');
console.log('Add this to your .env file:');
console.log(`PRIVATE_KEY=${bs58.encode(keypair.secretKey)}`); 