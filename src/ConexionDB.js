const mysql = require('mysql2');
const { promisify } = require('util');

class ConexionDB {
  constructor(user, password) {
    this.host = 'localhost';
    this.user = user;
    this.password = password;
    this.database = 'laboratorio';
    this.conectado = false;
  }

  setUser(user) {this.user = user;}
  setPassword(password) {this.password = password}
  getUser() { return 'user: ${this.user}'; }
  getPassword() { return 'password: ${this.password}'; }
  getConnection() { return 'connection: ${this.pool.getConnection}'; }
  getDatos() { return `host: ${this.host} - user: ${this.user} - password: ${this.password} - database: ${this.database}`; }

  conectar() {  
      this.pool = mysql.createPool({
      host: this.host,
      user: this.user,
      password: this.password,
      database: this.database
    });
    
    this.query = promisify(this.pool.query).bind(this.pool);

    this.pool.getConnection((err, connection) => {
      if (connection){
        connection.release();
        this.conectado = true;
        console.log('Base de datos conectada ' + this.conectado);
        return;
      } 
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
            console.error('Credenciales incorrectas!!');
        }
      }
    });
  }

  cerrarConexion() {
    this.connection.end();
    console.log('Conexión cerrada');
  }

  isConnected(){
    return this.query('SELECT * from area')
    .then((result)=>{
      return true;
    })
    .catch((err)=>{
      return false;
    });
  }

}

module.exports = {ConexionDB};