const express = require('express');
const router = express.Router();
const controller = require('../controllers/urlController');

router.post('/shorten', controller.createShortURL);
router.get('/shorten/:code', controller.getOriginalURL);
router.put('/shorten/:code', controller.updateURL);
router.delete('/shorten/:code', controller.deleteURL);
router.get('/shorten/:code/stats', controller.getStats);

module.exports = router;