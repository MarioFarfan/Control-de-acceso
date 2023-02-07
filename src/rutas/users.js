const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../lib/auth');

router.get('/nuevo_personal', isLoggedIn, async (req, res) => {
    const { conexion } = require('../lib/passport');
    const consulta = await conexion.query('Select * from laboratorio.departamento');
    const departamentos = consulta.rows;
    res.render('practicas/nuevo_profesor', {departamentos} );
});

router.post('/nuevo_personal', isLoggedIn, async (req, res) => {
    const { conexion } = require('../lib/passport');
    const { notarjeta, nombre, apellidop, apellidom, iddepto, tipo, user, pass, puesto } = req.body;
    try{
        await conexion.query('INSERT INTO laboratorio.personal values ($1, $2, $3, $4, $5, $6)', [notarjeta, nombre, apellidop, apellidom, iddepto, tipo]);
        if(tipo!='ADMINISTRATIVO')
        {
            await conexion.query('CREATE USER '+user+' PASSWORD \''+pass+'\' nosuperuser nocreatedb nocreaterole inherit login;');
            let grupo;
            if(tipo=='PERSONAL')
            {
                switch (puesto)
                {
                    case "GENERAL" : grupo = "admingeneral";
                    break;
                    case "ENCARGADO" : grupo = "encargado";
                    break;
                    case "AUXILIAR": grupo = "auxiliar";
                    break;
                }
            } 
            //
            if(tipo=="DOCENTE")
            {
                grupo = "docente";
            }
            await conexion.query('GRANT '+grupo+' to '+user+";");
        }
        req.flash('exito', 'Registro agregado con éxito');
        res.redirect('/usuarios/personal_registrado');
    } catch(error) {
        req.flash('danger', 'Error al agregar nuevo registro: ' + error.message);
        res.redirect('/usuarios/nuevo_personal');
    }
    
});

router.get('/personal_registrado', isLoggedIn, async (req, res) => {
    const { conexion } = require('../lib/passport');
    const consulta1 = await conexion.query('select * from laboratorio.personal inner join LABORATORIO.departamento on personal.iddepto = departamento.iddepto');
    const consulta2 = await conexion.query('select * from laboratorio.departamento');
    const personal = consulta1.rows;
    const departamentos = consulta2.rows;
    res.render('practicas/listar_personal', {personal, departamentos} );
});

router.get('/personal/eliminar/:id',  isLoggedIn, async (req, res) => {
    const { conexion } = require('../lib/passport');
    const {id} = req.params; 
    try{
        await conexion.query('DELETE FROM LABORATORIO.personal WHERE notarjeta = $1', [id]);
        req.flash('exito', 'registro eliminado con éxito');
    } catch (error){
        req.flash('danger', 'Error al eliminar, asegurate que el registro no se encuentre vinculado a otras tablas. Error: ' + error.message);
    }
    res.redirect('/usuarios/personal_registrado');
});

router.get('/personal/editar/:id',  isLoggedIn, async (req, res) => {
    const { conexion } = require('../lib/passport');
    const {id} = req.params; 
    const consulta1 = await conexion.query('select * from laboratorio.personal where notarjeta = $1', [id]);
    const consulta2 = await conexion.query('Select * from laboratorio.departamento');
    const profes = consulta1.rows;
    const departamentos = consulta2.rows;
    res.render('practicas/editar_personal', {personal: profes[0], departamentos});
});
router.post('/personal/editar/:id',  isLoggedIn, async (req, res) => {
    const { conexion } = require('../lib/passport');
    const {id} = req.params; 
    const { notarjeta, nombre, apellidop, apellidom, iddepto, tipo } = req.body;
    try{
        await  conexion.query('UPDATE personal SET ($1, $2, $3, $4, $5, $6) WHERE notarjeta = $7', [notarjeta, nombre, apellidop, apellidom, iddepto, tipo, id]);
        req.flash('exito', 'Profesor editado con éxito');
        res.redirect('/usuarios/personal_registrado');
    } catch (error) {
        req.flash('danger', 'Error al actualizar registro: ' + error.message);
    }
    
});

module.exports = router;