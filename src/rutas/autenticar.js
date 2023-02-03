const express = require('express');
const router = express.Router();
const passport = require('passport');
const {isLoggedIn, isNotLoggedIn} = require('../lib/auth')

router.get('/signup',isLoggedIn, async (req, res) => {
    const { conexion } = require('../lib/passport');
    const departamentos = await conexion.query('select * from laboratorio.departamento');
    res.render('usuarios/nvousuario', {departamentos});
});

router.post('/signup', isLoggedIn, passport.authenticate('local.signup', {
    successRedirect: '/usuarios', //a donde se redirecciona una vez se registra el usuario de forma correcta|
    failureRedirect: '/signup',
    failureFlash: true
}));


router.get('/login', isNotLoggedIn, (req, res) => {
    res.render('../vistas/autenticar/login');
});

router.post('/login', isNotLoggedIn, async(req, res, next) => {
    passport.authenticate('local.login', {
        successRedirect: '/home',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});

router.get('/usuarios', isLoggedIn, async (req, res) => {
    const { conexion } = require('../lib/passport');
    const docentes = await conexion.query('SELECT NOTARJETA, NOMBRE_PR, APPAT_PR, APMAT_PR, DEPARTAMENTO, USER FROM LABORATORIO.DOCENTES INNER JOIN LABORATORIO.DEPARTAMENTO ON DEPARTAMENTO.IDDEPTO = DOCENTES.IDDEPTO');
    const personal = await conexion.query('SELECT NOTARJETAP, NOMBRE_PER, APPAT_PER, APMAT_PER, PUESTO, TURNO, USER FROM LABORATORIO.PERSONAL;');
    res.render('usuarios/listar_usuarios',{ docentes, personal });
});

//ELIMINAR USUARIOS
router.get('/usuarios/eliminar/:id', isLoggedIn, async (req, res) => {
    const { conexion } = require('../lib/passport');
    const {id} = req.params;
    await conexion.query('DELETE FROM LABORATORIO.USUARIO WHERE USER = ?', [id]);
    res.redirect('/usuarios');
});

//EDITAR USUARIOS
router.get('/usuarios/editar/:id', isLoggedIn, async (req, res) => {
    const {id} = req.params;
    res.render('/usuarios/editar_usuario', {id});
});

router.post('/usuarios/editar/:id', isLoggedIn, async(req, res, next) => {
    const { conexion } = require('../lib/passport');
    const {id} = req.params;
    const usuario = await conexion.query('SELECT * FROM LABORATORIO.USUARIO WHERE USER = ?', [id]);
    const esdocente = await conexion.query('SELECT * FROM LABORATORIO.docentes WHERE user = ?', [id]);
    const espersonal = await conexion.query('SELECT * FROM LABORATORIO.personal WHERE user = ?', [id]);
    if ( espersonal.length > 0 ) {
        res.render('/usuarios/editar', {espersonal: usuario[0]});
    } else if ( esdocente.length > 0 ) {
        res.render('/usuarios/editar', {esdocente: usuario[0]});
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

router.get('/home', isLoggedIn, (req, res) => {
    res.render('home');
});

router.get('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/login');
    });
})

router.get('/menuinventarios', isLoggedIn, (req, res) => {
    res.render('menuinventarios');
});

router.get('/menugrupos', isLoggedIn, (req, res) => {
    res.render('menugrupos');
});

router.get('/menuusuarios', isLoggedIn, (req, res) => {
    res.render('menuusuarios');
});

router.get('/menupracticas', isLoggedIn, (req, res) => {
    res.render('menupracticas');
});

router.get('/menugeneral', isLoggedIn, (req, res) => {
    res.render('menugeneral');
});

router.get('/menureportes', isLoggedIn, (req, res) => {
    res.render('menureportes');
});

module.exports = router;