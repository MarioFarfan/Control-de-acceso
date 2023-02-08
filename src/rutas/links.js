const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../lib/auth');


router.get('/agregar_pc', isLoggedIn,  async(req, res) => {
    const { conexion } = require('../lib/passport');
    const querymouse = await conexion.query("select * from laboratorio.insumos where tipo = 'MOUSE' and estado = 'LIBRE'");
    const querykeyboard = await conexion.query("select * from laboratorio.insumos where tipo = 'TECLADO' and estado = 'LIBRE'");
    const querymonitor = await conexion.query("select * from laboratorio.insumos where tipo = 'MONITOR'  and estado = 'LIBRE'");
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
    var{ noserie, noinv, marca, tipo, monitor, teclado, mouse, idarea } = req.body;
    //if (tipo === 'ALL IN ONE') {
     //   monitor = noserie;
    //}
    const consulta = await conexion.query('SELECT * FROM LABORATORIO.pc where noserie = $1 or monitor = $2 or teclado = $3 or mouse = $4 or noinv = $5', [noserie, monitor, teclado, mouse, noinv]);
    const result = consulta.rows;
    if (result.length > 0) {
        req.flash('danger', 'Error: existe al menos una computadora con datos similares a los que desea registrar');
    } else {
        try{
            await conexion.query('INSERT INTO LABORATORIO.PC values ($1, $2, $3, $4, $5, $6, $7, $8)', [noserie, noinv, marca, tipo, monitor, teclado, mouse, idarea]);
            req.flash('exito', 'PC agregada con exito');
            res.redirect('/inventarios/listar_equipos');
        } catch (error) {
            req.flash('danger', 'Error al insertar registro: ' + error.message);
            res.redirect('/inventarios/agregar_pc');
        }
    }  
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
    try{
        await conexion.query('DELETE FROM LABORATORIO.PC WHERE NOSERIE = ($1)', [id]);
        req.flash('exito', 'Equipo eliminado con exito');
    } catch (error) {
        req.flash('danger', 'Error al eliminar registro: '+ error.message);
    }
    res.redirect('/inventarios/listar_equipos');
});

//Editar registros 
router.get('/listar_equipos/editar/:id', isLoggedIn,  async(req, res) => {
    const { conexion } = require('../lib/passport');
    const {id} = req.params;
    const equipo = await conexion.query('SELECT * FROM LABORATORIO.PC WHERE NOSERIE = $1', [id]);
    const equipo1 = equipo.rows;
    res.render('inventarios/editar', {equipo1: equipo1[0]});
});

/** 
 * const { conexion } = require('../lib/passport');
    const {id} = req.params;
    const alumnos1 = await conexion.query('SELECT * FROM LABORATORIO.ESTUDIANTE WHERE NOCONTROL = $1', [id]);
    const carreras1 = await conexion.query('SELECT IDCARRERA, ALIAS, NOMBRE, DEPARTAMENTO FROM LABORATORIO.CARRERA');
    const alumnos = alumnos1.rows;
    const carreras = carreras1.rows;
    res.render('usuarios/editar_alumno', {carreras, alumno: alumnos[0]});
*/

