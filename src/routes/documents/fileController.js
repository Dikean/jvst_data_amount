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
    // Verificar si el usuario ya ha subido un documento con la descripción "CIS"
    const queryCheck = `SELECT COUNT(*) AS documentCount FROM documents WHERE users_id = ? AND description = 'CIS'`;
    const [checkResults] = await db.query(queryCheck, [users_id]);

    const documentCount = checkResults[0].documentCount;

    // Verificar si el usuario puede subir más documentos con la descripción "CIS"
    if (documentCount >= 1) {
      return res.status(400).json({ error: 'No se pueden subir más documentos con la descripción CIS' });
    }

    // Si no existe un documento con la descripción "CIS" para este usuario, se permite agregar uno nuevo
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const description = 'CIS'; // Descripción fija

      // Insertar el nuevo documento en la base de datos
      const query = `INSERT INTO documents (file, date, description, users_id) VALUES (?, ?, ?, ?)`;
      await db.query(query, [file, date, description, users_id]);
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

    // Obtener documentos con la descripción "CIS" //ok
  router.get('/api/files/cis', async (req, res) => {
    const query = 'SELECT * FROM documents WHERE description = "CIS"';
    try {
      const [results] = await db.query(query);
      if (results.length === 0) {
        return res.status(200).json({ message: 'No documents found with description "CIS"' });
      }
      res.status(200).json(results);
    } catch (error) {
      console.error('Error fetching data from the database:', error);
      res.status(500).json({ error: 'Error fetching data from the database' });
    }
  });
  



   // Obtener documentos de un usuario específico con la descripción "File" //ok
   router.get('/api/file/:id/files', async (req, res) => {
    const userId = req.params.id;
    const descriptions = ["File1", "File2", "File3", "File4", "File5"];
  
    try {
      const filesData = await Promise.all(
        descriptions.map(async (description) => {
          const query = `
            SELECT 
              file
            FROM 
              documents 
            WHERE 
              description = ? 
              AND users_id = ?
            ORDER BY 
              date DESC
            LIMIT 1`;
            
          const [results] = await db.query(query, [description, userId]);
          const fileData = results[0];
          const url = `blob:${process.env.CLIENT_URL}/${fileData.file}`; // Assuming CLIENT_URL is your client's URL
          return { url, date: fileData.date };
        })
      );
  
      const responseData = {
        files: filesData,
        date: new Date().toISOString().split('T')[0],
        users_id: userId,
      };
  
      res.status(200).json(responseData);
    } catch (error) {
      console.error('Error al obtener archivos de la base de datos:', error);
      res.status(500).json({ error: 'Error al obtener archivos de la base de datos' });
    }
  });
  
  



module.exports = router;


