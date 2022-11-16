const { Router } = require('express');
const express = require('express');
const router = express.Router();

const pool = require('../database');

router.get('/inventarios/agregar_dispositivo', (req, res) => {
    res.render('inventarios/agregar')
});

router.post('/inventarios/agregar_dispositivo', async(req, res) => {
    const{ folioinv, noserie, marca, tipo, foliocpu, idarea } = req.body;
    const newDispositivo = {
        folioinv, 
        noserie, 
        marca, 
        tipo, 
        foliocpu, 
        idarea
    };  //validar los datos
    await pool.query('INSERT INTO EQUIPO set ?', [newDispositivo]);
    req.flash('mensaje', 'Dispositivo agregado con exito');
    res.redirect('/links/inventarios');
});

router.get('/inventarios', async (req, res) => {
    const equipos = await pool.query('SELECT FOLIOINV,NOSERIE, MARCA, TIPO, FOLIOCPU, DESCRIPCION FROM EQUIPO INNER JOIN AREA ON EQUIPO.IDAREA = AREA.IDAREA');
    res.render('inventarios/listar_equipos', { equipos });
});

router.get('/usuarios/agregar_usuario', async (req, res) => {
    const departamentos = await pool.query('SELECT IDDEPTO,ALIAS FROM DEPARTAMENTO');

    res.render('usuarios/nvousuario',{departamentos});
}); 

router.post('/usuarios/agregar_usuario', async(req, res) => {
    const{ notarjeta, password, nombrepersona, ap_p, ap_m, tipopersona, departamento, turno, puesto } = req.body;
    if(tipopersona = 'Docente'){
        const newUser ={
            notarjeta,
            password
        };
        const newDocente = {
            notarjeta, 
            nombrepersona, 
            ap_p, 
            ap_m, 
            departamento
        };
        await pool.query('INSERT INTO USUARIO set ?', [newUser]);
        await pool.query('INSERT INTO DOCENTE set ?', [newDocente]);

        console.log(newDocente,newUser);
    }
    if(tipopersona = 'Auxiliar'){
        const newUser ={
            notarjeta,
            password
        };
        const newPersonal = {
            notarjeta, 
            nombrepersona, 
            ap_p, 
            ap_m, 
            puesto,
            turno
        };
        await pool.query('INSERT INTO USUARIO set ?', [newUser]);
        await pool.query('INSERT INTO PERSONAL set ?', [newPersonal]);

        console.log(newPersonal,newUser);
    }


    res.send('recived')
});
   
router.get('/usuarios/agregar_alumno', async (req, res) => {
    const carreras = await pool.query('SELECT IDCARRERA, CARRERA FROM CARRERA');

    res.render('usuarios/agregar_alumno',{carreras});
}); 


router.get('/alumnos', async (req, res) => {
    const alumnos = await pool.query('SELECT NOCONTROL, NOMBRE_AL, AP_PAT, AP_MAT, CARRERA, SEMESTRE, STATUS  FROM ALUMNO INNER JOIN CARRERA');
    const carreras = await pool.query('SELECT IDCARRERA, CARRERA FROM CARRERA');
    
    res.render('usuarios/listar_alumnos', { alumnos, carreras });
});

router.get('/usuarios', async (req, res) => {
 
    const docentes = await pool.query('SELECT NOTARJETA, NOMBRE_PR, APPAT_PR, APMAT_PR, DEPARTAMENTO, USUARIO.USER FROM DOCENTES INNER JOIN DEPARTAMENTO INNER JOIN USUARIO GROUP BY NOTARJETA');
    const personal = await pool.query('SELECT NOTARJETAP, NOMBRE_PER, APPAT_PER, APMAT_PER, PUESTO, TURNO, USUARIO.USER FROM PERSONAL INNER JOIN USUARIO GROUP BY NOTARJETAP;');
    
    
    res.render('usuarios/listar_usuarios',{ docentes, personal });
});
module.exports = router;