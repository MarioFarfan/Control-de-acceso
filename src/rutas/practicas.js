const express = require('express');
const router = express.Router();

const pool = require('../database');
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

router.post('/materias', isLoggedIn, isAux, async (req, res) => {
    const {mat, carr } = req.body;
    console.log('datos del formulario' + mat + carr);
    const carreras = await pool.query('SELECT IDCARRERA, CARRERA FROM CARRERA where idcarrera = ?', [carr]);
    const materias = await pool.query('SELECT CLAVEMATERIA, NOMBREMAT, CARRERA, RETICULA FROM MATERIA INNER JOIN CARRERA on carrera.idcarrera = materia.idcarrera');
    
    res.render('practicas/listar_materias', { carreras, materias });
});

module.exports = router;