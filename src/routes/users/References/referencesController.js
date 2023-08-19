const { Router } = require('express');
const db = require('../../../db'); // Ajusta la ruta según tu estructura
const router = Router();

// Obtener todos los reference
router.get('/api/references', async (req, res) => {
  try {
    const query = 'SELECT * FROM \`references\`';
    const [results, fields] = await db.query(query);
    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener datos de la base de datos' });
  }
});

// Crear un nuevo reference
router.post('/api/references', (req, res) => {
  const { name_references, document_references, email_references, phone_references, address_references, country_references, city_references, users_id } = req.body;
  const query = `INSERT INTO \`references\` (name_references, document_references, email_references, phone_references, address_references, country_references, city_references, users_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  db.query(query, [name_references, document_references, email_references, phone_references, address_references, country_references, city_references, users_id], (err, result) => {
    if (err) {
      console.log('Error en la consulta SQL:', err);
      res.status(500).json({ error: 'Error al crear una nueva referencia', details: err });
    } else {
      res.status(201).json({ message: 'Referencia creada exitosamente' });
    }
  });
});


// Eliminar un reference por su ID
router.delete('/api/references/:id', (req, res) => {
    const fileId = req.params.id;
  
    const query = 'DELETE FROM references WHERE id = ?';
    db.query(query, [fileId], (err, result) => {
      if (err) {
        console.log('Error en la consulta SQL:', err);
        res.status(500).json({ error: 'Error al eliminar el documento', details: err });
      } else {
        res.status(200).json({ message: 'Documento eliminado exitosamente' });
      }
    });
  });
  
  // Obtener reference de un usuario específico
router.get('/api/references/:id/references', (req, res) => {
    const userId = req.params.id;
    const query = 'SELECT * FROM references WHERE users_id = ?';
    db.query(query, [userId], (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Error al obtener datos de la base de datos' });
      } else {
        res.status(200).json(results);
      }
    });
  });


module.exports = router;
