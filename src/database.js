const mysql = require('mysql');
const { promisify } = require('util');


function conectar(user, password) {
    return {
        database: {
            host: 'localhost',
            user,
            password,
            database: 'laboratorio'
        }
    }
}

function getConnection(user, pass) {
    if (username !== undefined && password !== undefined) {
        const pool = mysql.createPool(conectar(user, pass));
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
            console.log('Database is Connected');
            return;
        });
    
        //Convertimos promesas lo que eran calllbacks
        pool.query = promisify(pool.query);
    } else {
        console.log('Eror al conectar con la base de datos' + user + pass);
    }
    

    

}


module.exports = getConnection;

//module.exports = getConnection; //Exportamos la conexion con la bd