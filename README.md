# XRPL Platform

Interactive dashboard + premium loyalty + encrypted messenger on XRP Ledger, with real wallet support.

## Features
- Connect real wallet via seed (Testnet or Mainnet)
- Live XRP balance, sequence, explorer link
- Send XRP to any address
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
- `npm run dashboard` - web UI with real wallet connect

## Real wallet
1. Deschide dashboard-ul
2. Alege Testnet (gratuit) sau Mainnet
3. Introdu seed-ul wallet-ului (începe cu `s`)
4. Apasă Conectează — vezi balanța live și poți trimite XRP

> Seed-ul rămâne doar în browser; nu e stocat pe server. Pentru Mainnet folosește doar XRP pe care îți permiți să-l miști.

## Loyalty economics
- Base reserve ~1 XRP, owner reserve 0.2 XRP per trustline
- Points issued as IOU token (e.g. PREM) cost almost nothing beyond reserves

## Messenger
- Messages encrypted client-side (AES-256)
- Payload stored in XRPL Payment memo (1 drop)
- Only recipient with key can decrypt

Built with xrpl.js. For demo only.