const express = require('express');
const mysql = require('mysql2');

const app = express();
// Configuración de la base de datos
const pool = mysql.createPool({
  host: 'smilesonline.online', // Cambia esto por tu host
  user: 'u958352070_jvst_user',    // Cambia esto por tu usuario
  password: '^35P>b$Ir5V',     // Cambia esto por tu contraseña
  database: 'u958352070_jvst_database', // Cambia esto por tu base de datos
  connectionLimit: 10, // Número máximo de conexiones en el pool
});

// Conexión al pool de conexiones
const db = pool.promise(); // Usar el pool en modo promesa


pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error de conexión:', err);
    return;
  }
  console.log('Conexión a la base de datos establecida.');
  connection.release();
});


module.exports = db;
