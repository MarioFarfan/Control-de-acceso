const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../lib/auth');


router.get('/agregar_software', isLoggedIn,  (req, res) => {
    res.render('extras/agregar_software')
});

router.post('/agregar_software', isLoggedIn, async(req, res) => {
    const { conexion } = require('../lib/passport');
    const{ software, tipolicencia, licencia } = req.body;
    const consulta = await conexion.query('select * from laboratorio.software where software = $1', [software])
    const resultado = consulta.rows;
    if (consulta.rows > 0) {
        req.flash('danger', 'Error. Ya existe un software registrado con el mismo nombre');
        req.redirect('/extra/agregar_software')
    } else {
        try{
            await conexion.query('INSERT INTO laboratorio.SOFTWARE (software, tipolicencia, licencia) values ($1, $2, $3)', [software, tipolicencia, licencia]);
            req.flash('exito', 'Software agregado con exito');
        } catch (error){
            req.flash('danger', 'Error al eliminar registro:' + error );
        }
    }
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
    try{
        await conexion.query('DELETE FROM LABORATORIO.SOFTWARE WHERE ID_SOFTWARE = $1', [id]);
        req.flash('exito', 'Software eliminado con exito');
    } catch (error){
        req.flash('danger', 'Error al eliminar registros');
    }
    res.redirect('/extra/listar_software');
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
    try{
        await  conexion.query('UPDATE laboratorio.SOFTWARE SET software = $1, tipolicencia = $2, licencia = $3 WHERE ID_SOFTWARE = $4', [software, tipolicencia, licencia, id]);
        req.flash('exito', 'Software editado con exito');
    } catch (error) {
        req.flash('danger', 'Error al actualizar registro: ' + error.message)
    }
    res.redirect('/extra/listar_software');
});


router.get('/agregar_grupo', isLoggedIn,  async(req, res) => {
    const { conexion } = require('../lib/passport');
    const consulta = await conexion.query('SELECT * FROM LABORATORIO.MATERIA');
    const consulta2 = await conexion.query('SELECT * FROM LABORATORIO.PERSONAL');
    const mat = consulta.rows;
    const personal = consulta2.rows;
    res.render('extras/agregar_grupo', {mat, personal} );
});

router.post('/agregar_grupo', isLoggedIn, async(req, res) => {
    const { conexion } = require('../lib/passport');
    const{ grupo, clave, notarjeta, horario, noalumnos } = req.body;
    try{
        await conexion.query('INSERT INTO laboratorio.GRUPO (grupo, clave, notarjeta, horario, noalumnos) values ($1, $2, $3, $4, $5)', [grupo, clave, notarjeta, horario, noalumnos]);
        req.flash('exito', 'Grupo agregado con exito');
        res.redirect('/extra/grupos');
    } catch(error){
        req.flash('danger', 'Error al insertar registro: ' + error.message);
        res.redirect('/extra/agregar_grupo');
    }
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

router.get('/grupos/eliminar/:id', isLoggedIn,  async (req, res) => {
    const { conexion } = require('../lib/passport');
    const {id} = req.params;
    try{
        await conexion.query('DELETE FROM LABORATORIO.grupo WHERE idgrupo = $1', [id]);
        req.flash('exito', 'grupo eliminado con exito');
    } catch (error){
        req.flash('danger', 'Error al eliminar registros');
    }
    res.redirect('/extra/grupos');
});

router.get('/grupos/editar/:id', isLoggedIn,  async(req, res) => {
    const {id} = req.params;
    const { conexion } = require('../lib/passport');
    const consulta = await conexion.query('SELECT * FROM LABORATORIO.MATERIA');
    const consulta2 = await conexion.query('SELECT * FROM LABORATORIO.PERSONAL');
    const consulta3 = await conexion.query('SELECT * FROM LABoratorio.grupo WHERE idgrupo = $1', [id]);
    const mat = consulta.rows;
    const personal = consulta2.rows;
    const grupos = consulta3.rows;
    res.render('extras/editar_grupo', {mat, personal, grupo:grupos[0]} );
});

router.post('/grupos/editar/:id', isLoggedIn,  async(req, res) => {
    const {id} = req.params;
    const { conexion } = require('../lib/passport');
    const{ grupo, clave, notarjeta, horario, noalumnos } = req.body;
    try{
        await  conexion.query('UPDATE laboratorio.grupo SET grupo = $1, clave = $2, notarjeta = $3, horario = $4, noalumnos = $5 WHERE idgrupo = $6', [grupo, clave, notarjeta, horario, noalumnos, id]);
        req.flash('exito', 'Grupo editado con exito');
    } catch (error) {
        req.flash('danger', 'Error al actualizar registro: ' + error.message)
    }
    res.redirect('/extra/grupos');
});

router.get('/nuevosemestre', isLoggedIn,  async(req, res) => {
    const { conexion } = require('../lib/passport');
    res.render('extras/nuevosemestre')
});

router.post('/nuevosemestre', isLoggedIn, async(req, res) => {
    const { conexion } = require('../lib/passport');
    const{ semestre, inicio, final } = req.body;
    const consult = await conexion.query('select * from laboratorio.semestre where fechainicio = $1', [inicio]);
    const resultado = consult.rows;
    if (resultado.length > 0) {
        req.flash('danger', 'Se tiene registrado un semestre con la misma fecha de inicio');
        req.redirect('/extra/nuevosemestre')
    } else{
        await conexion.query('INSERT INTO laboratorio.SEMESTRE(PERIODO,FECHAINICIO,FECHAFINAL) values ($1, $2, $3)', [semestre, inicio, final]);
        req.flash('exito', 'Semestre agregado con exito');
        res.redirect('/extra/semestres');
    }
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
    const consuareas = await conexion.query('SELECT * FROM LABORATORIO.area');
    const areas = consuareas.rows;
    const consu1 = await conexion.query('SELECT * FROM LABORATORIO.practica WHERE idarea = $1', [areas[0].idarea]);
    const consu2 = await conexion.query('SELECT * FROM LABORATORIO.practica WHERE idarea = $1', [areas[1].idarea]);
    const consu3 = await conexion.query('SELECT * FROM LABORATORIO.practica WHERE idarea = $1', [areas[2].idarea]);
    const consu4 = await conexion.query('SELECT * FROM LABORATORIO.practica WHERE idarea = $1', [areas[3].idarea]);
    const consu5 = await conexion.query('SELECT * FROM LABORATORIO.practica WHERE idarea = $1', [areas[4].idarea]);
    const consu6 = await conexion.query('SELECT * FROM LABORATORIO.practica WHERE idarea = $1', [areas[5].idarea]);
    const area1= consu1.rows;
    const area2= consu2.rows;
    const area3= consu3.rows;
    const area4= consu4.rows;
    const area5= consu5.rows;
    const area6= consu6.rows;

    res.render('extras/horariolab', {area1, area2, area3, area4, area5, area6});
});

module.exports = router;