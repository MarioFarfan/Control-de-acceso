const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const sesion = require('express-session');
const MySQLStore = require('express-mysql-session');
const passport = require('passport');

const {database} = require('./llave');

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
    secret: 'sesionsql',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
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
    next();
});

//rutas
app.use(require('./rutas'));
app.use(require('./rutas/autenticar'));
app.use('/links', require('./rutas/links'));

//public
app.use(express.static(path.join(__dirname, 'public')));

//inicialization del servidor
app.listen(app.get('port'),() => {
    console.log('Server listening on port',app.get('port'));
});