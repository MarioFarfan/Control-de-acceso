const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../lib/auth');
//const pdf = require('html-pdf');

router.get('/reportesinventarios', (req, res) => {
    res.render("reportes/reportesinventarios");
});

router.get('/ajustesequipos', isLoggedIn, async(req, res) => {
    const { conexion } = require('../lib/passport');
    const queryareas = await conexion.query("select * from laboratorio.area");
    const areas = queryareas.rows;
    res.render("reportes/ajustesequipos",{areas});
});



module.exports = router;