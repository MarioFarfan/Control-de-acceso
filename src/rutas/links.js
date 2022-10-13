const express = require('express');
const router = express.Router();

const pool = require('../database');

router.get('/login', (req, res) => {
    res.render('inventarios/login')
});
router.post('/login', (req, res) => {
    console.log(req.body);
    res.send('Logeando');
});

router.get('/inventarios/agregar_dispositivo', (req, res) => {
    res.render('inventarios/agregar')
});

router.post('/inventarios/agregar_dispositivo', async(req, res) => {
    const{ folioinv, noserie, marca, tipo, foliocpu, idarea } = req.body;
    const newDispositivo = {
        folioinv, 
        noserie, 
        marca, 
        tipo, 
        foliocpu, 
        idarea
    };
    await pool.query('INSERT INTO EQUIPO set ?', [newDispositivo]);
    console.log(newDispositivo);
    res.send('recived')
});
module.exports = router;