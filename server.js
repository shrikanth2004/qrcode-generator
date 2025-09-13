const express = require('express');
const qr = require('qr-image');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.post('/generate', (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ error: 'Text is required' });
    }

    try {
        const qrSvg = qr.imageSync(text, { type: 'svg' });
        res.setHeader('Content-Type', 'image/svg+xml');
        res.send(qrSvg);
    } catch (err) {
        console.error('Failed to generate QR code', err);
        res.status(500).json({ error: 'Failed to generate QR code' });
    }
});

module.exports = app;

