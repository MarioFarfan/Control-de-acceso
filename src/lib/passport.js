const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
//const {ConexionDB} = require('../conexionDB');
//const pool = require('../database');

const helpers = require('../lib/helper');
const { dir } = require('console');
const Swal = require('sweetalert2');

passport.use('local.login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const { ConexionDB } = require('../ConexionDB.js');
    const conexion = new ConexionDB(username, password);
    conexion.checkConnection()
    .then(async isConnected => {
      if (isConnected) {
        const consulta = await conexion.query('SELECT session_user;');
        const rol = consulta.rows[0].session_user;
        console.dir('ROL: ' + rol);
        const user = {user: username, password};
        req.session.user = user;
        module.exports = { conexion };
        console.log('Conexión exitosa');
        done(null, user);
        console.log('Usuario: ' + req.session.user.user);
        console.dir(req.session.user);
      } else {
        console.log('Error en la conexión');
        done(null, null, req.flash('danger', 'Credenciales incorrectas '));
      }
    });
    
}));

/*
passport.use('local.signup', new LocalStrategy({
    usernameField: 'user',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, user, password, done) => {
    const hoy = formatoFecha(new Date(Date.now()), 'yyyy/mm/dd');
    const{ nombrepersona, ap_p, ap_m, tipopersona, departamento, turno, puesto } = req.body;
    const newUser = {
        user,
        password,
        rol:  tipopersona,
    }
    newUser.password = await helpers.cifrar(password);
    if(tipopersona == 'Docente'){
        
        const newDocente = {
            notarjeta: newUser.user, 
            nombre_pr: nombrepersona, 
            appat_pr: ap_p, 
            apmat_pr: ap_m, 
            iddepto: departamento, 
            user
        };
        await pool.query('INSERT INTO USUARIO set ?', [newUser]);
        await pool.query('INSERT INTO DOCENTES set ?', [newDocente]);
    }
    if(tipopersona == 'Auxiliar'){
        
        const newPersonal = {
            notarjetap: newUser.user, 
            nombre_per: nombrepersona, 
            appat_per: ap_p, 
            apmat_per: ap_m, 
            puesto,
            turno,
            user
        };
        const  existe = await pool.query('Select * from usuario where user = ?', [newUser.user]);
        await pool.query('INSERT INTO USUARIO set ?', [newUser]);
        await pool.query('INSERT INTO PERSONAL set ?', [newPersonal]);
    }

    
    //const estado = await pool.query('INSERT INTO usuario set ? ', [newUser]);
    return done(null, newUser);
}));
*/
passport.serializeUser((user, done) =>{
    done(null, user.user);
});

passport.deserializeUser ( async (user, done) =>{
    //const filas = await pool.query('SELECT * FROM USUARIO WHERE user = ?', [user]);
    done (null, user); 
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