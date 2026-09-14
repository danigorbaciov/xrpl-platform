import xrpl from "xrpl";

const SERVER_URL = "wss://s.altnet.rippletest.net:51233/";
const client = new xrpl.Client(SERVER_URL);

async function main() {
  console.log("Connecting to XRPL Testnet...");
  await client.connect();
  console.log("Connected.");

  console.log("\nFunding a new test wallet...");
  const fund = await client.fundWallet();
  const wallet = fund.wallet;
  console.log(`Address: ${wallet.address}`);
  console.log(`Balance: ${fund.balance} XRP`);
  console.log(`Explorer: https://testnet.xrpl.org/accounts/${wallet.address}`);

  console.log("\nAccount info:");
  const info = await client.request({
    command: "account_info",
    account: wallet.address,
    ledger_index: "validated"
  });
  console.log(JSON.stringify(info.result.account_data, null, 2));

  console.log("\nListening for ledger closes (10s)...");
  client.request({ command: "subscribe", streams: ["ledger"] });
  client.on("ledgerClosed", (l) => {
    console.log(`Ledger #${l.ledger_index} | ${l.txn_count} txns`);
  });

  setTimeout(async () => {
    await client.disconnect();
    console.log("\nDisconnected.");
  }, 10000);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});