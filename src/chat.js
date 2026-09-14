import { Client, Wallet } from 'xrpl';
import CryptoJS from 'crypto-js';

// Virtual chat: users pay a tiny XRP fee (1 drop) to post a message.
// Messages are stored in-memory for the demo (replace with DB or XRPL memos in production).

const CHAT_FEE_DROPS = '1'; // 0.000001 XRP
const messages = [];

export function getChatMessages() {
  return messages.slice().reverse();
}

export function addLocalMessage(address, text) {
  messages.push({
    address,
    text,
    ts: Date.now(),
    paid: false,
    hash: null,
  });
  return messages[messages.length - 1];
}

export async function postPaidMessage(seed, text, network = 'testnet') {
  const client = new Client(network === 'mainnet' ? 'wss://xrplcluster.com' : 'wss://s.altnet.rippletest.net:51233');
  await client.connect();
  const wallet = Wallet.fromSeed(seed);
  const encrypted = CryptoJS.AES.encrypt(text, 'xrp-live-chat-key').toString();

  const tx = {
    TransactionType: 'Payment',
    Account: wallet.address,
    Destination: wallet.address, // self-pay for the chat fee
    Amount: CHAT_FEE_DROPS,
    Memos: [
      {
        Memo: {
          MemoData: Buffer.from(encrypted).toString('hex'),
          MemoFormat: 'text/plain',
          MemoType: Buffer.from('xrp-live-chat').toString('hex'),
        },
      },
    ],
  };

  const prepared = await client.autofill(tx);
  const signed = wallet.sign(prepared);
  const result = await client.submitAndWait(signed.tx_blob);
  await client.disconnect();

  const entry = {
    address: wallet.address,
    text,
    ts: Date.now(),
    paid: true,
    hash: result.result.hash,
  };
  messages.push(entry);
  return entry;
}
