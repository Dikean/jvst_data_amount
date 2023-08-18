const { Router } = require('express');
const db = require('../../db'); // Ajusta la ruta según tu estructura
const router = Router();

// Obtener todos los documentos //ok
router.get('/api/file', async (req, res) => {
  try {
    const query = 'SELECT * FROM documents';
    const [results, fields] = await db.query(query); // Utiliza db.promise().query() para trabajar con promesas
    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener datos de la base de datos' });
  }
});

// Crear un nuevo documento CIS & File
router.post('/api/file', async (req, res) => {
  const { files, date, users_id } = req.body;

  try {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const description = `File${i + 1}`; // Generar descripción personalizada

      // Verificar si el usuario ya ha subido un documento con la misma descripción
      const queryCheck = `SELECT COUNT(*) AS documentCount FROM documents WHERE users_id = ? AND description = ?`;
      const [checkResults] = await db.query(queryCheck, [users_id, description]);

      const documentCount = checkResults[0].documentCount;

      // Verificar si el usuario puede subir más documentos con esta descripción
      if (documentCount >= 1) {
        return res.status(400).json({ error: 'No se pueden subir más documentos con esta descripción' });
      }

      // Insertar el nuevo documento en la base de datos
      const query = `INSERT INTO documents (file, date, description, users_id) VALUES (?, ?, ?, ?)`;
      await db.query(query, [file.url, date, description, users_id]);
    }

    res.status(201).json({ message: 'Documentos creados exitosamente' });
  } catch (error) {
    console.error('Error en la consulta SQL:', error);
    res.status(500).json({ error: 'Error al crear nuevos documentos', details: error });
  }
});

// Eliminar un documento por su ID //ok
router.delete('/api/file/:id', async (req, res) => {
  const fileId = req.params.id;

  try {
    const query = 'DELETE FROM documents WHERE id = ?';
    const result = await db.query(query, [fileId]);
    
    if (result[0].affectedRows === 0) {
      res.status(404).json({ error: 'Documento no encontrado' });
    } else {
      res.status(200).json({ message: 'Documento eliminado exitosamente' });
    }
  } catch (error) {
    console.error('Error en la consulta SQL:', error);
    res.status(500).json({ error: 'Error al eliminar el documento', details: error });
  }
});
  
  // Obtener documentos de un usuario específico
router.get('/api/file/:id/file', async(req, res) => {
    const userId = req.params.id;
    const query = 'SELECT * FROM documents WHERE users_id = ?';
    db.query(query, [userId], (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Error al obtener datos de la base de datos' });
      } else {
        res.status(200).json(results);
      }
    });
  });

  // Obtener documentos de un usuario específico con la descripción "CIS" //ok
  router.get('/api/file/:id/file/cis', async (req, res) => {
    const userId = req.params.id;
    const query = 'SELECT * FROM documents WHERE users_id = ? AND description = "CIS"';
    try {
      const [results] = await db.query(query, [userId]);
      if (results.length === 0) {
        return res.status(200).json({ message: 'Usuario no existe' });
      }
      res.status(200).json(results);
    } catch (error) {
      console.error('Error al obtener datos de la base de datos:', error);
      res.status(500).json({ error: 'Error al obtener datos de la base de datos' });
    }
  });


   // Obtener documentos de un usuario específico con la descripción "File" //ok
   router.get('/api/file/:id/file/file', async (req, res) => {
    const userId = req.params.id;
    const query = 'SELECT * FROM documents WHERE users_id = ? AND description = "File"';
    
    try {
      const [results] = await db.query(query, [userId]);
      if (results.length === 0) {
        return res.status(200).json({ message: 'Usuario no existe' });
      }
      res.status(200).json(results);
    } catch (error) {
      console.error('Error al obtener datos de la base de datos:', error);
      res.status(500).json({ error: 'Error al obtener datos de la base de datos' });
    }
  });
  



module.exports = router;


