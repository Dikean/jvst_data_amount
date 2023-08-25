const { Router } = require('express');
const jwt = require('jsonwebtoken');//JWT
const bcrypt = require('bcrypt'); // Importa el módulo bcrypt
const db = require('../../db'); // Ajusta la ruta según tu estructura
const router = Router();

//Correo
const nodemailer = require('nodemailer'); // Para enviar correos electrónicos
const randomstring = require('randomstring'); // Para generar una contraseña temporal

// Ruta para iniciar sesión
router.post('/api/auth', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Busca al usuario en la base de datos por su correo electrónico
    const userQuery = 'SELECT * FROM users WHERE email = ?';
    const [userResults] = await db.query(userQuery, [email]);

    if (userResults.length === 0) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // Compara la contraseña proporcionada con la almacenada en la base de datos
    const user = userResults[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // Genera un token JWT para el usuario
    const token = jwt.sign({ id: user.id,name: user.name, email: user.email , role: user.role}, 'tu_secreto_secreto', {
      expiresIn: '3h', // Puedes ajustar la duración del token
    });

    res.status(200).json({ message: 'Inicio de sesión exitoso', user, token });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

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

// Actualizar datos de un usuario por su ID
router.put('/api/users/:id', async (req, res) => {
  const userId = req.params.id;
  const { name, lastname, address, postal_code, city, country, about_me } = req.body;

  try {
    // Verificar si el usuario existe
    const userQuery = 'SELECT * FROM users WHERE id = ?';
    const [userResult] = await db.query(userQuery, [userId]);

    if (!userResult || userResult.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const updateQuery = `
  UPDATE users
  SET name = ?, lastname = ?, address = ?, postal_code = ?, city = ?, country = ?, about_me = ?
  WHERE id = ?
`;

await db.query(updateQuery, [name, lastname, address, postal_code, city, country, about_me, userId]);

    res.status(200).json({ message: 'Datos de usuario actualizados exitosamente' });
  } catch (error) {
    console.error('Error al actualizar datos de usuario:', error);
    res.status(500).json({ error: 'Error al actualizar datos de usuario' });
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

// Ruta para obtener datos de un usuario por su ID
router.get('/api/users/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    // Consultar la base de datos para obtener los datos del usuario por su ID
    const query = 'SELECT * FROM users WHERE id = ?';
    const [userResults] = await db.query(query, [userId]);

    if (userResults.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Devolver los datos del usuario encontrado
    const user = userResults[0];
    res.status(200).json(user);
  } catch (error) {
    console.error('Error al obtener datos de usuario por ID:', error);
    res.status(500).json({ error: 'Error al obtener datos de usuario por ID' });
  }
});


// Ruta para obtener datos de un usuario por su nombre
router.get('/api/users/byname/:name', async (req, res) => {
  const userName = req.params.name;

  try {
    // Consultar la base de datos para obtener los datos del usuario por su nombre
    const query = 'SELECT * FROM users WHERE name = ?';
    const [userResults] = await db.query(query, [userName]);
    // Devolver los datos del usuario encontrado
    const user = userResults[0];
    res.status(200).json(user);
  } catch (error) {
    console.error('Error al obtener datos de usuario por nombre:', error);
    res.status(500).json({ error: 'Error al obtener datos de usuario por nombre' });
  }
});
///ejamplo



module.exports = router;


