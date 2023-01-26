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

router.get('/nueva_practica', isLoggedIn,  async (req, res) => {
    const { conexion } = require('../lib/passport');
    const areas = await conexion.query('Select * from area');
    const personal = await conexion.query('Select * from personal');
    const programas = await conexion.query('Select * from software');
    const fecha = formatoFecha(new Date(), "dd/mm/yyyy");
    console.log(fecha);
    //const grupos = conexion.query('select * from grupo');
    res.render('practicas/nueva_practica', {areas, personal, programas} );
});

router.post('/nueva_practica', isLoggedIn, async (req, res) => {
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
    const cruce = await conexion.query('select * from practica where idarea = ? and horainicio = ? and fecha = ?', [idarea, newPractica.horainicio, newPractica.fecha]);
    console.log(cruce);
    if (cruce.length > 0) {
        req.flash('danger', 'Esta area ya se encuentra apartada en el horario seleccionado');
        res.redirect('/practicas/nueva_practica');
    } else {
        console.log(newPractica);
        await conexion.query('INSERT INTO practica set ?', [newPractica]);
        req.flash('exito', 'Registro agregado con éxito');
        res.redirect('/practicas/practicas_registradas');
    }
    
});

router.get('/practicas_registradas', isLoggedIn, async (req, res) => {
    const { conexion } = require('../lib/passport');
    const areas = await conexion.query('SELECT * FROM area');
    const practicasweek = await conexion.query(`SELECT folio, practica.nombre as practicaname, practica.idgrupo, fecha, horainicio, duracion, practica.idarea, area.nombre as area, software.software 
    FROM practica inner join area on practica.idarea=area.idarea 
    inner join software on software.id_software = practica.id_software 
    WHERE yearweek(fecha) = yearweek(CURDATE()) AND practica.idarea = 'USUARIOS1'
    order by fecha;`);

    const practicasmonth = await conexion.query(`SELECT folio, practica.nombre as practicaname, practica.idgrupo, fecha, horainicio, duracion, practica.idarea, area.nombre as area, software.software 
    FROM practica inner join area on practica.idarea=area.idarea 
    inner join software on software.id_software = practica.id_software 
    WHERE MONTH(fecha) = MONTH(CURDATE()) AND practica.idarea = 'USUARIOS1'
    order by fecha;`);

    const practicasday = await conexion.query(`SELECT folio, practica.nombre as practicaname, practica.idgrupo, fecha, horainicio, duracion, practica.idarea, area.nombre as area, software.software 
    FROM practica inner join area on practica.idarea=area.idarea 
    inner join software on software.id_software = practica.id_software 
    WHERE fecha = CURDATE() AND practica.idarea = 'USUARIOS1'
    order by fecha;`);


    res.render('practicas/listar_practicas', {areas, practicasweek, practicasmonth, practicasday});
});

router.get('/practicas_registradas/:id', isLoggedIn, async (req, res) => {
    const {id} = req.params; 
    const { conexion } = require('../lib/passport');
    var selectedArea = req.params.selectedOption;
    console.log(id, selectedArea)

    res.render('practicas/listar_practicas', {area, selectedArea});
});

router.get('/gestion', isLoggedIn, async (req, res) => {
    res.render('practicas/menupracticas');
});

router.get('/listar', isLoggedIn, async (req, res) => {
    const { conexion } = require('../lib/passport');
    const areas = await conexion.query('SELECT @rownum:=@rownum+1 num,  idarea, nombre, capacidad FROM area, (SELECT @rownum:=0) r');
    res.render('practicas/menuareas', {areas});
});

router.get('/listar/:id', isLoggedIn, async (req, res) => {
    const {folio} = req.params;
    const { conexion } = require('../lib/passport');
    const practicas = await conexion.query('select * from practica');
    console.log(practicas);
    res.render('practicas/practicas_dia', {practicas});
});

module.exports = router;