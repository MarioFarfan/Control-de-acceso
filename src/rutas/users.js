const express = require('express');
const router = express.Router();

//const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

router.get('/nuevo_personal', isLoggedIn, async (req, res) => {
    const { conexion } = require('../lib/passport');
    const consulta = await conexion.query('Select * from departamento');
    const departamentos = consulta.rows;
    res.render('practicas/nuevo_profesor', {departamentos} );
});

router.post('/nuevo_personal', isLoggedIn, async (req, res) => {
    const { conexion } = require('../lib/passport');
    const { notarjeta, nombre, apellidop, apellidom, iddepto, tipo } = req.body;
    await conexion.query('INSERT INTO personal values ($1, $2, $3, $4, $5, $6)', [notarjeta, nombre, apellidop, apellidom, iddepto, tipo]);
    req.flash('exito', 'Registro agregado con éxito');
    res.redirect('/usuarios/personal_registrado');
});

router.get('/personal_registrado', isLoggedIn, async (req, res) => {
    const { conexion } = require('../lib/passport');
    const consulta1 = await conexion.query('select * from personal inner join departamento on personal.iddepto = departamento.iddepto');
    const consulta2 = await conexion.query('select * from departamento');
    const personal = consulta1.rows;
    const departamentos = consulta2.rows;
    res.render('practicas/listar_personal', {personal, departamentos} );
});

router.get('/personal/eliminar/:id',  isLoggedIn, async (req, res) => {
    const { conexion } = require('../lib/passport');
    const {id} = req.params; 
    await conexion.query('DELETE FROM personal WHERE notarjeta = $1', [id]);
    req.flash('exito', 'registro eliminado con éxito');
    res.redirect('/usuarios/personal_registrado');
});

router.get('/personal/editar/:id',  isLoggedIn, async (req, res) => {
    const { conexion } = require('../lib/passport');
    const {id} = req.params; 
    const consulta1 = await conexion.query('select * from personal where notarjeta = $1', [id]);
    const consulta2 = await conexion.query('Select * from departamento');
    const profes = consulta1.rows;
    const departamentos = consulta2.rows;
    res.render('practicas/editar_personal', {personal: profes[0], departamentos});
});
router.post('/personal/editar/:id',  isLoggedIn, async (req, res) => {
    const { conexion } = require('../lib/passport');
    const {id} = req.params; 
    const { notarjeta, nombre, apellidop, apellidom, iddepto, tipo } = req.body;
    await  conexion.query('UPDATE personal SET ($1, $2, $3, $4, $5, $6) WHERE notarjeta = $7', [notarjeta, nombre, apellidop, apellidom, iddepto, tipo, id]);
    req.flash('exito', 'Profesor editado con éxito');
    res.redirect('/usuarios/personal_registrado');
});

module.exports = router;