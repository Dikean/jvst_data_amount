const { Router } = require('express');
const jwt = require('jsonwebtoken');//JWT
const bcrypt = require('bcrypt'); // Importa el módulo bcrypt
const db = require('../../db'); // Ajusta la ruta según tu estructura
const router = Router();

//Correo
const nodemailer = require('nodemailer'); // Para enviar correos electrónicos
const randomstring = require('randomstring'); // Para generar una contraseña temporal


// Obtener todos los usuarios
router.get('/api/users', async (req, res) => {
  try {
    const query = 'SELECT * FROM users';
    const [results, fields] = await db.query(query);
    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener datos de la base de datos' });
  }
});




// Ruta para crear un nuevo usuario
router.post('/api/users', async (req, res) => {
  const { name, lastname, email, password, role, address, postal_code, city, country, date, about_me } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // "10" es el número de rondas de hashing

    const query = `
      INSERT INTO users (name, lastname, email, password, role, address, postal_code, city, country, date, about_me)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await db.query(query, [name, lastname, email, hashedPassword, role, address, postal_code, city, country, date, about_me]);

    // Obtener el ID del usuario recién creado
    const idQuery = 'SELECT LAST_INSERT_ID() as id';
    const [idResult] = await db.query(idQuery);
    const userId = idResult[0].id;

    res.status(201).json({
      message: 'Usuario creado exitosamente',
      id: userId,
      role: role,
      email: email
    });
  } catch (error) {
    console.error('Error al insertar usuario:', error);
    res.status(500).json({ error: 'Error al insertar usuario' });
  }
});


// Recuperar contraseña
router.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const tempPassword = randomstring.generate(10);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const updateQuery = 'UPDATE users SET password = ? WHERE email = ?';
    await db.query(updateQuery, [hashedPassword, email]);

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'dylan01aponte@gmail.com',
        pass: 'hfrxnnsqjcjomtft'
      }
    });

    const mailOptions = {
      from: 'dylan01aponte@gmail.com',
      to: email,
      subject: 'Recuperación de contraseña',
      text: `Tu nueva contraseña temporal es: ${tempPassword}`
    };

    const mailInfo = await transporter.sendMail(mailOptions);

    console.log('Correo electrónico enviado:', mailInfo); // Muestra información sobre el correo enviado

    res.status(200).json({ message: 'Contraseña temporal enviada exitosamente por correo electrónico' });
  } catch (error) {
    console.error('Error en el proceso de recuperación de contraseña:', error);
    res.status(500).json({ error: 'Error en el proceso de recuperación de contraseña' });
  }
});

// Cambiar el rol de un usuario
router.put('/api/users/:id/change-role', async (req, res) => {
  const userId = req.params.id;
  const { role } = req.body;

  try {
    const updateQuery = 'UPDATE users SET role = ? WHERE id = ?';
    await db.query(updateQuery, [role, userId]);

    res.status(200).json({ message: 'Rol de usuario actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar el rol del usuario:', error);
    res.status(500).json({ error: 'Error al actualizar el rol del usuario' });
  }
});

module.exports = router;


