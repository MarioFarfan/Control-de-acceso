const express = require('express');
const router = express.Router();

const pool = require('../database');

router.get('/inventarios/agregar_dispositivo', (req, res) => {
    res.render('inventarios/agregar')
});

router.post('/inventarios', (req, res) => {
    console.log(req.body);
    res.send('recived')
});
module.exports = router;