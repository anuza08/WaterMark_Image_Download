const { createPool } = require("mysql");
const pool = createPool({
    host: "localhost",
    user:'root',
    password: 'root',  
    database: 'test',
    connectionLimit: 10
})
