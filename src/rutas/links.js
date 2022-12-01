const express = require('express');
const router = express.Router();

const pool = require('../database');


router.get('/agregar_dispositivo', (req, res) => {
    res.render('inventarios/agregar')
});

router.post('/agregar_dispositivo', async(req, res) => {
    const{ folioinv, noserie, marca, tipo, foliocpu, idarea } = req.body;
    const newDispositivo = {
        folioinv, 
        noserie, 
        marca, 
        tipo, 
        foliocpu, 
        idarea
    };  //validar los datos
    await pool.query('INSERT INTO EQUIPO set ?', [newDispositivo]);
    req.flash('mensaje', 'Dispositivo agregado con exito');
    res.redirect('/inventarios/listar_equipos');
});

router.get('/listar_equipos', async (req, res) => {
    const equipos = await pool.query('SELECT FOLIOINV, NOSERIE, MARCA, TIPO, FOLIOCPU, NOMBRE FROM EQUIPO INNER JOIN AREA ON EQUIPO.IDAREA = AREA.IDAREA');
    res.render('inventarios/listar_equipos', { equipos });
});

//Eliminar registros
router.get('/listar_equipos/eliminar/:id', async (req, res) => {
    const {id} = req.params;
    await pool.query('DELETE FROM EQUIPO WHERE FOLIOINV = ?', [id]);
    res.redirect('/inventarios/listar_equipos');
});

router.get('/usuarios/agregar_usuario', async (req, res) => {
    const departamentos = await pool.query('SELECT IDDEPTO, ALIAS FROM DEPARTAMENTO');
    res.renderer('usuarios/nvousuario', departamentos);
});

//Editar registros 
router.get('/listar_equipos/editar/:id', async(req, res) => {
    const {id} = req.params;
    const equipo = await pool.query('SELECT FOLIOINV, NOSERIE, MARCA, TIPO, FOLIOCPU, NOMBRE as AREA FROM EQUIPO INNER JOIN AREA ON EQUIPO.IDAREA = AREA.IDAREA WHERE FOLIOINV = ?', [id]);
    res.render('inventarios/editar', {equipo: equipo[0]});
});

router.post('/listar_equipos/editar/:id', async(req, res) => {
    const {id} = req.params;
    const{ folioinv, noserie, marca, tipo, foliocpu, idarea } = req.body;
    const newDispositivo = {
        folioinv, 
        noserie, 
        marca, 
        tipo, 
        foliocpu, 
        idarea
    };

    await  pool.query('UPDATE EQUIPO SET ? WHERE FOLIOINV = ?', [newDispositivo, folioinv]);
    res.redirect('/listar_equipos');
});

//  OPERACIONES PARA ALUMNOS, LISTAR, AGREGAR, EDITAR Y ELIMIAR
router.get('/usuarios/agregar_alumno', async (req, res) => {
    const carreras = await pool.query('SELECT IDCARRERA, CARRERA FROM CARRERA');
    res.render('usuarios/agregar_alumno',{carreras});
}); 

router.post('/usuarios/agregar_alumno', async (req, res ) => {
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

router.get('/alumnos', async (req, res) => {
    const alumnos = await pool.query('SELECT NOCONTROL, NOMBRE_AL, AP_PAT, AP_MAT, CARRERA, SEMESTRE, STATUS  FROM ALUMNO INNER JOIN CARRERA ON ALUMNO.IDCARRERA = CARRERA.IDCARRERA');
    const carreras = await pool.query('SELECT IDCARRERA, CARRERA FROM CARRERA');
    
    res.render('usuarios/listar_alumnos', { alumnos, carreras });
});

//Eliminar registros
router.get('/alumnos/eliminar/:id', async (req, res) => {
    const {id} = req.params;
    await pool.query('DELETE FROM ALUMNO WHERE NOCONTROL = ?', [id]);
    res.redirect('/inventarios/alumnos');
});

//Editar alumnos
router.get('/alumnos/editar/:id', async(req, res) => {
    const {id} = req.params;
    const alumnos = await pool.query('SELECT * FROM ALUMNO WHERE NOCONTROL = ?', [id]);
    const carreras = await pool.query('SELECT IDCARRERA, CARRERA FROM CARRERA');
    res.render('usuarios/editar_alumno', {carreras, alumno: alumnos[0]});
});

router.post('/alumnos/editar/:id', async(req, res) => {
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

    await  pool.query('UPDATE ALUMNO SET ? WHERE NOCONTROL = ?', [newAlumno, id]);
    res.redirect('/inventarios/alumnos');
});




module.exports = router;