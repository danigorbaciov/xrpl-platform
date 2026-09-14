import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', network: 'XRPL Testnet', features: ['dashboard', 'loyalty', 'messenger'] });
});

app.listen(PORT, () => {
  console.log(`XRPL Platform dashboard running at http://localhost:${PORT}`);
});