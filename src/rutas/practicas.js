const express = require('express');
const router = express.Router();

//const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

function formatoFecha(fecha, formato) {
    const map = {
        dd: fecha.getDate(),
        mm: fecha.getMonth() + 1,
        yy: fecha.getFullYear().toString().slice(-2),
        yyyy: fecha.getFullYear()
    }

    return formato.replace(/dd|mm|yy|yyy/gi, matched => map[matched])
}

router.get('/agregar_materia', isLoggedIn,  async (req, res) => {
    const { conexion } = require('../lib/passport');
    const carreras = await conexion.query('SELECT IDCARRERA, ALIAS, NOMBRE, DEPARTAMENTO FROM CARRERA');
    res.render('practicas/nuevamateria', { carreras });
});

router.post('/agregar_materia', isLoggedIn,  async (req, res ) => {
    const { conexion } = require('../lib/passport');
    const { clavemat, nombremat, idcarrera, reticula } = req.body;
    const newMateria = {
        clavemateria: clavemat, 
        nombremat, 
        idcarrera, 
        reticula
    }
    await conexion.query('INSERT INTO MATERIA set ?', [newMateria]);
    req.flash('exito', 'Materia agregada con éxito');
    res.redirect('/practicas/materias');
});

router.get('/materias', isLoggedIn,  async (req, res) => {
    const { conexion } = require('../lib/passport');
    const carreras = await conexion.query('SELECT IDCARRERA, ALIAS, NOMBRE, DEPARTAMENTO FROM CARRERA');
    const materias = await conexion.query('SELECT CLAVE, MATERIA.NOMBRE, CARRERA.NOMBRE FROM MATERIA INNER JOIN CARRERA on carrera.idcarrera = materia.idcarrera');
    
    res.render('practicas/listar_materias', { carreras, materias });
});


router.get('/materias/eliminar/:id',  isLoggedIn, async (req, res) => {
    const { conexion } = require('../lib/passport');
    const {id} = req.params;
    await conexion.query('DELETE FROM MATERIA WHERE CLAVEMATERIA = ?', [id]);
    req.flash('mensaje', 'Materia eliminada con éxito');
    res.redirect('/practicas/materias');
});

router.get('/carreras', isLoggedIn,  async (req, res) => {
    const { conexion } = require('../lib/passport');
    const carreras = await conexion.query('select idcarrera, nombre, alias from carrera inner join departamento');
    const departamentos = await conexion.query('SELECT * FROM DEPARTAMENTO');
    
    res.render('practicas/listar_carreras', { carreras, departamentos });
});

router.get('/agregar_carrera', isLoggedIn,  async (req, res) => {
    const { conexion } = require('../lib/passport');
    const departamentos = await conexion.query('SELECT iddepto, departamento FROM departamento');
    res.render('practicas/nuevacarrera', { departamentos });
});

router.post('/agregar_carrera', isLoggedIn,  async (req, res ) => {
    const { conexion } = require('../lib/passport');
    const { idcarrera, carrera, iddepto } = req.body;
    const newCarrera = {
        idcarrera, 
        carrera, 
        iddepto
    }
    await conexion.query('INSERT INTO carrera set ?', [newCarrera]);
    req.flash('exito', 'Carrera agregada con éxito');
    res.redirect('/practicas/carreras');
});

router.get('/carreras/eliminar/:id',  isLoggedIn, async (req, res) => {
    const { conexion } = require('../lib/passport');
    const {id} = req.params; 
    await conexion.query('DELETE FROM CARRERA WHERE IDCARRERA = ?', [id]);
    req.flash('exito', 'Carrera eliminada con éxito');
    res.redirect('/practicas/carreras');
});

router.get('/departamentos', isLoggedIn,  async (req, res) => {
    const { conexion } = require('../lib/passport');
    const departamentos = await conexion.query('SELECT * FROM departamento');
    res.render('practicas/listar_departamentos', { departamentos });
});

router.get('/agregar_departamento', isLoggedIn,  async (req, res) => {
    const { conexion } = require('../lib/passport');
    res.render('practicas/nuevodepartamento');
});

router.post('/agregar_departamento', isLoggedIn,  async (req, res ) => {
    const { conexion } = require('../lib/passport');
    const { iddepto, alias, departamento } = req.body;
    const newDepto = {
        iddepto,
        alias,
        departamento
    }
    await conexion.query('INSERT INTO departamento set ?', [newDepto]);
    req.flash('exito', 'Registro agregado con éxito');
    res.redirect('/practicas/departamentos');
});

router.get('/departamentos/eliminar/:id', isLoggedIn, async (req, res) => {
    const { conexion } = require('../lib/passport');
    const {id} = req.params; 
    await conexion.query('DELETE FROM departamento WHERE iddepto = ?', [id]);
    req.flash('exito', 'registro eliminado con éxito');
    res.redirect('/practicas/departamentos');
});

<<<<<<< HEAD
router.get('/nueva_practica', async (req, res) => {
=======
router.get('/nueva_pactica', isLoggedIn,  async (req, res) => {
>>>>>>> 30b300c95c97459f33c1489519057129c11fd29f
    const { conexion } = require('../lib/passport');
    const areas = await conexion.query('Select * from area');
    const personal = await conexion.query('Select * from personal');
    const programas = await conexion.query('Select * from software');
    const fecha = formatoFecha(new Date(), "dd/mm/yyyy");
    console.log(fecha);
    //const grupos = conexion.query('select * from grupo');
    res.render('practicas/nueva_practica', {areas, personal, programas} );
});

<<<<<<< HEAD
router.post('/nueva_practica', async (req, res) => {
=======
router.post('/nueva_pactica', isLoggedIn, async (req, res) => {
>>>>>>> 30b300c95c97459f33c1489519057129c11fd29f
    const { conexion } = require('../lib/passport');
    const { nombre, idgrupo, fecha, duracion, idarea, id_software } = req.body;
    let arr = fecha.split('T');
    const newPractica = {
        nombre,
        idgrupo,
        fecha: arr[0],
        horainicio: arr[1],
        duracion,
        idarea,
        id_software
    }    
    console.log(newPractica);
    await conexion.query('INSERT INTO practica set ?', [newPractica]);
    req.flash('exito', 'Registro agregado con éxito');
    res.redirect('/practicas/practicas_registradas');
});

router.get('/practicas_registradas', isLoggedIn, async (req, res) => {
    const { conexion } = require('../lib/passport');
    const areas = await conexion.query('SELECT * FROM area');
    const practicas = await conexion.query('SELECT practica.folio, practica.nombre as practicaname, practica.idgrupo, fecha, horainicio, duracion, practica.idarea, area.nombre as area, software.software FROM practica inner join area on practica.idarea=area.idarea inner join software on software.id_software = practica.id_software order by horainicio');
    res.render('practicas/listar_practicas', {areas, practicas});
});

module.exports = router;