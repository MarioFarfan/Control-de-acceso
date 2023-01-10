const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../lib/auth');


router.get('/agregar_dispositivo', isLoggedIn,  (req, res) => {
    res.render('inventarios/agregar')
});

router.post('/agregar_dispositivo', isLoggedIn, async(req, res) => {
    const { conexion } = require('../lib/passport');
    const{ noserie, marca, tipo, noinv, monitor, teclado, mouse, idarea } = req.body;
    const newDispositivo = { noserie, marca, tipo, noinv, monitor, teclado, mouse, idarea };  //validar los datos
    await conexion.query('INSERT INTO PC set ?', [newDispositivo]);
    req.flash('mensaje', 'PC agregada con exito');
    res.redirect('/inventarios/listar_equipos');
});

router.get('/listar_equipos', isLoggedIn, async (req, res) => {
    const { conexion } = require('../lib/passport');
    const equipos = await conexion.query('SELECT * FROM PC');
    const areas = await conexion.query('select idarea, nombre from area');
    res.render('inventarios/listar_equipos', { equipos, areas });
});

//Eliminar registros
router.get('/listar_equipos/eliminar/:id', isLoggedIn,  async (req, res) => {
    const { conexion } = require('../lib/passport');
    const {id} = req.params;
    await conexion.query('DELETE FROM PC WHERE NOSERIE = (?)', [id]);
    req.flash('mensaje', 'Equipo eliminado con exito');
    res.redirect('/inventarios/listar_equipos');
});

//Editar registros 
router.get('/listar_equipos/editar/:id', isLoggedIn,  async(req, res) => {
    const {id} = req.params;
    const { conexion } = require('../lib/passport');
    const equipo = await conexion.query('SELECT * FROM PC WHERE NOSERIE = ?', [id]);
    res.render('inventarios/editar', {equipo: equipo[0]});
});

router.post('/listar_equipos/editar/:id', isLoggedIn,  async(req, res) => {
    const {id} = req.params;
    const { conexion } = require('../lib/passport');
    const{ noserie, marca, tipo, noinv, monitor, teclado, mouse } = req.body;
    const newDispositivo = {
        noserie, marca, tipo, noinv, monitor, teclado, mouse
    };

    await  conexion.query('UPDATE PC SET ? WHERE NOSERIE = ?', [newDispositivo, noserie]);
    req.flash('mensaje', 'Dispositivo editado con exito');
    res.redirect('/inventarios/listar_equipos');
});

//  OPERACIONES PARA ESTUDIANTES, LISTAR, AGREGAR, EDITAR Y ELIMIAR
router.get('/usuarios/agregar_alumno', isLoggedIn,  async (req, res) => {
    const { conexion } = require('../lib/passport');
    const carreras = await conexion.query('SELECT IDCARRERA, ALIAS, NOMBRE, DEPARTAMENTO FROM CARRERA');
    res.render('usuarios/agregar_alumno',{carreras});
}); 

router.post('/usuarios/agregar_alumno', isLoggedIn,  async (req, res ) => {
    const { nocontrol, nombre, apellidop, apellidom, idcarrera, semestre } = req.body;
    const newAlumno = {
        nocontrol,
        nombre,
        apellidop,
        apellidom,
        idcarrera,
        semestre,
        status: 'ALTA'
    }
    const { conexion } = require('../lib/passport');
    await conexion.query('INSERT INTO estudiante set ?', [newAlumno]);
    req.flash('mensaje', 'Alumno agregado con exito');
    res.redirect('/inventarios/alumnos');
});

router.get('/alumnos', isLoggedIn,  async (req, res) => {
    const { conexion } = require('../lib/passport');
    const alumnos = await conexion.query('SELECT NOCONTROL, ESTUDIANTE.NOMBRE, APELLIDOP, APELLIDOM, CARRERA.NOMBRE, SEMESTRE, STATUS  FROM ESTUDIANTE INNER JOIN CARRERA ON ESTUDIANTE.IDCARRERA = CARRERA.IDCARRERA');
    const carreras = await conexion.query('SELECT IDCARRERA, ALIAS, NOMBRE, DEPARTAMENTO FROM CARRERA');
    res.render('usuarios/listar_alumnos', { alumnos, carreras });
});

//Eliminar registros
router.get('/alumnos/eliminar/:id', isLoggedIn,  async (req, res) => {
    const { conexion } = require('../lib/passport');
    const {id} = req.params;
    await conexion.query('DELETE FROM ESTUDIANTE WHERE NOCONTROL = ?', [id]);
    req.flash('exito', 'Alumno eliminado con éxito');
    res.redirect('/inventarios/alumnos');
});

//Editar alumnos
router.get('/alumnos/editar/:id', isLoggedIn,  async(req, res) => {
    const { conexion } = require('../lib/passport');
    const {id} = req.params;
    const alumnos = await conexion.query('SELECT * FROM ESTUDIANTE WHERE NOCONTROL = ?', [id]);
    const carreras = await conexion.query('SELECT IDCARRERA, ALIAS, NOMBRE, DEPARTAMENTO FROM CARRERA');
    res.render('usuarios/editar_alumno', {carreras, alumno: alumnos[0]});
});

router.post('/alumnos/editar/:id', isLoggedIn,  async(req, res) => {
    const {id} = req.params;
    const { nocontrol, nombre, appelidop, appelidom, idcarrera, semestre } = req.body;
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
    await  conexion.query('UPDATE ESTUDIANTE SET ? WHERE NOCONTROL = ?', [newAlumno, id]);
    req.flash('exito', 'Alumno agregado con éxito');
    res.redirect('/inventarios/alumnos');
});

