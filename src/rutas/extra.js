const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../lib/auth');


router.get('/agregar_software', isLoggedIn,  (req, res) => {
    
    res.render('extras/agregar_software')
});

router.post('/agregar_software', isLoggedIn, async(req, res) => {
    const { conexion } = require('../lib/passport');
    const{ software, tipolicencia, licencia } = req.body;
    await conexion.query('INSERT INTO laboratorio.SOFTWARE (software, tipolicencia, licencia) values ($1, $2, $3)', [software, tipolicencia, licencia]);
    req.flash('mensaje', 'Software agregado con exito');
    res.redirect('/extra/listar_software');
});

router.get('/listar_software', isLoggedIn, async (req, res) => {
    const { conexion } = require('../lib/passport');
    const consulta = await conexion.query('SELECT * FROM LABORATORIO.SOFTWARE');
    const soft = consulta.rows;
    res.render('extras/listar_software', {soft});
});

//Eliminar registros
router.get('/listar_software/eliminar/:id', isLoggedIn,  async (req, res) => {
    const { conexion } = require('../lib/passport');
    const {id} = req.params;
    await conexion.query('DELETE FROM LABORATORIO.SOFTWARE WHERE ID_SOFTWARE = $1', [id]);
    req.flash('mensaje', 'Software eliminado con exito');
    const consulta = await conexion.query('SELECT * FROM LABORATORIO.SOFTWARE');
    const soft = consulta.rows;
    res.render('extras/listar_software', {soft});
});

//Editar registros 
router.get('/listar_software/editar/:id', isLoggedIn,  async(req, res) => {
    const {id} = req.params;
    const { conexion } = require('../lib/passport');
    const consulta = await conexion.query('SELECT * FROM LABORATORIO.SOFTWARE WHERE ID_SOFTWARE = $1', [id]);
    const equipo = consulta.rows;
    res.render('extras/editar_software', {equipo: equipo[0]});
});

router.post('/listar_software/editar/:id', isLoggedIn,  async(req, res) => {
    const {id} = req.params;
    const { conexion } = require('../lib/passport');
    const{ software, tipolicencia, licencia } = req.body;
    await  conexion.query('UPDATE SOFTWARE SET ($1, $2, $3) WHERE ID_SOFTWARE = $4', [software, tipolicencia, licencia, id]);
    req.flash('mensaje', 'Software editado con exito');
    const consulta = await conexion.query('SELECT * FROM LABORATORIO.SOFTWARE');
    const soft = consulta.rows;
    res.render('extras/listar_software', {soft});
});


router.get('/agregar_grupo', isLoggedIn,  async(req, res) => {
    const { conexion } = require('../lib/passport');
    const consulta = await conexion.query('SELECT * FROM LABORATORIO.MATERIA');
    const consulta2 = await conexion.query('SELECT * FROM LABORATORIO.PERSONAL');
    const mat = consulta.rows;
    const personal = consulta2.rows;
    res.render('extras/agregar_grupo', {mat, personal} )
});

router.post('/agregar_grupo', isLoggedIn, async(req, res) => {
    const { conexion } = require('../lib/passport');
    const{ grupo, clave, notarjeta, horario, noalumnos } = req.body;
    console.log(clave);
    await conexion.query('INSERT INTO laboratorio.GRUPO (grupo, clave, notarjeta, horario, noalumnos) values ($1, $2, $3, $4, $5)', [grupo, clave, notarjeta, horario, noalumnos]);
    req.flash('mensaje', 'Grupo agregado con exito');
    res.redirect('/extra/grupos');
});

router.get('/grupos', isLoggedIn, async (req, res) => {
    const { conexion } = require('../lib/passport');
    const consulta1 = await conexion.query('SELECT * FROM LABORATORIO.CARRERA');
    const consulta2 = await conexion.query(`select grupo.idgrupo, grupo.grupo, grupo.clave, materia.nombre as materia,
    personal.apellidop, personal.apellidom, personal.nombre,
    grupo.horario, grupo.noalumnos
    from laboratorio.grupo inner join laboratorio.materia on grupo.clave = materia.clave
    inner join laboratorio.personal on grupo.notarjeta = personal.notarjeta`);
    const carreras = consulta1.rows;
    const grupos = consulta2.rows;
    res.render('extras/listar_grupos', {carreras, grupos});
});

router.get('/nuevosemestre', isLoggedIn,  async(req, res) => {
    const { conexion } = require('../lib/passport');
    res.render('extras/nuevosemestre')
});


router.post('/nuevosemestre', isLoggedIn, async(req, res) => {
    const { conexion } = require('../lib/passport');
    const{ semestre, inicio, final } = req.body;
    await conexion.query('INSERT INTO laboratorio.SEMESTRE(PERIODO,FECHAINICIO,FECHAFINAL) values ($1, $2, $3)', [semestre, inicio, final]);
    req.flash('mensaje', 'Semestre agregado con exito');
    res.redirect('/extra/semestres');
});

router.get('/semestres', isLoggedIn, async (req, res) => {
    const { conexion } = require('../lib/passport');
    const consulta1 = await conexion.query('SELECT * FROM LABORATORIO.SEMESTRE');
    const sem = consulta1.rows;
    res.render('extras/semestres', {sem});
});

router.get('/horariolab', isLoggedIn, async (req, res) => {
    const { conexion } = require('../lib/passport');
    //const consulta1 = await conexion.query('SELECT * FROM LABORATORIO.SEMESTRE');
    //const sem = consulta1.rows;
    res.render('extras/horariolab');
});

module.exports = router;