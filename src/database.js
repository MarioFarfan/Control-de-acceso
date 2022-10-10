const mysql = require('mysql');
const { promisify } = require('util');

const { database } = require('./llave');

const pool = mysql.createPool(database);

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST'){
            console.error('LA CONEXION CON LA BASE DE DATOS FUÉ CERRADA');
        }
        if (err.code === 'ER_CON_COUNT_ERROR'){
            console.error('EXISTEN MUCHAS CONEXIONES CON LA BASE DE DATOS');
        }
        if (err.code === 'ECONNREFUSED'){
            console.error('Conexion con la base de datos denegada');
        }
    }
    if (connection) connection.release();
    console.log('Base de datos conectada');
    return;
});

//Convertimos promesas lo que eran calllbacks
pool.query = promisify(pool.query);

module.exports = pool; //Exportamos la conexion con la bd