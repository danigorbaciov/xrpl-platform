import { Client, Wallet } from 'xrpl';
import CryptoJS from 'crypto-js';

// Encrypted messenger: AES-256 client-side, payload in XRPL memo
// Only recipient with shared key can decrypt
const SENDER_SEED = process.env.SENDER_SEED || 'snoPBrXtMeMyMHUVTgbuqAfg1SUTb';

function encryptMessage(plaintext, sharedKey) {
  return CryptoJS.AES.encrypt(plaintext, sharedKey).toString();
}

function decryptMessage(ciphertext, sharedKey) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, sharedKey);
  return bytes.toString(CryptoJS.enc.Utf8);
}

async function sendEncryptedMessage(recipientAddress, plaintext, sharedKey) {
  const client = new Client('wss://s.altnet.rippletest.net:51233');
  await client.connect();

  const sender = Wallet.fromSeed(SENDER_SEED);
  const encrypted = encryptMessage(plaintext, sharedKey);

  const tx = {
    TransactionType: 'Payment',
    Account: sender.address,
    Destination: recipientAddress,
    Amount: '1', // 1 drop = 0.000001 XRP
    Memos: [
      {
        Memo: {
          MemoData: Buffer.from(encrypted).toString('hex'),
          MemoFormat: 'text/plain',
          MemoType: Buffer.from('encrypted-chat').toString('hex'),
        },
      },
    ],
  };

  const prepared = await client.autofill(tx);
  const signed = sender.sign(prepared);
  const result = await client.submitAndWait(signed.tx_blob);

  console.log('Encrypted message sent. Hash:', result.result.hash);
  console.log('Cost: 0.000001 XRP (1 drop)');

  await client.disconnect();
  return result;
}

// Demo decrypt
const demoKey = 'super-secret-shared-key';
const demoCipher = encryptMessage('Salut din XRPL!', demoKey);
console.log('Demo encrypted:', demoCipher);
console.log('Demo decrypted:', decryptMessage(demoCipher, demoKey));

console.log('Messenger module ready. Use sendEncryptedMessage(address, text, key)');