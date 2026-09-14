# XRPL Platform

A starter platform for building on the XRP Ledger (XRPL) with XRP and Ripple integrations.

## Features
- Connect to XRPL Testnet
- Fund test wallets via faucet
- Query account info and balances
- Send XRP payments
- Subscribe to ledger events

## Setup
```bash
npm install
```

## Run examples
```bash
node src/connect.js
node src/send-xrp.js
```

## Network
Uses public Testnet: wss://s.altnet.rippletest.net:51233

Explorer: https://testnet.xrpl.org

## Next steps
- Add trust lines and issued currencies (e.g. RLUSD)
- Build a simple dashboard
- Add payment channels or escrows
- Deploy a web UI

Built with xrpl.js (latest).