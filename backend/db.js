const myslq = require('mysql2/promise')
const conexao = myslq.createPool({ 
    host: "localhost", 
    user: "root", 
    password: "", 
    port: "3306", 
    database: "gourmetify", 
    waitForConnections: true, 
    connectionLimit: 10, 
    queueLimit: 0 
})

module.exports = conexao