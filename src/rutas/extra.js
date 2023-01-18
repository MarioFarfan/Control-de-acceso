const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../lib/auth');


router.get('/agregar_software', isLoggedIn,  (req, res) => {
    res.render('extras/agregar_software')
});

router.post('/agregar_software', isLoggedIn, async(req, res) => {
    const { conexion } = require('../lib/passport');
    const{ software, tipolicencia, licencia } = req.body;
    const newInsert = { software, tipolicencia, licencia};  //validar los datos
    await conexion.query('INSERT INTO SOFTWARE set ?', [newInsert]);
    req.flash('mensaje', 'Software agregado con exito');
    res.redirect('/extra/listar_software');
});

router.get('/listar_software', isLoggedIn, async (req, res) => {
    const { conexion } = require('../lib/passport');
    const soft = await conexion.query('SELECT * FROM SOFTWARE');
    res.render('extras/listar_software', {soft});
});

//Eliminar registros
router.get('/listar_software/eliminar/:id', isLoggedIn,  async (req, res) => {
    const { conexion } = require('../lib/passport');
    const {id} = req.params;
    await conexion.query('DELETE FROM SOFTWARE WHERE ID_SOFTWARE = (?)', [id]);
    req.flash('mensaje', 'Software eliminado con exito');
    const soft = await conexion.query('SELECT * FROM SOFTWARE');
    res.render('extras/listar_software', {soft});
});

//Editar registros 
router.get('/listar_software/editar/:id', isLoggedIn,  async(req, res) => {
    const {id} = req.params;
    const { conexion } = require('../lib/passport');
    const equipo = await conexion.query('SELECT * FROM SOFTWARE WHERE ID_SOFTWARE = ?', [id]);
    res.render('extras/editar_software', {equipo: equipo[0]});
});

router.post('/listar_software/editar/:id', isLoggedIn,  async(req, res) => {
    const {id} = req.params;
    const { conexion } = require('../lib/passport');
    const{ software, tipolicencia, licencia } = req.body;
    const newInsert = { software, tipolicencia, licencia}; 

    await  conexion.query('UPDATE SOFTWARE SET ? WHERE ID_SOFTWARE = ?', [newInsert, id]);
    req.flash('mensaje', 'Software editado con exito');
    const soft = await conexion.query('SELECT * FROM SOFTWARE');
    res.render('extras/listar_software', {soft});
});

module.exports = router;