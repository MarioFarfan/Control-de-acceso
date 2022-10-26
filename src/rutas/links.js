const express = require('express');
const router = express.Router();

const pool = require('../database');

router.get('/login', (req, res) => {
    res.render('inventarios/login')
});
router.post('/login', async(req, res) => {
    const { numcontrol, pass } = req.body;
    const user = {numcontrol, pass };
    usuario = await pool.query('SELECT * FROM USUARIO WHERE USUARIO = "?" AND CONTRASENIA = "?"', { numcontrol, pass});
    console.log(user);
    console.log('encontrado: ', usuario);
    res.send('Logeando');
});

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
    };
    await pool.query('INSERT INTO EQUIPO set ?', [newDispositivo]);
    //console.log(newDispositivo);
    res.redirect('/links/inventarios');
});

router.get('/inventarios', async (req, res) => {
    const equipos = await pool.query('SELECT FOLIOINV,NOSERIE, MARCA, TIPO, FOLIOCPU, DESCRIPCION FROM EQUIPO INNER JOIN AREA ON EQUIPO.IDAREA = AREA.IDAREA');
    res.render('inventarios/listar_equipos', { equipos });
});

//Buscar equipos
router.get('/inventarios/buscar', async (req, res) =>{
    const {campo, idarea} = req.body;
    console.log('barra busqueda:',campo, 'area:', idarea);
    const equipos = await pool.query('SELECT FOLIOINV, NOSERIE, MARCA, TIPO, FOLIOCPU, DESCRIPCION as AREA FROM EQUIPO INNER JOIN AREA ON EQUIPO.IDAREA = AREA.IDAREA WHERE FOLIOINV LIKE "%set ?%" or NOSERIE LIKE "%set ?%"or MARCA LIKE "%set ?%" or TIPO LIKE "%set ?%" or FOLIOCPU like "%set ?%"', [campo, campo, campo, campo, campo]);
    console.log(equipos);
    res.render('inventarios/listar_equipos', { equipos });
});
router.post('/inventarios/buscar', async (req, res) =>{

});


//editar equipos
router.get('/inventarios/editar/:id', async(req, res) => {
    const {id} = req.params;
    const equipo = await pool.query('SELECT FOLIOINV, NOSERIE, MARCA, TIPO, FOLIOCPU, DESCRIPCION as AREA FROM EQUIPO INNER JOIN AREA ON EQUIPO.IDAREA = AREA.IDAREA WHERE FOLIOINV = ?', [id]);
    console.log('encontrado ', equipo[0]);
    res.render('inventarios/editar', {equipos: equipo[0]});
});


//Eliminar registros
router.get('/inventarios/eliminar/:id', async (req, res) => {
    const {id} = req.params;
    await pool.query('DELETE FROM EQUIPO WHERE FOLIOINV = ?', [id]);
    res.redirect('/links/inventarios');
});

module.exports = router;