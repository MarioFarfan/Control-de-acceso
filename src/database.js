const mysql = require('mysql');
const { promisify } = require('util');

const db = {};

db.conectar = async (user, password) => {
    const pool = mysql.createPool({host: 'localhost', user, password, database: 'laboratorio'});
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
    });
    return pool;
};


db.con = (pool) => {
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
        promisify(pool.query);
        console.log('Base de datos conectada');
        return;
    });
}

//Convertimos promesas lo que eran calllbacks
//db.query = (pool) => {
//    return promisify(pool.query);
//}

module.exports = db; //Exportamos la conexion con la bd