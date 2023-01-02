const mysql = require('mysql2');
const { promisify } = require('util');

class ConexionDB {
  constructor(user, password) {
    this.host = 'localhost';
    this.user = user;
    this.password = password;
    this.database = 'laboratorio';
  }
  getUser() { return 'user: ${this.user}'; }
  getPassword() { return 'password: ${this.password}'; }
  getConnection() { return 'connection: ${this.connection}'; }
  getDatos() { return `host: ${this.host} - user: ${this.user} - password: ${this.password} - database: ${this.database}`; }

  conectar() {  
    this.connection = mysql.createConnection({
      host: this.host,
      user: this.user,
      password: this.password,
      database: this.database
    });

    this.connection.connect((error) => {
      if (error) throw error;
      console.log('Base de datos conectada');
    });
  }

  query(consulta) {
    return promisify(this.connection.query).bind(this.connection)(consulta);
  }

  cerrarConexion() {
    this.connection.end();
    console.log('Conexión cerrada');
  }
}

module.exports = {ConexionDB};