router.post('/listar_equipos/editar/:id', isLoggedIn,  async(req, res) => {
    const {id} = req.params;
    const { conexion } = require('../lib/passport');
    const{ noserie, marca, tipo, noinv, monitor, teclado, mouse } = req.body;   
        try{
            await  conexion.query('UPDATE LABORATORIO.PC SET(noserie, noinv, marca, tipo, monitor, teclado, mouse, area) = ($1, $2, $3, $4, $5, $6, $7) WHERE NOSERIE = $8', [noserie, noinv, marca, tipo, monitor, teclado, mouse, area, id]);
            req.flash('exito', 'Dispositivo editado con exito');
            res.redirect('/inventarios/listar_equipos');
        } catch (error) {
            req.flash('danger', '')
        }
       
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
    const consulta = await conexion.query('SELECT * FROM LABORATORIO.ESTUDIANTE WHERE NOCONTROL = $1', [nocontrol]);
    const resultado = consulta.rows;
    if (resultado.length > 0) {
        req.flash('danger', 'Ya existe un estudiante registrado con este número de control');
    } else {
        try{
            await conexion.query('INSERT INTO LABORATORIO.estudiante values ($1, $2, $3, $4, $5, $6, $7)', [nocontrol, nombre, apellidop, apellidom, idcarrera, semestre, status]);
            req.flash('exito', 'Alumno agregado con exito');
        } catch (error) {
            req.flash('danger', 'Error: ' + error.message);
        }
    }
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
    try{
        await conexion.query('DELETE FROM LABORATORIO.ESTUDIANTE WHERE NOCONTROL = $1', [id]);
        req.flash('exito', 'Alumno eliminado con éxito');
    } catch (error){
        req.flash('danger', 'Error al eliminar registro: ' + error.message);
    }
    
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
    const { conexion } = require('../lib/passport');
    const {id} = req.params;
    const { nocontrol, nombre, apellidop, apellidom, carrera, semestre, status } = req.body;
    //const consulta = await conexion.query('SELECT * FROM LABORATORIO.ESTUDIANTE WHERE NOCONTROL = $1', [id]);
    //const resultado = consulta.rows;
    //if (resultado.length > 0) {
    //    req.flash('danger', 'Ya existe un estudiante registrado con este número de control');
    //} else {
        try{
            //UPDATE weather SET (temp_lo, temp_hi, prcp) = (temp_lo+1, temp_lo+15, DEFAULT) WHERE city = 'San Francisco' AND date = '2003-07-03';
            await  conexion.query('UPDATE LABORATORIO.ESTUDIANTE SET (nocontrol, nombre, apellidop, apellidom, idcarrera, semestre, status) = ($1,$2,$3,$4,$5,$6,$7) WHERE NOCONTROL = $8',
             [nocontrol, nombre, apellidop, apellidom, carrera, semestre, status, id]);
            req.flash('exito', 'Alumno agregado con éxito');
        } catch (error){
            req.flash('danger', 'Error al editar registro: ' + error.message);
        }
        res.redirect('/inventarios/alumnos');
    //}
});

router.get('/agregar_periferico', isLoggedIn,  (req, res) => {
    res.render('inventarios/agregar_periferico')
});

router.post('/agregar_periferico', isLoggedIn, async(req, res) => {
    const{ noserie, noinv, tipo, marca, estado } = req.body;
    const { conexion } = require('../lib/passport');
    const consulta = await conexion.query('select * from laboratorio.insumos where noserie = $1 or noinv = $2', [noserie, noinv])
    const resultado = consulta.rows;
    if (resultado.length > 0) {
        req.flash('danger', 'Error: Existen perifericos registrados con datos similares');
        res.redirect('/inventarios/agregar_periferico');
    } else{ 
        try{
            await conexion.query('INSERT INTO LABORATORIO.insumos values ($1, $2, $3, $4, $5)', [noserie, noinv, tipo, marca, estado]);
            req.flash('exito', 'Periferico agregado con exito');
        }catch (error){
            req.flash('danger', 'Error al insertar registro: ' + error.message);
        }
        res.redirect('/inventarios/listar_perifericos');
    }
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
    try{
        await conexion.query('DELETE FROM LABORATORIO.INSUMOS WHERE noserie = $1', [id]);
        req.flash('exito', 'Periferico eliminado con éxito');
    } catch (e) {
        req.flash('Error: ', e.message);
    }
    res.redirect('/inventarios/listar_perifericos');
});

router.get('/listar_perifericos/editar/:id', isLoggedIn,  async(req, res) => {
    const { conexion } = require('../lib/passport');
    const {id} = req.params;
    const perifericos1 = await conexion.query('SELECT * FROM LABORATORIO.INSUMOS WHERE noserie = $1', [id]);
    const perifericos = perifericos1.rows;
    res.render('inventarios/editar_periferico', {periferico: perifericos[0]});
});

