function database(user, password) {
    return {
        database: {
            host: 'localhost',
            user,
            password,
            database: 'laboratorio'
        }
    }
}

module.exports = { database }