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
    try {
        await conexion.query('INSERT INTO LABORATORIO.MATERIA values ($1, $2, $3)', [clave, nombre, idcarrera ]);
        req.flash('exito', 'Materia agregada con éxito');
    } catch(error){
        req.flash('danger', 'Error al registrar materia, verifique que los datos sean validos y que la clave de la materia se única')
    }
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
    try{
        await conexion.query('DELETE FROM LABORATORIO.MATERIA WHERE CLAVE = $1', [id]);
        req.flash('exito', 'Materia eliminada con éxito');
    } catch (error){
        req.flash('danger', 'Error, no se puede eliminar: ' + error.message);
    }
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
    const { alias, nombre, departamento } = req.body;
    const consulta = await conexion.query('SELECT * from LABORATORIO.carrera where alias = $1 or nombre = $2', [alias, nombre]);
    const resultado = consulta.rows;
    if(resultado.length > 0){
        req.flash('danger', 'Error: Alunos datos estan duplicados con datos ya existentes');
    }
    else {
        try{
            await conexion.query('INSERT INTO LABORATORIO.carrera (alias, nombre, departamento) VALUES ($1, $2, $3)', [alias, nombre, departamento]);
            req.flash('exito', 'Carrera agregada con éxito');
        } catch (error){
            req.flash('danger', 'Error: ' + error.message);
        }
    }
    res.redirect('/practicas/carreras');
});

router.get('/carreras/eliminar/:id',  isLoggedIn, async (req, res) => {
    const { conexion } = require('../lib/passport');
    const {id} = req.params; 
    try{
        await conexion.query('DELETE FROM LABORATORIO.CARRERA WHERE IDCARRERA = $1', [id]);
        req.flash('exito', 'Carrera eliminada con éxito');
    } catch (error){
        req.flash('danger', 'Error al eliminar el registro: ' + error.message)
    }
    
    res.redirect('/practicas/carreras');
});

router.get('/departamentos', isLoggedIn,  async (req, res) => {
    const { conexion } = require('../lib/passport');
    const consulta = await conexion.query('SELECT * FROM LABORATORIO.departamento');
    const departamentos = consulta.rows;
    res.render('practicas/listar_departamentos', { departamentos });
});

router.get('/agregar_departamento', isLoggedIn,  async (req, res) => {
    res.render('practicas/nuevodepartamento');
});

router.post('/agregar_departamento', isLoggedIn,  async (req, res ) => {
    const { conexion } = require('../lib/passport');
    const { departamento } = req.body;
    const consulta = await conexion.query('select * from laboratorio.departamento where departamento = $1', [departamento]);
    const resultados = consulta.rows;
    if (resultados.length > 0) {
        req.flash('danger', 'Ya existe un departamento con este nombre');
    } else {
        await conexion.query('INSERT INTO LABORATORIO.departamento (departamento) VALUES ($1)', [ departamento]);
        req.flash('exito', 'Registro agregado con éxito');
    }
    res.redirect('/practicas/agregar_departamento');
});

router.get('/departamentos/eliminar/:id', isLoggedIn, async (req, res) => {
    const { conexion } = require('../lib/passport');
    const { id } = req.params; 
    try {
      await conexion.query('DELETE FROM LABORATORIO.departamento WHERE iddepto = $1', [id]);
      req.flash('exito', 'registro eliminado con éxito');
    } catch (error) {
      req.flash('danger', 'Error al eliminar el registro: ' + error.message);
    }
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
        try{
            await conexion.query('INSERT INTO LABORATORIO.practica (nombre, idgrupo, fecha, horainicio, duracion, idarea, id_software) VALUES ($1, $2, $3, $4, $5, $6, $7)', [nombre, idgrupo, arr[0], arr[1], duracion, idarea, id_software]);
            req.flash('exito', 'Registro agregado con éxito');
        } catch(error) {
            req.flash('danger', 'Error: ' + error.message);
        }
        
        res.redirect('/practicas/listar/:{{idarea}}');
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

router.get('/programar_practica', isLoggedIn,  async (req, res) => {
    const { conexion } = require('../lib/passport');
    const consulta1 = await conexion.query('Select * from laboratorio.area');
    const consulta2 = await conexion.query('Select * from laboratorio.personal');
    const consulta3 = await conexion.query('Select * from laboratorio.software');
    const consulta4 = await conexion.query(`select grupo.idgrupo, grupo.grupo, materia.clave, materia.nombre as materia, 
            personal.nombre as maestroname, personal.apellidop as maestroapellidop, 
            personal.apellidom as maestroapellidom
            from laboratorio.grupo inner join laboratorio.materia on grupo.clave = materia.clave
            inner join laboratorio.personal on personal.notarjeta = grupo.notarjeta`);
    const fecha = formatoFecha(new Date(), "dd/mm/yyyy");

    const areas = consulta1.rows;
    const personal = consulta2.rows;
    const programas = consulta3.rows;
    const grupos = consulta4.rows;
    console.log(personal);
    //const grupos = conexion.query('select * from laboratorio.grupo');
    res.render('practicas/programar_practica', {areas, personal, programas, grupos} );
});

router.post('/programar_practica', isLoggedIn,  async (req, res) => {
    const { conexion } = require('../lib/passport');
    const { nombre, idgrupo, dia, hora, duracion, idarea, id_software } = req.body;

    const consulta = await conexion.query('select * from laboratorio.practicaprogramada where idarea = $1 and dia = $2 and hora = $3', [idarea, dia, hora]);
    const cruce = consulta.rows;
    console.log(cruce);
    if (cruce.length > 0) {
        req.flash('danger', 'Esta area ya se encuentra apartada en el horario seleccionado');
        res.redirect('/practicas/nueva_practica');
    } else {
        try{
            await conexion.query('INSERT INTO LABORATORIO.practicaprogramada (nombre, idgrupo, dia, hora, duracion, idarea, id_software) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [nombre, idgrupo, dia, hora, duracion, idarea, id_softwares]);
            req.flash('exito', 'Registro agregado con éxito');
            res.redirect('/practicas/listar/:{{idarea}}');
        } catch (error) {
            req.flash('danger', 'Error: ' + error.message);
            res.redirect('/practicas/nueva_practica');
        }
    }
});

module.exports = router;