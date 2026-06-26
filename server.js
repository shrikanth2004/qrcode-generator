require('dotenv').config();
const express = require('express');
const qr = require('qr-image');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const { put } = require('@vercel/blob');

// Use memory storage so the file is not written to Vercel's read-only disk
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.post('/upload', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image uploaded' });
    }
    
    try {
        // Upload the file to Vercel Blob
        const blob = await put(req.file.originalname, req.file.buffer, {
            access: 'public',
            token: process.env.BLOB_READ_WRITE_TOKEN
        });

        // Vercel Blob returns the public URL
        res.json({ url: blob.url });
    } catch (error) {
        console.error('Error uploading to Vercel Blob:', error);
        res.status(500).json({ error: 'Failed to upload image' });
    }
});

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
