const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn, isAux } = require('../lib/auth');


router.get('/agregar_dispositivo', isLoggedIn, isAux, (req, res) => {
    res.render('inventarios/agregar')
});

router.post('/agregar_dispositivo', isLoggedIn, async(req, res) => {
    const{ noserie, marca, tipo, noinventario, monitor, teclado, mouse, idarea } = req.body;
    const newDispositivo = { noserie, marca, tipo, noinventario, monitor, teclado, mouse, idarea };  //validar los datos
    await pool.query('INSERT INTO PC set ?', [newDispositivo]);
    req.flash('mensaje', 'PC agregada con exito');
    res.redirect('/inventarios/listar_equipos');
});

router.get('/listar_equipos', isLoggedIn, async (req, res) => {
    const equipos = await pool.query('SELECT * FROM PC');
    res.render('inventarios/listar_equipos', { equipos });
});

//Eliminar registros
router.get('/listar_equipos/eliminar/:id', isLoggedIn, isAux, async (req, res) => {
    const {id} = req.params;
    await pool.query('DELETE FROM PC WHERE NOSERIE = ?', [id]);
    req.flash('mensaje', 'Equipo editado con exito');
    res.redirect('/inventarios/listar_equipos');
});

//Editar registros 
router.get('/listar_equipos/editar/:id', isLoggedIn, isAux, async(req, res) => {
    const {id} = req.params;
    const equipo = await pool.query('SELECT * FROM PC WHERE NOSERIE = ?', [id]);
    res.render('inventarios/editar', {equipo: equipo[0]});
});

router.post('/listar_equipos/editar/:id', isLoggedIn, isAux, async(req, res) => {
    const {id} = req.params;
    const{ noserie, marca, tipo, noinventario, monitor, teclado, mouse } = req.body;
    const newDispositivo = {
        noserie, marca, tipo, noinventario, monitor, teclado, mouse
    };

    await  pool.query('UPDATE PC SET ? WHERE NOSERIE = ?', [newDispositivo, noserie]);
    req.flash('mensaje', 'Dispositivo editado con exito');
    res.redirect('/inventarios/listar_equipos');
});

//  OPERACIONES PARA ALUMNOS, LISTAR, AGREGAR, EDITAR Y ELIMIAR
router.get('/usuarios/agregar_alumno', isLoggedIn, isAux, async (req, res) => {
    const carreras = await pool.query('SELECT IDCARRERA, CARRERA FROM CARRERA');
    res.render('usuarios/agregar_alumno',{carreras});
}); 

router.post('/usuarios/agregar_alumno', isLoggedIn, isAux, async (req, res ) => {
    const { nocontrol, nombre_al, ap_pat, ap_mat, idcarrera, semestre } = req.body;
    const newAlumno = {
        nocontrol,
        nombre_al,
        ap_pat,
        ap_mat,
        idcarrera,
        semestre,
        status: 'ALTA'
    }
    await pool.query('INSERT INTO alumno set ?', [newAlumno]);
    req.flash('mensaje', 'Alumno agregado con exito');
    res.redirect('/inventarios/alumnos');
});

router.get('/alumnos', isLoggedIn, isAux, async (req, res) => {
    const alumnos = await pool.query('SELECT NOCONTROL, NOMBRE_AL, AP_PAT, AP_MAT, CARRERA, SEMESTRE, STATUS  FROM ALUMNO INNER JOIN CARRERA ON ALUMNO.IDCARRERA = CARRERA.IDCARRERA');
    const carreras = await pool.query('SELECT IDCARRERA, CARRERA FROM CARRERA');
    res.render('usuarios/listar_alumnos', { alumnos, carreras });
});

//Eliminar registros
router.get('/alumnos/eliminar/:id', isLoggedIn, isAux, async (req, res) => {
    const {id} = req.params;
    await pool.query('DELETE FROM ALUMNO WHERE NOCONTROL = ?', [id]);
    req.flash('exito', 'Alumno eliminado con éxito');
    res.redirect('/inventarios/alumnos');
});

//Editar alumnos
router.get('/alumnos/editar/:id', isLoggedIn, isAux, async(req, res) => {
    const {id} = req.params;
    const alumnos = await pool.query('SELECT * FROM ALUMNO WHERE NOCONTROL = ?', [id]);
    const carreras = await pool.query('SELECT IDCARRERA, CARRERA FROM CARRERA');
    res.render('usuarios/editar_alumno', {carreras, alumno: alumnos[0]});
});

router.post('/alumnos/editar/:id', isLoggedIn, isAux, async(req, res) => {
    const {id} = req.params;
    const { nocontrol, nombre_al, ap_pat, ap_mat, idcarrera, semestre } = req.body;
    const newAlumno = {
        nocontrol,
        nombre_al,
        ap_pat,
        ap_mat,
        idcarrera,
        semestre,
        status: 'ALTA'
    }
    req.flash('exito', 'Alumno agregado con éxito');
    await  pool.query('UPDATE ALUMNO SET ? WHERE NOCONTROL = ?', [newAlumno, id]);
    res.redirect('/inventarios/alumnos');
});

router.get('/agregar_materia', isLoggedIn, isAux, async (req, res) => {
    const carreras = await pool.query('SELECT IDCARRERA, CARRERA FROM CARRERA');
    res.render('inventarios/nuevamateria', { carreras });
});

