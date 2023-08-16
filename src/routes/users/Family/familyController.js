const { Router } = require('express');
const db = require('../../../db'); // Ajusta la ruta según tu estructura
const router = Router();

// Obtener todos los family
router.get('/api/family', (req, res) => {
  const query = 'SELECT * FROM family_infos';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error al obtener datos de la base de datos' });
    } else {
      res.status(200).json(results);
    }
  });
});

// Crear un nuevo family
router.post('/api/family', (req, res) => {
  const { name_family, document_family, relationship_family, birthdate_family, age_family, users_id   } = req.body;
  const query = `INSERT INTO family_infos (name_family, document_family, relationship_family, birthdate_family, age_family, users_id  ) VALUES (?, ?, ?, ?, ?, ?)`;
  db.query(query, [ name_family, document_family, relationship_family, birthdate_family, age_family, users_id  ], (err, result) => {
    if (err) {
      console.log('Error en la consulta SQL:', err);
      res.status(500).json({ error: 'Error al crear un nuevo usuario',  details: err });
    } else {
      res.status(201).json({ message: 'Usuario creado exitosamente' });
    }
  });
});

// Eliminar un contacts por su ID
router.delete('/api/family/:id', (req, res) => {
    const fileId = req.params.id;
  
    const query = 'DELETE FROM family_infos WHERE id = ?';
    db.query(query, [fileId], (err, result) => {
      if (err) {
        console.log('Error en la consulta SQL:', err);
        res.status(500).json({ error: 'Error al eliminar el documento', details: err });
      } else {
        res.status(200).json({ message: 'Documento eliminado exitosamente' });
      }
    });
  });
  
  // Obtener family de un usuario específico
router.get('/api/family/:id/family', (req, res) => {
    const userId = req.params.id;
    const query = 'SELECT * FROM family_infos WHERE users_id = ?';
    db.query(query, [userId], (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Error al obtener datos de la base de datos' });
      } else {
        res.status(200).json(results);
      }
    });
  });


module.exports = router;
