const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const sesion = require('express-session');
const passport = require('passport');

//inicialization
const app = express();
require('./lib/passport');

//configuración
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'vistas'));
app.engine('.hbs', exphbs.engine({
    defaultlayout: 'main',
    layoutsDir: path.join(app.get('views'), 'plantillas'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}))
app.set('view engine', '.hbs');

//Midelwares
app.use(sesion({
    secret: 'sesion',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false }));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());


//variables globales
app.use((req, res, next) => {
    app.locals.mensaje = req.flash('mensaje');
    app.locals.exito = req.flash('exito');
    app.locals.danger = req.flash('danger');
    app.locals.user = req.user;
    next();
});

//rutas
app.use(require('./rutas'));
app.use(require('./rutas/autenticar'));
app.use('/inventarios', require('./rutas/links'));
app.use('/practicas', require('./rutas/practicas'));

//public
app.use(express.static(path.join(__dirname, 'public')));

//inicialization del servidor
app.listen(app.get('port'),() => {
    console.log('Server listening on port',app.get('port'));
});