const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../lib/auth');


router.get('/agregar_pc', isLoggedIn,  async(req, res) => {
    const { conexion } = require('../lib/passport');
    const querymouse = await conexion.query("select * from laboratorio.insumos where tipo = 'MOUSE'");
    const querykeyboard = await conexion.query("select * from laboratorio.insumos where tipo = 'TECLADO'");
    const querymonitor = await conexion.query("select * from laboratorio.insumos where tipo = 'MONITOR'");
    const queryareas = await conexion.query("select * from laboratorio.area");
    const mouse = querymouse.rows;
    const teclados = querykeyboard.rows;
    const monitores = querymonitor.rows;
    const areas = queryareas.rows;
    console.log(teclados)
    res.render('inventarios/agregar', {mouse, teclados, monitores, areas});
});

router.post('/agregar_pc', isLoggedIn, async(req, res) => {
    const { conexion } = require('../lib/passport');
    var{ noserie, marca, tipo, noinv, monitor, teclado, mouse, idarea } = req.body;
    if (tipo === 'ALL IN ONE') {
        monitor = noserie;
    }
    await conexion.query('INSERT INTO LABORATORIO.PC values ($1, $2, $3, $4, $5, $6, $7, $8)', [noserie, marca, tipo, noinv, monitor, teclado, mouse, idarea]);
    req.flash('mensaje', 'PC agregada con exito');
    res.redirect('/inventarios/listar_equipos');
});

router.get('/listar_equipos', isLoggedIn, async (req, res) => {
    const { conexion } = require('../lib/passport');
    const {filtro, idarea, tipo}= req.body;
    const equpos1 = await conexion.query('SELECT * FROM LABORATORIO.PC INNER JOIN LABORATORIO.AREA on PC.idarea = AREA.idarea');
    const areas1 = await conexion.query('select idarea, nombre from laboratorio.area');
    const equipos = equpos1.rows;
    const areas = areas1.rows;
    res.render('inventarios/listar_equipos', { equipos, areas });
});

//Eliminar registros
router.get('/listar_equipos/eliminar/:id', isLoggedIn,  async (req, res) => {
    const { conexion } = require('../lib/passport');
    const {id} = req.params;
    await conexion.query('DELETE FROM LABORATORIO.PC WHERE NOSERIE = ($1)', [id]);
    req.flash('mensaje', 'Equipo eliminado con exito');
    res.redirect('/inventarios/listar_equipos');
});

//Editar registros 
router.get('/listar_equipos/editar/:id', isLoggedIn,  async(req, res) => {
    const {id} = req.params;
    const { conexion } = require('../lib/passport');
    const equipo = await conexion.query('SELECT * FROM LABORATORIO.PC WHERE NOSERIE = $1', [id]);
    res.render('inventarios/editar', {equipo: equipo[0]});
});

router.post('/listar_equipos/editar/:id', isLoggedIn,  async(req, res) => {
    const {id} = req.params;
    const { conexion } = require('../lib/passport');
    const{ noserie, marca, tipo, noinv, monitor, teclado, mouse } = req.body;
    const newDispositivo = {noserie, marca, tipo, noinv, monitor, teclado, mouse};
    await  conexion.query('UPDATE PC SET ($1, $2, $3, $4, $5, $6, $7) WHERE NOSERIE = $8', [noserie, marca, tipo, noinv, monitor, teclado, mouse, noserie]);
    req.flash('mensaje', 'Dispositivo editado con exito');
    res.redirect('/inventarios/listar_equipos');
});

//  OPERACIONES PARA ESTUDIANTES, LISTAR, AGREGAR, EDITAR Y ELIMIAR
router.get('/agregar_alumno', isLoggedIn,  async (req, res) => {
    const { conexion } = require('../lib/passport');
    const carreras1 = await conexion.query('SELECT IDCARRERA, ALIAS, NOMBRE FROM LABORATORIO.CARRERA');
    const carreras = carreras1.rows;
    res.render('usuarios/agregar_alumno',{carreras});
}); 

router.post('/agregar_alumno', isLoggedIn,  async (req, res ) => {
    const { nocontrol, nombre, apellidop, apellidom, idcarrera, semestre, status } = req.body;
    const { conexion } = require('../lib/passport');
    await conexion.query('INSERT INTO LABORATORIO.estudiante values ($1, $2, $3, $4, $5, $6, $7)', [nocontrol, nombre, apellidop, apellidom, idcarrera, semestre, status]);
    req.flash('mensaje', 'Alumno agregado con exito');
    res.redirect('/inventarios/alumnos');
});

router.get('/alumnos', isLoggedIn,  async (req, res) => {
    const { conexion } = require('../lib/passport');
    const { campo, idcarrera } = req.body;
    const alumnos1 = await conexion.query('SELECT NOCONTROL, ESTUDIANTE.NOMBRE AS NOMBRE, APELLIDOP, APELLIDOM, CARRERA.NOMBRE AS CARRERA, SEMESTRE, STATUS FROM LABORATORIO.LABORATORIO.ESTUDIANTE INNER JOIN LABORATORIO.LABORATORIO.CARRERA ON LABORATORIO.ESTUDIANTE.IDCARRERA = LABORATORIO.CARRERA.IDCARRERA');
    const carreras1 = await conexion.query('SELECT IDCARRERA, ALIAS, NOMBRE, DEPARTAMENTO FROM LABORATORIO.CARRERA');
    const alumnos = alumnos1.rows;
    const carreras = carreras1.rows;
    res.render('usuarios/listar_alumnos', { alumnos, carreras });
});

