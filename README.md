# XRPL Platform

Interactive dashboard + premium loyalty + encrypted messenger on XRP Ledger.

## Features
- Connect to XRPL Testnet/Mainnet
- Wallet funding & XRP transfers
- Premium points loyalty (low-cost XRP rewards)
- Encrypted messenger (E2E via XRPL memos + AES)
- Simple web dashboard UI

## Quick start
```bash
npm install
npm run dashboard
```

Open http://localhost:3000

## Scripts
- `node src/connect.js` - connect & read account
- `node src/send-xrp.js` - send test XRP
- `node src/loyalty.js` - issue premium points
- `node src/messenger.js` - send encrypted message

## Loyalty economics
- Base reserve ~1 XRP, owner reserve 0.2 XRP per trustline
- Points issued as IOU token (e.g. PREM) cost almost nothing beyond reserves
- Rewards can be tiny fractions of XRP or your token

## Messenger
- Messages encrypted client-side (AES-256)
- Payload stored in XRPL Payment memo (1 drop)
- Only recipient with key can decrypt

Built with xrpl.js. For demo only.