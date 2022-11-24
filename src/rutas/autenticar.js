const express = require('express');
const router = express.Router();


const pool = require('../database');
const passport = require('passport');

router.get('/signup', (req, res) => {
    res.render('usuarios/nvousuario');
});

router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/usuarios', //a donde se redirecciona una vez se registra el usuario de forma correcta|
    failureRedirect: '/signup',
    failureFlash: true
}));


router.get('/login', (req, res) => {
    res.render('../vistas/autenticar/login');
});

router.post('/login', async(req, res, next) => {
    passport.authenticate('local.login', {
        successRedirect: '/links/inventarios',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});

router.get('/usuarios', async (req, res) => {
 
    const docentes = await pool.query('SELECT NOTARJETA, NOMBRE_PR, APPAT_PR, APMAT_PR, DEPARTAMENTO, USER FROM DOCENTES INNER JOIN DEPARTAMENTO ON DEPARTAMENTO.IDDEPTO = DOCENTES.IDDEPTO');
    const personal = await pool.query('SELECT NOTARJETAP, NOMBRE_PER, APPAT_PER, APMAT_PER, PUESTO, TURNO, USER FROM PERSONAL;');
    
    
    res.render('usuarios/listar_usuarios',{ docentes, personal });
});

function formatoFecha(fecha, formato) {
    const map = {
        dd: fecha.getDate(),
        mm: fecha.getMonth() + 1,
        yy: fecha.getFullYear().toString().slice(-2),
        yyyy: fecha.getFullYear()
    }

    return formato.replace(/dd|mm|yy|yyy/gi, matched => map[matched])
}


module.exports = router;