const express = require('express');
const router = express.Router();


const pool = require('../database');
const passport = require('passport');
const {isLoggedIn} = require('../lib/auth')

router.get('/signup', isLoggedIn, async (req, res) => {
    const departamentos = await pool.query('select * from departamento');
    res.render('usuarios/nvousuario', {departamentos});
});

router.post('/signup', isLoggedIn, passport.authenticate('local.signup', {
    successRedirect: '/usuarios', //a donde se redirecciona una vez se registra el usuario de forma correcta|
    failureRedirect: '/signup',
    failureFlash: true
}));


router.get('/login', (req, res) => {
    res.render('../vistas/autenticar/login');
});

router.post('/login', async(req, res, next) => {
    passport.authenticate('local.login', {
        successRedirect: '/home',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});

router.get('/usuarios', isLoggedIn, async (req, res) => {
    const docentes = await pool.query('SELECT NOTARJETA, NOMBRE_PR, APPAT_PR, APMAT_PR, DEPARTAMENTO, USER FROM DOCENTES INNER JOIN DEPARTAMENTO ON DEPARTAMENTO.IDDEPTO = DOCENTES.IDDEPTO');
    const personal = await pool.query('SELECT NOTARJETAP, NOMBRE_PER, APPAT_PER, APMAT_PER, PUESTO, TURNO, USER FROM PERSONAL;');
    res.render('usuarios/listar_usuarios',{ docentes, personal });
});

//ELIMINAR USUARIOS
router.get('/usuarios/eliminar/:id', isLoggedIn, async (req, res) => {
    const {id} = req.params;
    await pool.query('DELETE FROM USUARIO WHERE USER = ?', [id]);
    res.redirect('/usuarios');
});

//EDITAR USUARIOS
router.get('/usuarios/editar/:id', isLoggedIn, async (req, res) => {
    const {id} = req.params;
    res.render('/usuarios/editar_usuario', {id});
});

router.post('/usuarios/editar/:id', isLoggedIn, async(req, res, next) => {
    const {id} = req.params;
    const usuario = await pool.query('SELECT * FROM USUARIO WHERE USER = ?', [id]);
    const esdocente = await pool.query('SELECT * FROM docentes WHERE user = ?', [id]);
    const espersonal = await pool.query('SELECT * FROM personal WHERE user = ?', [id]);
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


module.exports = router;