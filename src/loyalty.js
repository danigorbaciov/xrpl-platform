import { Client, Wallet, TxResponse } from 'xrpl';

// Premium points as IOU token (PREM) issued by you
// Cost: ~0.2 XRP owner reserve per new trustline, negligible tx fees
const ISSUER_SEED = process.env.ISSUER_SEED || 'snoPBrXtMeMyMHUVTgbuqAfg1SUTb'; // test seed
const CURRENCY = 'PREM';

async function issuePremiumPoints(recipientAddress, amount) {
  const client = new Client('wss://s.altnet.rippletest.net:51233');
  await client.connect();

  const issuer = Wallet.fromSeed(ISSUER_SEED);

  // Ensure trustline exists on recipient side (they must trust you)
  // Here we just send the payment; recipient needs TrustSet first
  const payment = {
    TransactionType: 'Payment',
    Account: issuer.address,
    Destination: recipientAddress,
    Amount: {
      currency: CURRENCY,
      value: amount.toString(),
      issuer: issuer.address,
    },
  };

  const prepared = await client.autofill(payment);
  const signed = issuer.sign(prepared);
  const result = await client.submitAndWait(signed.tx_blob);

  console.log('Premium points issued:', amount, CURRENCY);
  console.log('Tx hash:', result.result.hash);
  console.log('Cost to you: ~0.00001 XRP fee + 0.2 XRP reserve if new trustline');

  await client.disconnect();
  return result;
}

// Example: issue 100 PREM to a test address
// issuePremiumPoints('rXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', 100);

console.log('Loyalty module ready. Use issuePremiumPoints(address, amount)');