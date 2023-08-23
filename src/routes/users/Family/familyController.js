const { Router } = require('express');
const db = require('../../../db'); // Ajusta la ruta según tu estructura
const router = Router();

// Obtener todos los family
router.get('/api/family', async (req, res) => {
  try {
    const query = `
      SELECT fi.*, u.name AS user_name
      FROM family_infos fi
      INNER JOIN users u ON fi.users_id = u.id
    `;
    const [results, fields] = await db.query(query);
    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener datos de la base de datos' });
  }
});


// Crear un nuevo family
// Crear un nuevo family
router.post('/api/family', async (req, res) => {
  try {
    const { name_family, document_family, relationship_family, birthdate_family, age_family, users_id } = req.body;
    const query = `INSERT INTO family_infos (name_family, document_family, relationship_family, birthdate_family, age_family, users_id) VALUES (?, ?, ?, ?, ?, ?)`;

    // Ejecuta la consulta en la base de datos utilizando async/await
    const [result] = await db.query(query, [name_family, document_family, relationship_family, birthdate_family, age_family, users_id]);

    // Verifica si se insertó un nuevo registro
    if (result.affectedRows === 1) {
      res.status(201).json({ message: 'Usuario creado exitosamente' });
    } else {
      res.status(500).json({ error: 'No se pudo crear el usuario' });
    }
  } catch (error) {
    console.error('Error en la solicitud POST de usuario:', error);
    res.status(500).json({ error: 'Error en la solicitud POST de usuario', details: error.message });
  }
});


// Eliminar un contacts por su ID
router.delete('/api/family/:id', async (req, res) => {
  try {
    const fileId = req.params.id;

    const query = 'DELETE FROM family_infos WHERE id = ?';

    // Ejecuta la consulta en la base de datos utilizando async/await
    const [result] = await db.query(query, [fileId]);

    // Verifica si se eliminó un registro
    if (result.affectedRows === 1) {
      res.status(200).json({ message: 'Documento eliminado exitosamente' });
    } else {
      res.status(404).json({ error: 'Documento no encontrado' });
    }
  } catch (error) {
    console.error('Error en la solicitud DELETE de contacto:', error);
    res.status(500).json({ error: 'Error en la solicitud DELETE de contacto', details: error.message });
  }
});

  
  // Obtener family de un usuario específico
router.get('/api/family/:id/family', async (req, res) => {
  try {
    const userId = req.params.id;
    const query = 'SELECT * FROM family_infos WHERE users_id = ?';

    // Ejecuta la consulta en la base de datos utilizando async/await
    const [results] = await db.query(query, [userId]);

    res.status(200).json(results);
  } catch (error) {
    console.error('Error en la solicitud GET de información familiar:', error);
    res.status(500).json({ error: 'Error en la solicitud GET de información familiar', details: error.message });
  }
});



module.exports = router;
