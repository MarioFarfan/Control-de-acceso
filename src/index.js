const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');

//inicialization
const app = express();

//ocnfiguración
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'vistas'));
app.engine('.hbs', exphbs.engine({
    defaultlayout: 'main',
    layoutsDir: path.join(app.get('views'), 'plantillas'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}))

app.set('view engine', 'hbs');
//Midelwares
app.use(morgan('dev'));

//variables globales


//rutas
app.use(require('./back/index.js'))

//public


//inicialization del servidor
app.listen(app.get('port'),() => {
    console.log('Servidor listening on port',app.get('port'));
});