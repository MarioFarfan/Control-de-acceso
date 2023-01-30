const { promisify } = require('util');
const { Pool } = require('pg');

class ConexionDB {
  constructor(user, password) {
    this.pool = new Pool({
      user: user,
      host: 'localhost',
      database: 'laboratorio',
      password: password,
      port: 5432,
    });
    this.query = promisify(this.pool.query).bind(this.pool);
  }

  async checkConnection() {
    try {
      const result = await this.pool.query('SELECT 1');
      console.log('Connected to database');
      return true;
    } catch (err) {
      console.error('Error connecting to database:', err);
      return false;
    }
  }

  end() {
    return this.pool.end();
  }
}

module.exports = {ConexionDB};