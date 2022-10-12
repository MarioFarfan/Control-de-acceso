const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');

//inicialization
const app = express();

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
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false }));
app.use(express.json());

//variables globales
app.use((req, res, next) => {

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