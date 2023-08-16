const { Router } = require('express');
const db = require('../../../db'); // Ajusta la ruta según tu estructura
const router = Router();

// Obtener todos los contacts
router.get('/api/contacts', (req, res) => {
  const query = 'SELECT * FROM contacts';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error al obtener datos de la base de datos' });
    } else {
      res.status(200).json(results);
    }
  });
});

// Crear un nuevo contacts
router.post('/api/contacts', (req, res) => {
  const { name_emergency_contact, email_emergency_contact, phone_emergency_contact, users_id   } = req.body;
  const query = `INSERT INTO contacts (name_emergency_contact, email_emergency_contact, phone_emergency_contact, users_id  ) VALUES (?, ?, ?, ?)`;
  db.query(query, [ name_emergency_contact, email_emergency_contact, phone_emergency_contact, users_id  ], (err, result) => {
    if (err) {
      console.log('Error en la consulta SQL:', err);
      res.status(500).json({ error: 'Error al crear un nuevo usuario',  details: err });
    } else {
      res.status(201).json({ message: 'Usuario creado exitosamente' });
    }
  });
});

// Eliminar un contacts por su ID
router.delete('/api/contacts/:id', (req, res) => {
    const fileId = req.params.id;
  
    const query = 'DELETE FROM contacts WHERE id = ?';
    db.query(query, [fileId], (err, result) => {
      if (err) {
        console.log('Error en la consulta SQL:', err);
        res.status(500).json({ error: 'Error al eliminar el documento', details: err });
      } else {
        res.status(200).json({ message: 'Documento eliminado exitosamente' });
      }
    });
  });
  
  // Obtener consignments8 de un usuario específico
router.get('/api/contacts/:id/contacts', (req, res) => {
    const userId = req.params.id;
    const query = 'SELECT * FROM contacts WHERE users_id = ?';
    db.query(query, [userId], (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Error al obtener datos de la base de datos' });
      } else {
        res.status(200).json(results);
      }
    });
  });


module.exports = router;

