const mysql = require('mysql');

function conectar(user, password) {
    return {
        host: 'localhost',
        user,
        password,
        database: 'laboratorio'
    }
}

const pool = mysql.createPool(conectar('root', 'admin'));
//Convertimos promesas lo que eran calllbacks
pool.query = promisify(pool.query);

module.exports = pool; //Exportamos la conexion con la bd

pool.connect((err) => {
    if (err) throw err;
    console.log('connection succesfully established');
}); 

pool.query('SELECT * FROM carrera', (err, rows) => {
    if (err) throw err
    console.log(rows);
})

pool.end();