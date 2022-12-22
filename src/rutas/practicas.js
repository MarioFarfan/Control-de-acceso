const express = require('express');
const router = express.Router();

//const pool = require('../database');
const { isLoggedIn, isAux } = require('../lib/auth');

router.get('/agregar_materia', isLoggedIn, isAux, async (req, res) => {
    const carreras = await pool.query('SELECT IDCARRERA, CARRERA FROM CARRERA');
    res.render('practicas/nuevamateria', { carreras });
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
    res.redirect('/practicas/materias');
});

router.get('/materias', isLoggedIn, isAux, async (req, res) => {
    const carreras = await pool.query('SELECT IDCARRERA, CARRERA FROM CARRERA');
    const materias = await pool.query('SELECT CLAVEMATERIA, NOMBREMAT, CARRERA, RETICULA FROM MATERIA INNER JOIN CARRERA on carrera.idcarrera = materia.idcarrera');
    
    res.render('practicas/listar_materias', { carreras, materias });
});


router.get('/materias/eliminar/:id', isAux, isLoggedIn, async (req, res) => {
    const {id} = req.params;
    await pool.query('DELETE FROM MATERIA WHERE CLAVEMATERIA = ?', [id]);
    req.flash('mensaje', 'Materia eliminada con éxito');
    res.redirect('/practicas/materias');
});

router.get('/carreras', isLoggedIn, isAux, async (req, res) => {
    const carreras = await pool.query('select idcarrera, carrera, alias, departamento from carrera inner join departamento on carrera.iddepto = departamento.iddepto');
    const departamentos = await pool.query('SELECT * FROM DEPARTAMENTO');
    
    res.render('practicas/listar_carreras', { carreras, departamentos });
});

router.get('/agregar_carrera', isLoggedIn, isAux, async (req, res) => {
    const departamentos = await pool.query('SELECT iddepto, departamento FROM departamento');
    res.render('practicas/nuevacarrera', { departamentos });
});

router.post('/agregar_carrera', isLoggedIn, isAux, async (req, res ) => {
    const { idcarrera, carrera, iddepto } = req.body;
    const newCarrera = {
        idcarrera, 
        carrera, 
        iddepto
    }
    await pool.query('INSERT INTO carrera set ?', [newCarrera]);
    req.flash('exito', 'Carrera agregada con éxito');
    res.redirect('/practicas/carreras');
});

router.get('/carreras/eliminar/:id', isAux, isLoggedIn, async (req, res) => {
    const {id} = req.params; 
    await pool.query('DELETE FROM CARRERA WHERE IDCARRERA = ?', [id]);
    req.flash('exito', 'Carrera eliminada con éxito');
    res.redirect('/practicas/carreras');
});

router.get('/departamentos', isLoggedIn, isAux, async (req, res) => {
    const departamentos = await pool.query('SELECT * FROM departamento');
    
    res.render('practicas/listar_departamentos', { departamentos });
});

router.get('/agregar_departamento', isLoggedIn, isAux, async (req, res) => {
    res.render('practicas/nuevodepartamento');
});

router.post('/agregar_departamento', isLoggedIn, isAux, async (req, res ) => {
    const { iddepto, alias, departamento } = req.body;
    const newDepto = {
        iddepto,
        alias,
        departamento
    }
    await pool.query('INSERT INTO departamento set ?', [newDepto]);
    req.flash('exito', 'Registro agregado con éxito');
    res.redirect('/practicas/departamentos');
});

router.get('/departamentos/eliminar/:id', isAux, isLoggedIn, async (req, res) => {
    const {id} = req.params; 
    await pool.query('DELETE FROM departamento WHERE iddepto = ?', [id]);
    req.flash('exito', 'registro eliminado con éxito');
    res.redirect('/practicas/departamentos');
});

module.exports = router;