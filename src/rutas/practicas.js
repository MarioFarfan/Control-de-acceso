const express = require('express');
const router = express.Router();
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
    const consulta = await conexion.query('SELECT IDCARRERA, ALIAS, NOMBRE, DEPARTAMENTO FROM LABORATORIO.CARRERA');
    const carreras = consulta.rows;
    res.render('practicas/nuevamateria', { carreras });
});

router.post('/agregar_materia', isLoggedIn,  async (req, res ) => {
    const { conexion } = require('../lib/passport');
    const { clave, nombre, idcarrera } = req.body;
    await conexion.query('INSERT INTO LABORATORIO.MATERIA values ($1, $2, $3)', [clave, nombre, idcarrera ]);
    req.flash('exito', 'Materia agregada con éxito');
    res.redirect('/practicas/materias');
});

router.get('/materias', isLoggedIn,  async (req, res) => {
    const { conexion } = require('../lib/passport');
    const consulta1 = await conexion.query('SELECT IDCARRERA, ALIAS, NOMBRE, DEPARTAMENTO FROM LABORATORIO.CARRERA');
    const consulta2 = await conexion.query('SELECT CLAVE, MATERIA.NOMBRE AS MATERIA, CARRERA.NOMBRE AS CARRERA FROM LABORATORIO.MATERIA INNER JOIN LABORATORIO.CARRERA on carrera.idcarrera = materia.idcarrera');
    const carreras = consulta1.rows;
    const materias = consulta2.rows;
    res.render('practicas/listar_materias', { carreras, materias });
});


router.get('/materias/eliminar/:id',  isLoggedIn, async (req, res) => {
    const { conexion } = require('../lib/passport');
    const {id} = req.params;
    await conexion.query('DELETE FROM LABORATORIO.LABORATORIO.MATERIA WHERE CLAVEMATERIA = $1', [id]);
    req.flash('mensaje', 'Materia eliminada con éxito');
    res.redirect('/practicas/materias');
});

router.get('/carreras', isLoggedIn,  async (req, res) => {
    const { conexion } = require('../lib/passport');
    const consulta1 = await conexion.query('select idcarrera, nombre, alias from laboratorio.carrera');
    const consulta2 = await conexion.query('SELECT * FROM LABORATORIO.DEPARTAMENTO');
    const carreras = consulta1.rows;
    const departamentos = consulta2.rows;
    res.render('practicas/listar_carreras', { carreras, departamentos });
});

router.get('/agregar_carrera', isLoggedIn,  async (req, res) => {
    const { conexion } = require('../lib/passport');
    const consulta = await conexion.query('SELECT iddepto, departamento FROM LABORATORIO.departamento');
    const departamentos = consulta.rows;
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
    await conexion.query('INSERT INTO LABORATORIO.carrera VALUES ($1, $2, $3)', [idcarrera, carrera, iddepto]);
    req.flash('exito', 'Carrera agregada con éxito');
    res.redirect('/practicas/carreras');
});

router.get('/carreras/eliminar/:id',  isLoggedIn, async (req, res) => {
    const { conexion } = require('../lib/passport');
    const {id} = req.params; 
    await conexion.query('DELETE FROM LABORATORIO.CARRERA WHERE IDCARRERA = $1', [id]);
    req.flash('exito', 'Carrera eliminada con éxito');
    res.redirect('/practicas/carreras');
});

router.get('/departamentos', isLoggedIn,  async (req, res) => {
    const { conexion } = require('../lib/passport');
    const consulta = await conexion.query('SELECT * FROM LABORATORIO.departamento');
    const departamentos = consulta.rows;
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
    await conexion.query('INSERT INTO LABORATORIO.departamento VALUES ($1, $2, $3)', [iddepto, alias, departamento]);
    req.flash('exito', 'Registro agregado con éxito');
    res.redirect('/practicas/departamentos');
});

router.get('/departamentos/eliminar/:id', isLoggedIn, async (req, res) => {
    const { conexion } = require('../lib/passport');
    const {id} = req.params; 
    await conexion.query('DELETE FROM LABORATORIO.departamento WHERE iddepto = $1', [id]);
    req.flash('exito', 'registro eliminado con éxito');
    res.redirect('/practicas/departamentos');
});

router.get('/nueva_practica', isLoggedIn,  async (req, res) => {
    const { conexion } = require('../lib/passport');
    const consulta1 = await conexion.query('Select * from laboratorio.area');
    const consulta2 = await conexion.query('Select * from laboratorio.personal');
    const consulta3 = await conexion.query('Select * from laboratorio.software');
    const fecha = formatoFecha(new Date(), "dd/mm/yyyy");

    const areas = consulta1.rows;
    const personal = consulta2.rows;
    const programas = consulta3.rows;
    console.log(fecha);
    //const grupos = conexion.query('select * from laboratorio.grupo');
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
    const consulta = await conexion.query('select * from laboratorio.practica where idarea = $1 and horainicio = $2 and fecha = $3', [idarea, newPractica.horainicio, newPractica.fecha]);
    const cruce = consulta.rows;
    console.log(cruce);
    if (cruce.length > 0) {
        req.flash('danger', 'Esta area ya se encuentra apartada en el horario seleccionado');
        res.redirect('/practicas/nueva_practica');
    } else {
        console.log(newPractica);
        await conexion.query('INSERT INTO LABORATORIO.practica VALUES ($1, $2, $3, $4, $5)', [nombre, idgrupo, arr[0], arr[1], duracion, idarea, id_software]);
        req.flash('exito', 'Registro agregado con éxito');
        res.redirect('/practicas/practicas_registradas');
    }
    
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
    const consulta = await conexion.query('SELECT row_number() OVER (ORDER BY idarea) AS num, idarea, nombre, capacidad FROM LABORATORIO.area');
    const areas = consulta.rows;
    res.render('practicas/menuareas', {areas});
});

router.get('/listar/:idarea', isLoggedIn, async (req, res) => {
    const {idarea} = req.params;
    const { conexion } = require('../lib/passport');
    const consulta = await conexion.query(`select folio, practica.nombre as practicanombre, fecha, horainicio, duracion, software, 
    area.idarea, area.nombre as areanombre, grupo, noalumnos, personal.notarjeta, personal.nombre, personal.apellidop, personal.apellidom
    from laboratorio.practica inner join laboratorio.area on area.idarea = practica.idarea inner join laboratorio.grupo on grupo.idgrupo = practica.idgrupo 
    inner join laboratorio.personal on personal.notarjeta = grupo.notarjeta inner join laboratorio.software on practica.id_software = practica.id_software
    where practica.idarea = $1 order by horainicio;`, [idarea]);
    const practicas = consulta.rows;
    res.render('practicas/practicas_dia', {practicas});
});

module.exports = router;