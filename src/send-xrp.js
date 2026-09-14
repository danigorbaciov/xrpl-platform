import xrpl from "xrpl";

const SERVER_URL = "wss://s.altnet.rippletest.net:51233/";
const client = new xrpl.Client(SERVER_URL);

async function main() {
  await client.connect();
  console.log("Connected to Testnet");

  // Sender
  const fundSender = await client.fundWallet();
  const sender = fundSender.wallet;
  console.log(`Sender: ${sender.address} (${fundSender.balance} XRP)`);

  // Receiver
  const fundReceiver = await client.fundWallet();
  const receiver = fundReceiver.wallet;
  console.log(`Receiver: ${receiver.address}`);

  const amountXrp = 10;
  const prepared = await client.autofill({
    TransactionType: "Payment",
    Account: sender.address,
    Amount: xrpl.xrpToDrops(amountXrp),
    Destination: receiver.address
  });

  const signed = sender.sign(prepared);
  console.log(`\nSending ${amountXrp} XRP...`);
  const result = await client.submitAndWait(signed.tx_blob);

  if (result.result.meta.TransactionResult === "tesSUCCESS") {
    console.log("Payment succeeded!");
    console.log(`Tx hash: ${result.result.hash}`);
    console.log(`Explorer: https://testnet.xrpl.org/transactions/${result.result.hash}`);
  } else {
    console.log(`Failed: ${result.result.meta.TransactionResult}`);
  }

  const bal = await client.getXrpBalance(receiver.address);
  console.log(`Receiver balance now: ${bal} XRP`);

  await client.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});