const express = require('express');
const router = express.Router();

router.get('/status', function (req, res) {
    res.locals.message = 'Server Status';
    res.locals.status = 'Running';
    res.status(200);
    res.render('status');
});

router.head('/status', (req, res) => {
    res.status(200).end();
});

router.get('/logLevel', (req, res) => {
    res.status(200).send(process.env.LOG_LEVEL);
});

module.exports = router;
