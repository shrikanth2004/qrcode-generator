const express = require('express');
const qr = require('qr-image');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('QR Code Generator Backend is running.');
});

app.post('/generate', (req, res) => {
    const { text } = req.body;

    if (!text) return res.status(400).send('Text is required');

    const qrSvg = qr.imageSync(text, { type: 'svg' });
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(qrSvg);
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:5000`);
});
