const express = require('express');
const router = express.Router();

//const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

router.get('/nuevo_personal', isLoggedIn, async (req, res) => {
    const { conexion } = require('../lib/passport');
    const departamentos = await conexion.query('Select * from departamento');
    res.render('practicas/nuevo_profesor', {departamentos} );
});

router.post('/nuevo_personal', isLoggedIn, async (req, res) => {
    const { conexion } = require('../lib/passport');
    const { notarjeta, nombre, apellidop, apellidom, iddepto, tipo } = req.body;
    const newProfe = {
        notarjeta,
        nombre,
        apellidop,
        apellidom,
        iddepto,
        tipo,
    }    
    await conexion.query('INSERT INTO personal set ?', [newProfe]);
    req.flash('exito', 'Registro agregado con éxito');
    res.redirect('/usuarios/personal_registrado');
});

router.get('/personal_registrado', isLoggedIn, async (req, res) => {
    const { conexion } = require('../lib/passport');
    const personal = await conexion.query('select * from personal inner join departamento on personal.iddepto = departamento.iddepto')
    const departamentos = await conexion.query('select * from departamento');
    res.render('practicas/listar_personal', {personal, departamentos} );
});

router.get('/personal/eliminar/:id',  isLoggedIn, async (req, res) => {
    const { conexion } = require('../lib/passport');
    const {id} = req.params; 
    await conexion.query('DELETE FROM personal WHERE notarjeta = ?', [id]);
    req.flash('exito', 'registro eliminado con éxito');
    res.redirect('/usuarios/personal_registrado');
});

router.get('/personal/editar/:id',  isLoggedIn, async (req, res) => {
    const { conexion } = require('../lib/passport');
    const {id} = req.params; 
    const profes = await conexion.query('select * from personal where notarjeta = ?', [id]);
    const departamentos = await conexion.query('Select * from departamento');
    res.render('practicas/editar_personal', {personal: profes[0], departamentos});
});
router.post('/personal/editar/:id',  isLoggedIn, async (req, res) => {
    const { conexion } = require('../lib/passport');
    const {id} = req.params; 
    const { notarjeta, nombre, apellidop, apellidom, iddepto, tipo } = req.body;
    const newProfe = {
        notarjeta,
        nombre,
        apellidop,
        apellidom,
        iddepto,
        tipo,
    } 
    await  conexion.query('UPDATE personal SET ? WHERE notarjeta = ?', [newProfe, id]);
    req.flash('exito', 'Profesor editado con éxito');
    res.redirect('/usuarios/personal_registrado');
});

module.exports = router;