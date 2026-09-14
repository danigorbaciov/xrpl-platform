import { Client, Wallet } from 'xrpl';

const TESTNET = 'wss://s.altnet.rippletest.net:51233/';
const MAINNET = 'wss://xrplcluster.com/';

export function getClient(network = 'testnet') {
  const url = network === 'mainnet' ? MAINNET : TESTNET;
  return new Client(url);
}

export function walletFromSeed(seed) {
  if (!seed || seed.length < 20) throw new Error('Seed invalid');
  return Wallet.fromSeed(seed);
}

export function generateWallet(network = 'testnet') {
  const wallet = Wallet.generate();
  return {
    address: wallet.address,
    seed: wallet.seed,
    publicKey: wallet.publicKey,
    privateKey: wallet.privateKey,
    network,
    explorer: network === 'mainnet'
      ? `https://livenet.xrpl.org/accounts/${wallet.address}`
      : `https://testnet.xrpl.org/accounts/${wallet.address}`
  };
}

export async function getAccountInfo(address, network = 'testnet') {
  const client = getClient(network);
  await client.connect();
  try {
    const info = await client.request({
      command: 'account_info',
      account: address,
      ledger_index: 'validated'
    });
    const balance = await client.getXrpBalance(address);
    return {
      address,
      balance: parseFloat(balance),
      sequence: info.result.account_data.Sequence,
      flags: info.result.account_data.Flags,
      network,
      explorer: network === 'mainnet'
        ? `https://livenet.xrpl.org/accounts/${address}`
        : `https://testnet.xrpl.org/accounts/${address}`
    };
  } finally {
    await client.disconnect();
  }
}

export async function sendXrp(seed, destination, amountXrp, network = 'testnet') {
  const client = getClient(network);
  await client.connect();
  const wallet = walletFromSeed(seed);
  try {
    const prepared = await client.autofill({
      TransactionType: 'Payment',
      Account: wallet.address,
      Amount: String(Math.round(amountXrp * 1_000_000)),
      Destination: destination
    });
    const signed = wallet.sign(prepared);
    const result = await client.submitAndWait(signed.tx_blob);
    return {
      hash: result.result.hash,
      success: result.result.meta.TransactionResult === 'tesSUCCESS',
      explorer: network === 'mainnet'
        ? `https://livenet.xrpl.org/transactions/${result.result.hash}`
        : `https://testnet.xrpl.org/transactions/${result.result.hash}`
    };
  } finally {
    await client.disconnect();
  }
}
