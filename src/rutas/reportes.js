const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../lib/auth');

router.get('/reportesinventarios', (req, res) => {
    res.render("reportes/reportesinventarios");
});

router.get('/ajustesequipos', isLoggedIn, async(req, res) => {
    const { conexion } = require('../lib/passport');
    const queryareas = await conexion.query("select * from laboratorio.area");
    const areas = queryareas.rows;
    res.render("reportes/ajustesequipos",{areas});
});

router.get('/ajustesinsumos', isLoggedIn, async(req, res) => {
    const { conexion } = require('../lib/passport');
    res.render("reportes/ajustesinsumos");
});

router.get('/ajustesinsumos', isLoggedIn, async(req, res) => {
    const { conexion } = require('../lib/passport');
    var{tipo} = req.body;
    await conexion.query('SELECT * FROM LABORATORIO.INSUMOS WHERE TIPO =($1)', [tipo]);
    req.flash('mensaje', 'PC agregada con exito');
    res.redirect('reportes/ajustesinsumos');
});

router.get('/ajustesextras', isLoggedIn, async(req, res) => {
    const { conexion } = require('../lib/passport');
    res.render("reportes/ajustesextras");
});

//---------------------------------REPORTES USUARIOS-------------------------------------------------
router.get('/reportesusuarios', (req, res) => {
    res.render("reportes/reportesusuarios");
});

router.get('/ajustesestudiantes', isLoggedIn, async(req, res) => {
    const { conexion } = require('../lib/passport');
    const querycarreras = await conexion.query("SELECT * FROM laboratorio.laboratorio.carrera");
    const carr = querycarreras.rows;
    res.render("reportes/ajustesestudiantes", {carr});
});

router.get('/ajustesdocentes', isLoggedIn, async(req, res) => {
    const { conexion } = require('../lib/passport');
    const querydep = await conexion.query("SELECT * FROM laboratorio.laboratorio.departamento");
    const dep = querydep.rows;
    res.render("reportes/ajustesdocentes", {dep});
});

module.exports = router;