router.post('/listar_perifericos/editar/:id', isLoggedIn,  async(req, res) => {
    const {id} = req.params;
    const { noserie, noinv, tipo, marca, estado } = req.body;
    const { conexion } = require('../lib/passport');
    try{
        await  conexion.query('UPDATE LABORATORIO.INSUMOS SET(noserie, noinv, tipo, marca, estado) = ($1, $2, $3, $4, $5) WHERE noserie = $6', [noserie, noinv, tipo, marca, estado, id]);
        req.flash('exito', 'Insumo editado con éxito');
    } catch (error){
        req.flash('danger', 'Error al editar registro: ' + error.message);
    }
    res.redirect('/inventarios/listar_perifericos');
});

//Dispositivos extra
router.get('/nuevo_dispositivoaux', isLoggedIn,  (req, res) => {
    res.render('inventarios/agregar_dispositivo')
});

router.post('/nuevo_dispositivoaux', isLoggedIn, async(req, res) => {
    const { conexion } = require('../lib/passport');
    const{ noserie, nombre, marca, tipo, descripcion, noinv } = req.body;
    const consulta = await conexion.query('select * from LABORATORIO.DISPOSITIVO where noserie = $1 or noinv = $2', [noserie, noinv]);
    const resultado = consulta.rows;
    if (resultado.length > 0) {
        req.flash('danger', 'Error: Existen registros con datos similares');
    } else {
        try{
            await conexion.query('INSERT INTO LABORATORIO.DISPOSITIVO values ($1, $2, $3, $4, $5, $6)', [noserie, nombre, marca, tipo, descripcion, noinv]);
            req.flash('exito', 'dispositivo agregado con exito');
        } catch (error){
            req.flash('danger', 'Error: ' + error.message);
        }
        res.redirect('/inventarios/listar_dispositivos');
    }
});

router.get('/listar_dispositivos', isLoggedIn, async (req, res) => {
    const { conexion } = require('../lib/passport');
    const equipos1 = await conexion.query('SELECT * FROM LABORATORIO.DISPOSITIVO');
    const equipos = equipos1.rows;
    console.log(equipos);
    res.render('inventarios/listar_dispositivos', { equipos });
});

router.get('/listar_dispositivos/eliminar/:id',  isLoggedIn, async (req, res) => {
    const {id} = req.params;
    const { conexion } = require('../lib/passport');
    try{
        await conexion.query('DELETE FROM LABORATORIO.DISPOSITIVO WHERE noserie = $1', [id]);
        req.flash('exito', 'Dispositivo eliminado con éxito');
    } catch (e) {
        req.flash('danger', 'Error: ' + e.message);
    }
    res.redirect('/inventarios/listar_dispositivos');
});

router.get('/listar_dispositivos/editar/:id', isLoggedIn,  async(req, res) => {
    const { conexion } = require('../lib/passport');
    const {id} = req.params;
    const perifericos1 = await conexion.query('SELECT * FROM LABORATORIO.DISPOSITIVO WHERE noserie = $1', [id]);
    const perifericos = perifericos1.rows;
    res.render('inventarios/editar_dispositivo', {dispositivo: perifericos[0]});
});

router.post('/listar_dispositivos/editar/:id', isLoggedIn,  async(req, res) => {
    const {id} = req.params;
    const { noserie, nombre, marca, tipo, descripcion, noinv } = req.body;
    const { conexion } = require('../lib/passport');
    try{
        await  conexion.query('UPDATE LABORATORIO.DISPOSITIVO SET noserie = $1, nombre = $2, marca = $3, tipo = $4, descripcion = $5, noinv = $6 WHERE noserie = $7', [noserie, nombre, marca, tipo, descripcion, noinv, id]);
        req.flash('exito', 'Dispositivo editado con éxito');
    } catch (error){
        req.flash('danger', 'Error al editar registro: ' + error.message);
    }
    res.redirect('/inventarios/listar_dispositivos');
});

module.exports = router;