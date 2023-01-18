const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../lib/auth');


router.get('/agregar_software', isLoggedIn,  (req, res) => {
    res.render('extras/agregar_software')
});

router.post('/agregar_software', isLoggedIn, async(req, res) => {
    const { conexion } = require('../lib/passport');
    const{ software, tipolicencia, licencia } = req.body;
    const newInsert = { software, tipolicencia, licencia};  //validar los datos
    await conexion.query('INSERT INTO SOFTWARE set ?', [newInsert]);
    req.flash('mensaje', 'Software agregado con exito');
    res.redirect('/extra/listar_software');
});

router.get('/listar_software', isLoggedIn, async (req, res) => {
    const { conexion } = require('../lib/passport');
    const soft = await conexion.query('SELECT * FROM SOFTWARE');
    res.render('extras/listar_software', {soft});
});

module.exports = router;