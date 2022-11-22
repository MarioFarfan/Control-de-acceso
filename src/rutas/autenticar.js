const express = require('express');
const router = express.Router();


const pool = require('../database');
const passport = require('passport');

router.get('/signup', (req, res) => {
    res.render('usuarios/nvousuario');
});

router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/links/inventarios', //a donde se redirecciona una vez se registra el usuario de forma correcta|
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
 
    const docentes = await pool.query('SELECT NOTARJETA, NOMBRE_PR, APPAT_PR, APMAT_PR, DEPARTAMENTO, USUARIO.USER FROM DOCENTES INNER JOIN DEPARTAMENTO INNER JOIN USUARIO GROUP BY NOTARJETA');
    const personal = await pool.query('SELECT NOTARJETAP, NOMBRE_PER, APPAT_PER, APMAT_PER, PUESTO, TURNO, USUARIO.USER FROM PERSONAL INNER JOIN USUARIO GROUP BY NOTARJETAP;');
    
    
    res.render('usuarios/listar_usuarios',{ docentes, personal });
});

router.get('/usuarios/agregar_usuario', async(req, res) => {
    const departamentos = await pool.query('SELECT IDDEPTO, DEPARTAMENTO FROM DEPARTAMENTO');
    res.render('usuarios/nvousuario',{departamentos});
});

router.post('/usuarios/agregar_usuario', async(req, res) => {
    const { nocontrol, nombrepersona, ap_p, ap_m, carrera, semestre } = req.body;
    const hoy = formatoFecha(new Date(Date.now()), 'yyyy/mm/dd');
    const newpersona = {
        NOMBRE: nombrepersona,
        AP_PA: ap_p,
        AP_MA: ap_m,
        ESTADO: 'ALTA',
        FECHA_ALTA: hoy
    }
    const result = await pool.query('INSERT INTO PERSONA set ?', [newpersona]);
    const idpersona = result.insertId;
    const newAlumno = {
        idpersona, 
        nocontrol, 
        iddepto, 
        idcarrera, 
        semestre
    }
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