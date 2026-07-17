const express = require('express');


const { handleGenerateShortUrl, handleGetAnalytics } = require('../controllers/url');

const router = express.Router();

router.post('/', handleGenerateShortUrl);

router.get('/analytics/:shortId', handleGetAnalytics); 

router.get('/analytics', handleGetAnalytics);

module.exports = router;





