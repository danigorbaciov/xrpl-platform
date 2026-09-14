# Dani Gorbaciov - XRP Live

Interactive dashboard + premium loyalty + encrypted messenger + virtual chat on XRP Ledger, with real wallet support and wallet generation.

## Features
- Connect real wallet via seed (Testnet or Mainnet)
- Generate brand-new XRPL wallets from the UI
- Export seed encrypted with your password (AES)
- Live XRP balance, sequence, explorer link
- Send XRP to any address
- Premium points loyalty (low-cost XRP rewards)
- Encrypted messenger (AES-256)
- Virtual chat: floating button, users post messages; optional 1-drop (0.000001 XRP) fee to post
- Futuristic neon UI with button sounds and glow rings

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
- `node src/chat.js` - virtual chat module
- `npm run dashboard` - web UI

## Real wallet
1. Deschide dashboard-ul
2. Alege Testnet (gratuit) sau Mainnet
3. Introdu seed-ul wallet-ului (începe cu `s`) sau generează unul nou în tab-ul Wallet
4. Apasă Conectează — vezi balanța live și poți trimite XRP

## Wallet generation & export
- Generezi un wallet nou → primești adresă + seed
- Export criptat: pui o parolă, seed-ul e criptat AES și afișat ca text — salvează-l offline
- Nimic nu se stochează pe server; totul rămâne în browser

## Avatar
Pune imaginea ta ca `src/public/avatar.png`. Dacă lipsește, apare un fallback cu litera D.

## Loyalty economics
- Base reserve ~1 XRP, owner reserve 0.2 XRP per trustline
- Points issued as IOU token (e.g. PREM) cost almost nothing beyond reserves

## Messenger
- Messages encrypted client-side (AES-256) with a shared key
- Payload stored in XRPL Payment memo (1 drop) in full builds

## Virtual chat
- Buton plutitor 💬 jos-dreapta, mereu activ
- Oamenii scriu mesaje; opțional plătesc 1 drop (0.000001 XRP) ca să posteze
- Mesajele apar live, cu refresh automat

Built with xrpl.js. For demo only.
