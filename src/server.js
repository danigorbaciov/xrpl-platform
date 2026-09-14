import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { getAccountInfo, sendXrp, walletFromSeed, generateWallet } from './wallet.js';
import { getChatMessages, addLocalMessage, postPaidMessage } from './chat.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', platform: 'Dani Gorbaciov - XRP Live', network: 'XRPL', features: ['dashboard', 'loyalty', 'messenger', 'real-wallet', 'wallet-gen', 'encrypted-export', 'virtual-chat'] });
});

app.post('/api/wallet/connect', async (req, res) => {
  try {
    const { seed, network = 'testnet' } = req.body;
    const wallet = walletFromSeed(seed);
    const info = await getAccountInfo(wallet.address, network);
    res.json({ ok: true, wallet: info });
  } catch (e) {
    res.status(400).json({ ok: false, error: e.message });
  }
});

app.post('/api/wallet/balance', async (req, res) => {
  try {
    const { address, network = 'testnet' } = req.body;
    const info = await getAccountInfo(address, network);
    res.json({ ok: true, wallet: info });
  } catch (e) {
    res.status(400).json({ ok: false, error: e.message });
  }
});

app.post('/api/wallet/send', async (req, res) => {
  try {
    const { seed, destination, amount, network = 'testnet' } = req.body;
    const result = await sendXrp(seed, destination, parseFloat(amount), network);
    res.json({ ok: result.success, ...result });
  } catch (e) {
    res.status(400).json({ ok: false, error: e.message });
  }
});

app.post('/api/wallet/generate', async (req, res) => {
  try {
    const { network = 'testnet' } = req.body;
    const wallet = generateWallet(network);
    res.json({ ok: true, wallet });
  } catch (e) {
    res.status(400).json({ ok: false, error: e.message });
  }
});

// Virtual chat endpoints
app.get('/api/chat/messages', (req, res) => {
  res.json({ ok: true, messages: getChatMessages() });
});

app.post('/api/chat/post', async (req, res) => {
  try {
    const { seed, text, network = 'testnet', paid = false } = req.body;
    if (!text || !text.trim()) throw new Error('Mesajul nu poate fi gol.');
    let entry;
    if (paid && seed) {
      entry = await postPaidMessage(seed, text.trim(), network);
    } else {
      const wallet = seed ? walletFromSeed(seed) : null;
      entry = addLocalMessage(wallet ? wallet.address : 'anonim', text.trim());
    }
    res.json({ ok: true, message: entry });
  } catch (e) {
    res.status(400).json({ ok: false, error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`Dani Gorbaciov - XRP Live running at http://localhost:${PORT}`);
});