router.get('/agregar_materia', isLoggedIn,  async (req, res) => {
    const { conexion } = require('../lib/passport');
    const carreras = await conexion.query('SELECT IDCARRERA, ALIAS, NOMBRE, DEPARTAMENTO FROM CARRERA');
    res.render('inventarios/nuevamateria', { carreras });
});

router.post('/agregar_materia', isLoggedIn,  async (req, res ) => {
    const { clave, nombre, idcarrera } = req.body;
    const newMateria = {
        clave, 
        nombre, 
        idcarrera
    }
    const { conexion } = require('../lib/passport');
    await conexion.query('INSERT INTO MATERIA set ?', [newMateria]);
    req.flash('exito', 'Materia agregada con éxito');
    res.redirect('/inventarios/materias');
});

router.get('/materias', isLoggedIn,  async (req, res) => {
    const { conexion } = require('../lib/passport');
    const carreras = await conexion.query('SELECT IDCARRERA, ALIAS, NOMBRE, DEPARTAMENTO FROM CARRERA');
    const materias = await conexion.query('SELECT CLAVE, NOMBRE, IDCARRERA FROM MATERIA INNER JOIN CARRERA on carrera.idcarrera = materia.idcarrera');
    res.render('inventarios/listar_materias', { carreras, materias });
});

router.get('/materias/eliminar/:id',  isLoggedIn, async (req, res) => {
    const {id} = req.params;
    const { conexion } = require('../lib/passport');
    await conexion.query('DELETE FROM MATERIA WHERE CLAVE = ?', [id]);
    req.flash('mensaje', 'Materia eliminada con éxito');
    res.redirect('/inventarios/materias');
});

router.post('/materias', isLoggedIn,  async (req, res) => {
    const {mat, carr } = req.body;
    console.log('datos del formulario' + mat + carr);
    const { conexion } = require('../lib/passport');
    const carreras = await conexion.query('SELECT IDCARRERA, NOMBRE FROM CARRERA where idcarrera = ?', [carr]);
    const materias = await conexion.query('SELECT CLAVE, NOMBRE, IDCARRERA FROM MATERIA INNER JOIN CARRERA on carrera.idcarrera = materia.idcarrera');
    res.render('inventarios/listar_materias', { carreras, materias });
});

router.get('/agregar_periferico', isLoggedIn,  (req, res) => {
    res.render('inventarios/agregar_periferico')
});

router.post('/agregar_periferico', isLoggedIn, async(req, res) => {
    const{ noserie, noinv, tipo } = req.body;
    const newDispositivo = { noserie, noinv, tipo };  //validar los datos
    const { conexion } = require('../lib/passport');
    await conexion.query('INSERT INTO insumos set ?', [newDispositivo]);
    req.flash('mensaje', 'Periferico agregado con exito');
    res.redirect('/inventarios/listar_perifericos');
});

router.get('/listar_perifericos', isLoggedIn,  async (req, res) => {
    const { conexion } = require('../lib/passport');
    const equiposmonitor = await conexion.query('SELECT * FROM INSUMOS WHERE TIPO like "MONITOR"');
    const equiposteclado = await conexion.query('SELECT * FROM INSUMOS WHERE TIPO like "TECLADO"');
    const equiposmouse = await conexion.query('SELECT * FROM INSUMOS WHERE TIPO like "MOUSE"');
    res.render('inventarios/listar_perifericos', {equiposmonitor, equiposteclado, equiposmouse });
});

router.get('/listar_perifericos/eliminar/:id',  isLoggedIn, async (req, res) => {
    const {id} = req.params;
    const { conexion } = require('../lib/passport');
    await conexion.query('DELETE FROM INSUMOS WHERE noserie = ?', [id]);
    req.flash('mensaje', 'Periferico eliminado con éxito');
    res.redirect('/inventarios/listar_perifericos');
});

router.get('/listar_perifericos/editar/:id', isLoggedIn,  async(req, res) => {
    const { conexion } = require('../lib/passport');
    const {id} = req.params;
    const perifericos = await conexion.query('SELECT * FROM INSUMOS WHERE noserie = ?', [id]);
    res.render('inventarios/editar_periferico', {periferico: perifericos[0]});
});

router.post('/listar_perifericos/editar/:id', isLoggedIn,  async(req, res) => {
    const {id} = req.params;
    const { noserieper, marca, tipo, noinventario } = req.body;
    const newPeriferico = {
        noserieper, 
        marca,
        estado, 
        tipo
    }
    const { conexion } = require('../lib/passport');
    await  conexion.query('UPDATE INSUMOS SET ? WHERE noserie = ?', [newPeriferico, id]);
    req.flash('exito', 'Alumno agregado con éxito');
    res.redirect('/inventarios/listar_perifericos');
});

module.exports = router;

//Dispositivos extra
router.get('/nuevo_dispositivoaux', isLoggedIn,  (req, res) => {
    res.render('inventarios/agregar_dispositivo')
});

router.post('/nuevo_dispositivoaux', isLoggedIn, async(req, res) => {
    const { conexion } = require('../lib/passport');
    const{ noserie, nombre, marca, tipo, descripcion, noinventario } = req.body;
    const newDispositivo = { noserie, nombre, marca, tipo, descripcion, noinventario };  //validar los datos
    await conexion.query('INSERT INTO DISPOSITIVO set ?', [newDispositivo]);
    req.flash('mensaje', 'dispositivo agregado con exito');
    res.redirect('inventarios/listar_dispositivos');
});

router.get('/dispositivos_auxiliares', isLoggedIn, async (req, res) => {
    const { conexion } = require('../lib/passport');
    const equipos = await conexion.query('SELECT * FROM DISPOSITIVO');
    res.render('inventarios/listar_dispositivos', { equipos });
});