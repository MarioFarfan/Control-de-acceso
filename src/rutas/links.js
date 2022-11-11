const { Router } = require('express');
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
    const equipos = await pool.query('SELECT FOLIOINV,NOSERIE, MARCA, TIPO, FOLIOCPU, DESCRIPCION FROM EQUIPO INNER JOIN AREA ON EQUIPO.IDAREA = AREA.IDAREA');
    res.render('inventarios/listar_equipos', { equipos });
});

router.post('/inventarios', async (req, res) =>{
    const {campo, idarea} = req.body;
    console.log('barra busqueda:',campo, 'area:', idarea);
    const equipos = await pool.query('SELECT FOLIOINV, NOSERIE, MARCA, TIPO, FOLIOCPU, DESCRIPCION as AREA FROM EQUIPO INNER JOIN AREA ON EQUIPO.IDAREA = AREA.IDAREA WHERE FOLIOINV LIKE "%set ?%" or NOSERIE LIKE "%set ?%"or MARCA LIKE "%set ?%" or TIPO LIKE "%set ?%" or FOLIOCPU like "%set ?%"', [campo, campo, campo, campo, campo]);
    //console.log(equipos);
    res.render('inventarios/listar_equipos', { equipos });
});

//Buscar equipos
router.get('/inventarios/buscar', async (req, res) =>{
    //res.redirect('/links/inventarios/buscar');
});
router.post('/inventarios/buscar', async (req, res) =>{
    console.log('hola');
    const {campo, idarea} = req.body;
    console.log('barra busqueda:',campo, 'area:', idarea);
    const equipos = await pool.query('SELECT FOLIOINV, NOSERIE, MARCA, TIPO, FOLIOCPU, DESCRIPCION as AREA FROM EQUIPO INNER JOIN AREA ON EQUIPO.IDAREA = AREA.IDAREA WHERE FOLIOINV LIKE "%set ?%" or NOSERIE LIKE "%set ?%"or MARCA LIKE "%set ?%" or TIPO LIKE "%set ?%" or FOLIOCPU like "%set ?%"', [campo, campo, campo, campo, campo]);
    //console.log(equipos);
    res.render('inventarios/listar_equipos', { equipos });
});

//Eliminar registros
router.get('/inventarios/eliminar/:id', async (req, res) => {
    const {id} = req.params;
    await pool.query('DELETE FROM EQUIPO WHERE FOLIOINV = ?', [id]);
    req.flash('mensaje', 'Dispositivo eliminado con exito');
    res.redirect('/links/inventarios');
});

//editar equipos
router.get('/inventarios/editar/:id', async(req, res) => {
    const {id} = req.params;
    const equipos = await pool.query('SELECT FOLIOINV, NOSERIE, MARCA, TIPO, FOLIOCPU, DESCRIPCION as AREA, AREA.IDAREA FROM EQUIPO INNER JOIN AREA ON EQUIPO.IDAREA = AREA.IDAREA WHERE FOLIOINV = ?', [id]);
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
    req.flash('mensaje', 'Dispositivo editado con exito');
    await  pool.query('UPDATE EQUIPO SET ? WHERE FOLIOINV = ?', [newDispositivo, folioinv]);
    res.redirect('/links/inventarios');
});


module.exports = router;