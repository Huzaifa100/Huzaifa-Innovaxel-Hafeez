const db = require('../models/db');
const generateShortCode = require('../utils/generateShortCode');

exports.createShortURL = async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  const shortCode = generateShortCode();
  try {
    const [result] = await db.execute(
      'INSERT INTO urls (url, shortCode) VALUES (?, ?)',
      [url, shortCode]
    );

    const [row] = await db.execute('SELECT * FROM urls WHERE id = ?', [result.insertId]);
    res.status(201).json(row[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
};

exports.getOriginalURL = async (req, res) => {
  const { code } = req.params;
  const [rows] = await db.execute('SELECT * FROM urls WHERE shortCode = ?', [code]);
  if (!rows.length) return res.status(404).json({ error: 'Short URL not found' });

  await db.execute('UPDATE urls SET accessCount = accessCount + 1 WHERE shortCode = ?', [code]);
  res.json(rows[0]);
};

exports.updateURL = async (req, res) => {
  const { code } = req.params;
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'New URL is required' });

  const [rows] = await db.execute('SELECT * FROM urls WHERE shortCode = ?', [code]);
  if (!rows.length) return res.status(404).json({ error: 'Short URL not found' });

  await db.execute('UPDATE urls SET url = ? WHERE shortCode = ?', [url, code]);

  const [updated] = await db.execute('SELECT * FROM urls WHERE shortCode = ?', [code]);
  res.json(updated[0]);
};

exports.deleteURL = async (req, res) => {
  const { code } = req.params;
  const [result] = await db.execute('DELETE FROM urls WHERE shortCode = ?', [code]);
  if (result.affectedRows === 0) return res.status(404).json({ error: 'Short URL not found' });
  res.sendStatus(204);
};

exports.getStats = async (req, res) => {
  const { code } = req.params;
  const [rows] = await db.execute('SELECT * FROM urls WHERE shortCode = ?', [code]);
  if (!rows.length) return res.status(404).json({ error: 'Short URL not found' });
  res.json(rows[0]);
};