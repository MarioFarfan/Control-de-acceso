const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('../lib/helper');

passport.use('local.login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const filas = await pool.query('SELECT * FROM USUARIO WHERE USUARIO = ?', [username]);
    if (filas.length > 0) {
        const user = filas[0];
        //const contravalida = await helpers.comparar(password, user.password); usar en caso de encriptar contraaaseñas al momento dde guardarlas
        const contravalida = (user.CONTRASENIA == password);
        if (contravalida){
            done(null, user, req.flash('mensaje', 'Hola ' + user.USUARIO));
        } else {
            done(null, false, req.flash('danger', 'Contraseña incorrecta'));
        }
    } else {
        return done(null, false, req.flash('danger', 'El nombre ded usuario no existe'));
    }
}));


passport.use('local.signup', new LocalStrategy({
    usernameField: 'numcontrol',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, numcontrol, password, done) => {
    const hoy = formatoFecha(new Date(Date.now()), 'yyyy/mm/dd');
    const { nombrepersona, ap_p, ap_m, tipopersona } = req.body;
    const newpersona = {
        NOMBRE: nombrepersona,
        AP_PA: ap_p,
        AP_MA: ap_m,
        ESTADO: 'ALTA',
        FECHA_ALTA: hoy
    }
    const result = await pool.query('INSERT INTO PERSONA set ?', [newpersona]);
    const idpersona = result.insertId;
    const newUser = {
        usuario: numcontrol,
        contrasenia: password,
        rol: tipopersona,
        idpersona
    }
    //newUser.contrasenia = await helpers.cifrar(password);
    const estado = await pool.query('INSERT INTO usuario set ? ', [newUser]);
    newUser.idusuario = estado.insertId;
    return done(null, newUser);
}));

passport.serializeUser((user, done) =>{
    done(null, user.IDUSUARIO);
});

passport.deserializeUser ( async (id, done) =>{
    const filas = await pool.query('SELECT * FROM USUARIO WHERE IDUSUARIO = ?', [id]);
    console.log(filas);
    done (null, filas[0]); 
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