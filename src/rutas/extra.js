const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../lib/auth');


router.get('/agregar_software', isLoggedIn,  (req, res) => {
    
    res.render('extras/agregar_software')
});

router.post('/agregar_software', isLoggedIn, async(req, res) => {
    const { conexion } = require('../lib/passport');
    const{ software, tipolicencia, licencia } = req.body;
    await conexion.query('INSERT INTO SOFTWARE set $1, $2, $3', [software, tipolicencia, licencia]);
    req.flash('mensaje', 'Software agregado con exito');
    res.redirect('/extra/listar_software');
});

router.get('/listar_software', isLoggedIn, async (req, res) => {
    const { conexion } = require('../lib/passport');
    const consulta = await conexion.query('SELECT * FROM SOFTWARE');
    const soft = consulta.rows;
    res.render('extras/listar_software', {soft});
});

//Eliminar registros
router.get('/listar_software/eliminar/:id', isLoggedIn,  async (req, res) => {
    const { conexion } = require('../lib/passport');
    const {id} = req.params;
    await conexion.query('DELETE FROM SOFTWARE WHERE ID_SOFTWARE = $1', [id]);
    req.flash('mensaje', 'Software eliminado con exito');
    const consulta = await conexion.query('SELECT * FROM SOFTWARE');
    const soft = consulta.rows;
    res.render('extras/listar_software', {soft});
});

//Editar registros 
router.get('/listar_software/editar/:id', isLoggedIn,  async(req, res) => {
    const {id} = req.params;
    const { conexion } = require('../lib/passport');
    const consulta = await conexion.query('SELECT * FROM SOFTWARE WHERE ID_SOFTWARE = $1', [id]);
    const equipo = consulta.rows;
    res.render('extras/editar_software', {equipo: equipo[0]});
});

router.post('/listar_software/editar/:id', isLoggedIn,  async(req, res) => {
    const {id} = req.params;
    const { conexion } = require('../lib/passport');
    const{ software, tipolicencia, licencia } = req.body;
    await  conexion.query('UPDATE SOFTWARE SET ($1, $2, $3) WHERE ID_SOFTWARE = $4', [software, tipolicencia, licencia, id]);
    req.flash('mensaje', 'Software editado con exito');
    const consulta = await conexion.query('SELECT * FROM SOFTWARE');
    const soft = consulta.rows;
    res.render('extras/listar_software', {soft});
});


router.get('/agregar_grupo', isLoggedIn,  async(req, res) => {
    const { conexion } = require('../lib/passport');
    const consulta = await conexion.query('SELECT * FROM MATERIA');
    const mat = consulta.rows;
    res.render('extras/agregar_grupo', {mat} )
});

router.post('/agregar_grupo', isLoggedIn, async(req, res) => {
    const { conexion } = require('../lib/passport');
    const{ grupo, clave, notarjeta, horario } = req.body;
    await conexion.query('INSERT INTO GRUPO values ($1, $2, $3, $4)', [grupo, clave, notarjeta, horario]);
    req.flash('mensaje', 'Grupo agregado con exito');
    res.redirect('/extra/listar_grupo');
});

router.get('/grupos', isLoggedIn, async (req, res) => {
    const { conexion } = require('../lib/passport');
    const consulta1 = await conexion.query('SELECT * FROM CARRERA');
    const consulta2 = await conexion.query('SELECT GRUPO, CMATERIA, NOMBRE, APELLIDOP, APELLIDOM, N, HORARIO, NOALUMNOS FROM GRUPO INNER JOIN (SELECT CLAVE AS CMATERIA, NOMBRE, N, APELLIDOP, APELLIDOM FROM MATERIA INNER JOIN (SELECT NOTARJETA, NOMBRE AS N, APELLIDOP, APELLIDOM FROM PERSONAL) AS CON1) AS CON2');
    const carreras = consulta1.rows;
    const grupos = consulta2.rows;
    res.render('extras/listar_grupos', {carreras, grupos});
});

module.exports = router;