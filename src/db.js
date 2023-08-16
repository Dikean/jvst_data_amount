const mysql = require('mysql');

// Configuración de la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'jvst'
});

// Conexión a la base de datos
db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
  } else {
    console.log('Conexión exitosa a la base de datos MySQL');
  }
});

module.exports = db;