//Eliminar registros
router.get('/alumnos/eliminar/:id', isLoggedIn,  async (req, res) => {
    const { conexion } = require('../lib/passport');
    const {id} = req.params;
    await conexion.query('DELETE FROM LABORATORIO.ESTUDIANTE WHERE NOCONTROL = $1', [id]);
    req.flash('exito', 'Alumno eliminado con éxito');
    res.redirect('/inventarios/alumnos');
});

//Editar alumnos
router.get('/alumnos/editar/:id', isLoggedIn,  async(req, res) => {
    const { conexion } = require('../lib/passport');
    const {id} = req.params;
    const alumnos1 = await conexion.query('SELECT * FROM LABORATORIO.ESTUDIANTE WHERE NOCONTROL = $1', [id]);
    const carreras1 = await conexion.query('SELECT IDCARRERA, ALIAS, NOMBRE, DEPARTAMENTO FROM LABORATORIO.CARRERA');
    const alumnos = alumnos1.rows;
    const carreras = carreras1.rows;
    res.render('usuarios/editar_alumno', {carreras, alumno: alumnos[0]});
});

router.post('/alumnos/editar/:id', isLoggedIn,  async(req, res) => {
    const {id} = req.params;
    const { nocontrol, nombre, appelidop, appelidom, idcarrera, semestre, status = 'ALTA' } = req.body;
    const newAlumno = {
        nocontrol,
        nombre,
        appelidop,
        appelidom,
        idcarrera,
        semestre,
        status: 'ALTA'
    }
    const { conexion } = require('../lib/passport');
    await  conexion.query('UPDATE ESTUDIANTE SET ($1, $2, $3, $4, $5, $6, $7) WHERE NOCONTROL = $8', [nocontrol, nombre, appelidop, appelidom, idcarrera, semestre, status, id]);
    req.flash('exito', 'Alumno agregado con éxito');
    res.redirect('/inventarios/alumnos');
});

router.get('/agregar_periferico', isLoggedIn,  (req, res) => {
    res.render('inventarios/agregar_periferico')
});

router.post('/agregar_periferico', isLoggedIn, async(req, res) => {
    const{ noserie, noinv, tipo } = req.body;
    const newDispositivo = { noserie, noinv, tipo };  //validar los datos
    const { conexion } = require('../lib/passport');
    await conexion.query('INSERT INTO LABORATORIO.insumos values ($1, $2, $3)', [noserie, noinv, tipo]);
    req.flash('mensaje', 'Periferico agregado con exito');
    res.redirect('/inventarios/listar_perifericos');
});

router.get('/listar_perifericos', isLoggedIn,  async (req, res) => {
    const { conexion } = require('../lib/passport');
    const equipos1 = await conexion.query('SELECT * FROM LABORATORIO.INSUMOS');
    const equipos = equipos1.rows;
    res.render('inventarios/listar_perifericos', {equipos});
});

router.get('/listar_perifericos/eliminar/:id',  isLoggedIn, async (req, res) => {
    const {id} = req.params;
    const { conexion } = require('../lib/passport');
    await conexion.query('DELETE FROM LABORATORIO.INSUMOS WHERE noserie = $1', [id]);
    req.flash('mensaje', 'Periferico eliminado con éxito');
    res.redirect('/inventarios/listar_perifericos');
});

router.get('/listar_perifericos/editar/:id', isLoggedIn,  async(req, res) => {
    const { conexion } = require('../lib/passport');
    const {id} = req.params;
    const perifericos1 = await conexion.query('SELECT * FROM LABORATORIO.INSUMOS WHERE noserie = $1', [id]);
    const perifericos = perifericos1.rows;
    res.render('inventarios/editar_periferico', {periferico: perifericos[0]});
});
//===============================================================================================================
router.post('/listar_perifericos/editar/:id', isLoggedIn,  async(req, res) => {
    const {id} = req.params;
    const { noserieper, noinv, tipo } = req.body;
    const newPeriferico = {
        noserieper, 
        noinv,
        tipo
    }
    const { conexion } = require('../lib/passport');
    await  conexion.query('UPDATE INSUMOS SET ($1, $2, $3) WHERE noserie = $4', [newPeriferico, id]);
    req.flash('exito', 'Alumno agregado con éxito');
    res.redirect('/inventarios/listar_perifericos');
});

//Dispositivos extra
router.get('/nuevo_dispositivoaux', isLoggedIn,  (req, res) => {
    res.render('inventarios/agregar_dispositivo')
});

router.post('/nuevo_dispositivoaux', isLoggedIn, async(req, res) => {
    const { conexion } = require('../lib/passport');
    const{ noserie, nombre, marca, tipo, descripcion, noinv } = req.body;
    const newDispositivo = 
       { noserie,
         nombre, 
         marca, 
         tipo, 
         descripcion, 
         noinv };  //validar los datos
    
    await conexion.query('INSERT INTO LABORATORIO.DISPOSITIVO values ($1, $2, $3, $4, $5, $6)', [noserie, nombre, marca, tipo, descripcion, noinv]);
    req.flash('mensaje', 'dispositivo agregado con exito');
    res.redirect('/inventarios/listar_dispositivos');
});

router.get('/listar_dispositivos', isLoggedIn, async (req, res) => {
    const { conexion } = require('../lib/passport');
    const equipos1 = await conexion.query('SELECT * FROM LABORATORIO.LABORATORIO.DISPOSITIVO');
    const equipos = equipos1.rows;
    console.log(equipos);
    res.render('inventarios/listar_dispositivos', { equipos });
});

module.exports = router;