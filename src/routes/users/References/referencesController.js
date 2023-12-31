const { Router } = require('express');
const db = require('../../../db'); // Ajusta la ruta según tu estructura
const router = Router();

// Obtener todos los reference
router.get('/api/references', async (req, res) => {
  try {
    const query = `
      SELECT r.*, u.name AS user_name
      FROM \`references\` r
      INNER JOIN users u ON r.users_id = u.id
    `;
    const [results, fields] = await db.query(query);
    res.status(200).json(results);
  } catch (err) {
    console.error('Error en la solicitud GET de referencias:', err);
    res.status(500).json({ error: 'Error al obtener datos de la base de datos', details: err.message });
  }
});


// Crear un nuevo reference
router.post('/api/references', async (req, res) => {
  try {
    const { name_references, document_references, email_references, phone_references, address_references, country_references, city_references, users_id } = req.body;
    const query = `INSERT INTO \`references\` (name_references, document_references, email_references, phone_references, address_references, country_references, city_references, users_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    
    const [result] = await db.query(query, [name_references, document_references, email_references, phone_references, address_references, country_references, city_references, users_id]);

    res.status(201).json({ message: 'Referencia creada exitosamente', insertedId: result.insertId });
  } catch (error) {
    console.error('Error en la solicitud POST de referencia:', error);
    res.status(500).json({ error: 'Error en la solicitud POST de referencia', details: error.message });
  }
});

// Eliminar un reference por su ID
router.delete('/api/references/:id', async (req, res) => {
  try {
    const fileId = req.params.id;

    const query = 'DELETE FROM `references` WHERE id = ?';
    const [result] = await db.query(query, [fileId]);

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Referencia no encontrada' });
    } else {
      res.status(200).json({ message: 'Referencia eliminada exitosamente' });
    }
  } catch (error) {
    console.error('Error en la solicitud DELETE de referencia:', error);
    res.status(500).json({ error: 'Error en la solicitud DELETE de referencia', details: error.message });
  }
});

// Obtener reference de un usuario específico
router.get('/api/references/:id/references', async (req, res) => {
  try {
    const userId = req.params.id;
    const query = 'SELECT * FROM `references` WHERE users_id = ? ';
    
    const [results] = await db.query(query, [userId]);

    res.status(200).json(results);
  } catch (error) {
    console.error('Error en la solicitud GET de referencia:', error);
    res.status(500).json({ error: 'Error en la solicitud GET de referencia', details: error.message });
  }
});

// Ruta para obtener datos de todas las referencias por su nombre de usuario
router.get('/api/references/byname/:name', async (req, res) => {
  const userName = req.params.name;

  try {
    // Consultar la base de datos para obtener los datos de las referencias por su nombre de usuario
    const query = `
      SELECT r.*, u.name AS user_name
      FROM \`references\` r
      INNER JOIN users u ON r.users_id = u.id
      WHERE u.name = ?;
    `;
    const [referenceResults] = await db.query(query, [userName]);
    // Devolver los datos de las referencias encontradas
    res.status(200).json(referenceResults);
  } catch (error) {
    console.error('Error al obtener datos de referencias por nombre de usuario:', error);
    res.status(500).json({ error: 'Error al obtener datos de referencias por nombre de usuario' });
  }
});


module.exports = router;
