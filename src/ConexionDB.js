const mysql = require('mysql2');
const { promisify } = require('util');

class ConexionDB {
  constructor(user, password) {
    this.host = 'localhost';
    this.user = user;
    this.password = password;
    this.database = 'laboratorio';
  }

  setUser(user) {this.user = user;}
  setPassword(password) {this.password = password}
  getUser() { return 'user: ${this.user}'; }
  getPassword() { return 'password: ${this.password}'; }
  getConnection() { return 'connection: ${this.connection}'; }
  getDatos() { return `host: ${this.host} - user: ${this.user} - password: ${this.password} - database: ${this.database}`; }

  conectar() {  
      this.pool = mysql.createPool({
      host: this.host,
      user: this.user,
      password: this.password,
      database: this.database
    });
    
    this.query = promisify(this.pool.query).bind(this.pool);

    this.getConnection((err, connection) => {
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
          if (err.code === 'ER_ACCESS_DENIED_ERROR'){
            console.error('Credenciales incorrectas');
        }
      }
      if (connection) connection.release();
      console.log('Base de datos conectada');
      return;
  });
  }

  cerrarConexion() {
    this.connection.end();
    console.log('Conexión cerrada');
  }

  isConnected(){
    return this.pool.status;
  }

}

module.exports = {ConexionDB};