const { Router } = require('express');
const db = require('../../../db'); // Ajusta la ruta según tu estructura
const router = Router();

// Obtener todos los contacts
router.get('/api/contacts', async (req, res) => {
  try {
    const query = `
      SELECT c.*, u.name AS user_name
      FROM contacts c
      INNER JOIN users u ON c.users_id = u.id
    `;
    const [results, fields] = await db.query(query);
    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener datos de la base de datos' });
  }
});

// Crear un nuevo contacts
router.post('/api/contacts', async (req, res) => {
  try {
    const { name_emergency_contact, email_emergency_contact, phone_emergency_contact, users_id } = req.body;
    const query = `INSERT INTO contacts (name_emergency_contact, email_emergency_contact, phone_emergency_contact, users_id) VALUES (?, ?, ?, ?)`;

    // Ejecuta la consulta en la base de datos utilizando async/await
    await db.query(query, [name_emergency_contact, email_emergency_contact, phone_emergency_contact, users_id]);

    res.status(201).json({ message: 'Usuario creado exitosamente' });
  } catch (error) {
    console.error('Error en la solicitud POST de contacts:', error);
    res.status(500).json({ error: 'Error en la solicitud POST de contacts', details: error.message });
  }
});

// Eliminar un contacts por su ID
router.delete('/api/contacts/:id', async (req, res) => {
  try {
    const fileId = req.params.id;
    const query = 'DELETE FROM contacts WHERE id = ?';

    // Ejecuta la consulta en la base de datos utilizando async/await
    await db.query(query, [fileId]);

    res.status(200).json({ message: 'Documento eliminado exitosamente' });
  } catch (error) {
    console.error('Error en la solicitud DELETE de contacts:', error);
    res.status(500).json({ error: 'Error en la solicitud DELETE de contacts', details: error.message });
  }
});

// Obtener consignments de un usuario específico
router.get('/api/contacts/:id/contacts', async (req, res) => {
  try {
    const userId = req.params.id;
    const query = 'SELECT * FROM contacts WHERE users_id = ?';

    // Ejecuta la consulta en la base de datos utilizando async/await
    const [results] = await db.query(query, [userId]);

    res.status(200).json(results);
  } catch (error) {
    console.error('Error en la solicitud GET de contacts:', error);
    res.status(500).json({ error: 'Error en la solicitud GET de contacts', details: error.message });
  }
});


module.exports = router;

