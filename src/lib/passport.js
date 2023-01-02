const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const ConexionDB = require('../conexionDB').ConexionDB;
const { promisify } = require('util');
//const pool = require('../database');

let conexion;

const helpers = require('../lib/helper');

passport.use('local.login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    console.log('datos: ' + username + ':' + password);
    const user = {user: username, password};
    conexion = conectar(username, password);
    console.dir(conexion);
    done(null, user, req.flash('mensaje', 'Hola ' + user.user));
    
    //if (filas.length > 0) {
    //    const user = filas[0];
    //    const contravalida = await helpers.comparar(password, user.password); 
    //    if (contravalida){
    //        done(null, user, req.flash('mensaje', 'Hola ' + user.user));
    //    } else {
    //        done(null, false, req.flash('danger', 'Contraseña incorrecta'));
    //    }
    //} else {
    //    return done(null, false, req.flash('danger', 'Usuario no existente'));
    //}
    
}));


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

passport.serializeUser((user, done) =>{
    console.log('serializing user');
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

function conectar(username, password) {
    conexion = new ConexionDB(username, password);
    conexion.conectar();
    //console.dir(conexion);
    module.exports = { conexion };
    return conexion;
}

function desconectar(){
    conexion.cerrarConexion();
}

function query(consulta) {
    return promisify(conexion.connection.query).bind(conexion.connection)(consulta);
  }

module.exports = {query, conexion};