router.post('/agregar_materia', isLoggedIn, isAux, async (req, res ) => {
    const { clavemat, nombremat, idcarrera, reticula } = req.body;
    const newMateria = {
        clavemateria: clavemat, 
        nombremat, 
        idcarrera, 
        reticula
    }
    await pool.query('INSERT INTO MATERIA set ?', [newMateria]);
    req.flash('exito', 'Materia agregada con éxito');
    res.redirect('/inventarios/materias');
});

router.get('/materias', isLoggedIn, isAux, async (req, res) => {
    const carreras = await pool.query('SELECT IDCARRERA, CARRERA FROM CARRERA');
    const materias = await pool.query('SELECT CLAVEMATERIA, NOMBREMAT, CARRERA, RETICULA FROM MATERIA INNER JOIN CARRERA on carrera.idcarrera = materia.idcarrera');
    
    res.render('inventarios/listar_materias', { carreras, materias });
});

router.get('/materias/eliminar/:id', isAux, isLoggedIn, async (req, res) => {
    const {id} = req.params;
    await pool.query('DELETE FROM MATERIA WHERE CLAVEMATERIA = ?', [id]);
    req.flash('mensaje', 'Materia eliminada con éxito');
    res.redirect('/inventarios/materias');
});

router.post('/materias', isLoggedIn, isAux, async (req, res) => {
    const {mat, carr } = req.body;
    console.log('datos del formulario' + mat + carr);
    const carreras = await pool.query('SELECT IDCARRERA, CARRERA FROM CARRERA where idcarrera = ?', [carr]);
    const materias = await pool.query('SELECT CLAVEMATERIA, NOMBREMAT, CARRERA, RETICULA FROM MATERIA INNER JOIN CARRERA on carrera.idcarrera = materia.idcarrera');
    
    res.render('inventarios/listar_materias', { carreras, materias });
});

router.get('/agregar_periferico', isLoggedIn, isAux, (req, res) => {
    res.render('inventarios/agregar_periferico')
});

router.post('/agregar_periferico', isLoggedIn, async(req, res) => {
    const{ noserieper, marca, tipo, noinventario } = req.body;
    const newDispositivo = { noserieper, marca,estado: 'SIN ASIGNAR', tipo };  //validar los datos
    await pool.query('INSERT INTO periferico set ?', [newDispositivo]);
    req.flash('mensaje', 'Periferico agregado con exito');
    res.redirect('/inventarios/listar_perifericos');
});

router.get('/listar_perifericos', isLoggedIn, isAux, async (req, res) => {
    const equiposmonitor = await pool.query('SELECT * FROM PERIFERICO WHERE TIPO = "MONITOR"');
    const equiposteclado = await pool.query('SELECT * FROM PERIFERICO WHERE TIPO = "TECLADO"');
    const equiposmouse = await pool.query('SELECT * FROM PERIFERICO WHERE TIPO = "MOUSE"');
    res.render('inventarios/listar_perifericos', {equiposmonitor, equiposteclado, equiposmouse });
});

router.get('/listar_perifericos/eliminar/:id', isAux, isLoggedIn, async (req, res) => {
    const {id} = req.params;
    await pool.query('DELETE FROM periferico WHERE noserieper = ?', [id]);
    req.flash('mensaje', 'Periferico eliminado con éxito');
    res.redirect('/inventarios/listar_perifericos');
});

router.get('/listar_perifericos/editar/:id', isLoggedIn, isAux, async(req, res) => {
    const {id} = req.params;
    const perifericos = await pool.query('SELECT * FROM periferico WHERE noserieper = ?', [id]);
    res.render('inventarios/editar_periferico', {periferico: perifericos[0]});
});

router.post('/listar_perifericos/editar/:id', isLoggedIn, isAux, async(req, res) => {
    const {id} = req.params;
    const { noserieper, marca, tipo, noinventario } = req.body;
    const newPeriferico = {
        noserieper, 
        marca,
        estado, 
        tipo
    }
    req.flash('exito', 'Alumno agregado con éxito');
    await  pool.query('UPDATE periferico SET ? WHERE noserieper = ?', [newPeriferico, id]);
    res.redirect('/inventarios/listar_perifericos');
});


//DISPOSITIVOS EXTRA
router.get('/dispositivos', isLoggedIn, isAux, async (req, res) => {
    const routers = await pool.query('SELECT * FROM DISPOSITIVO WHERE TIPO = "ROUTER"');
    const switches = await pool.query('SELECT * FROM DISPOSITIVO WHERE TIPO = "SWITCH"');
    const proyectores = await pool.query('SELECT * FROM DISPOSITIVO WHERE TIPO = "PROYECTOR"');
    res.render('inventarios/dispositivos', {routers, switches, proyectores });
});

router.get('/nuevo_dispositivo', isLoggedIn, isAux, (req, res) => {
    res.render('inventarios/nuevo_disp')
});

router.post('/nuevo_dispositivo', isLoggedIn,  async(req, res) => {
    const{ noserie, nofolio, marca, modelo, tipo, descripcion } = req.body;
    const newDispositivo = { noserie, nofolio, marca, modelo, tipo, descripcion };  //validar los datos
    await pool.query('INSERT INTO DISPOSITIVO set ?', [newDispositivo]);
    req.flash('mensaje', 'Dispositivo agregado con exito');
    res.redirect('inventarios/dispositivos');
});


module.exports = router;