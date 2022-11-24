const express = require('express');
const router = express.Router();

const pool = require('../database');


router.get('/inventarios/agregar_dispositivo', (req, res) => {
    res.render('inventarios/agregar')
});

router.post('/inventarios/agregar_dispositivo', async(req, res) => {
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
    res.redirect('/links/inventarios');
});

router.get('/inventarios', async (req, res) => {
    const equipos = await pool.query('SELECT FOLIOINV, NOSERIE, MARCA, TIPO, FOLIOCPU, NOMBRE FROM EQUIPO INNER JOIN AREA ON EQUIPO.IDAREA = AREA.IDAREA');
    res.render('inventarios/listar_equipos', { equipos });
});

//Eliminar registros
router.get('/inventarios/eliminar/:id', async (req, res) => {
    const {id} = req.params;
    await pool.query('DELETE FROM EQUIPO WHERE FOLIOINV = ?', [id]);
    res.redirect('/links/inventarios');
});
router.get('/usuarios/agregar_usuario', async (req, res) => {
    const departamentos = await pool.query('SELECT IDDEPTO, ALIAS FROM DEPARTAMENTO');
    console.log(departamentos);
    res.renderer('usuarios/nvousuario', departamentos);
});

//Editar registros 
router.get('/inventarios/editar/:id', async(req, res) => {
    const {id} = req.params;
    const equipo = await pool.query('SELECT FOLIOINV, NOSERIE, MARCA, TIPO, FOLIOCPU, NOMBRE as AREA FROM EQUIPO INNER JOIN AREA ON EQUIPO.IDAREA = AREA.IDAREA WHERE FOLIOINV = ?', [id]);
    console.log('encontrado ', equipo[0]);
    res.render('inventarios/editar', {equipos: equipo[0]});
    const equipos = await pool.query('SELECT FOLIOINV, NOSERIE, MARCA, TIPO, FOLIOCPU, NOMBRE as AREA FROM EQUIPO INNER JOIN AREA ON EQUIPO.IDAREA = AREA.IDAREA WHERE FOLIOINV = ?', [id]);
    console.log('encontrado ', equipos[0]);
    res.render('inventarios/editar', {equipo: equipos[0]});
});


//Editar registros 
router.get('/inventarios/editar/:id', async(req, res) => {
    const {id} = req.params;
    const equipo = await pool.query('SELECT FOLIOINV, NOSERIE, MARCA, TIPO, FOLIOCPU, NOMBRE as AREA FROM EQUIPO INNER JOIN AREA ON EQUIPO.IDAREA = AREA.IDAREA WHERE FOLIOINV = ?', [id]);
    console.log('encontrado ', equipo[0]);
    res.render('inventarios/editar', {equipos: equipo[0]});
    const equipos = await pool.query('SELECT FOLIOINV, NOSERIE, MARCA, TIPO, FOLIOCPU, NOMBRE as AREA FROM EQUIPO INNER JOIN AREA ON EQUIPO.IDAREA = AREA.IDAREA WHERE FOLIOINV = ?', [id]);
    console.log('encontrado ', equipos[0]);
    res.render('inventarios/editar', {equipo: equipos[0]});
});

router.post('/inventarios/editar/:id', async(req, res) => {
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
    res.redirect('/links/inventarios');
});

   
router.get('/usuarios/agregar_alumno', async (req, res) => {
    const carreras = await pool.query('SELECT IDCARRERA, CARRERA FROM CARRERA');

    //const alumno = { nocontrol, nombrepersona, ap_p, ap_m, tipopersona, carrera, semestre } = req.body;
    //await pool.query('INSERT INTO ALUMNO set ?', [alumno]);

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
    res.redirect('/links/alumnos');
});

router.get('/alumnos', async (req, res) => {
    const alumnos = await pool.query('SELECT NOCONTROL, NOMBRE_AL, AP_PAT, AP_MAT, CARRERA, SEMESTRE, STATUS  FROM ALUMNO INNER JOIN CARRERA');
    const carreras = await pool.query('SELECT IDCARRERA, CARRERA FROM CARRERA');
    
    res.render('usuarios/listar_alumnos', { alumnos, carreras });
});

module.exports = router;