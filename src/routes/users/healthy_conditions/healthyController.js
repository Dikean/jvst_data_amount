const { Router } = require('express');
const db = require('../../../db'); // Ajusta la ruta según tu estructura
const router = Router();

// Obtener todos los healthy
router.get('/api/healthy', (req, res) => {
  const query = 'SELECT * FROM healthy_conditions';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error al obtener datos de la base de datos' });
    } else {
      res.status(200).json(results);
    }
  });
});

// Crear un nuevo healthy
router.post('/api/healthy', (req, res) => {
  const { alergia, enfermedad, prescripcionMedica,incapacidad,  RestriccionAlimenticia,  users_id } = req.body;
  const query = `INSERT INTO healthy_conditions ( alergia, enfermedad, prescripcionMedica,incapacidad,  RestriccionAlimenticia,  users_id  ) VALUES (?, ?, ?, ?, ?, ?)`;
  db.query(query, [ alergia, enfermedad, prescripcionMedica,incapacidad,  RestriccionAlimenticia,  users_id  ], (err, result) => {
    if (err) {
      console.log('Error en la consulta SQL:', err);
      res.status(500).json({ error: 'Error al crear un nuevo usuario',  details: err });
    } else {
      res.status(201).json({ message: 'Usuario creado exitosamente' });
    }
  });
});

// Eliminar un healthy por su ID
router.delete('/api/healthy/:id', (req, res) => {
    const fileId = req.params.id;
  
    const query = 'DELETE FROM healthy_conditions WHERE id = ?';
    db.query(query, [fileId], (err, result) => {
      if (err) {
        console.log('Error en la consulta SQL:', err);
        res.status(500).json({ error: 'Error al eliminar el documento', details: err });
      } else {
        res.status(200).json({ message: 'Documento eliminado exitosamente' });
      }
    });
  });
  
  // Obtener healthy de un usuario específico
router.get('/api/healthy/:id/healthy', (req, res) => {
    const userId = req.params.id;
    const query = 'SELECT * FROM healthy_conditions WHERE users_id = ?';
    db.query(query, [userId], (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Error al obtener datos de la base de datos' });
      } else {
        res.status(200).json(results);
      }
    });
  });


module.exports = router;
