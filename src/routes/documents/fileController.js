const { Router } = require('express');
const db = require('../../db'); // Ajusta la ruta según tu estructura
const router = Router();
const multer = require('multer');
const express = require('express');

// Obtener todos los documentos //ok
// Obtener todos los documentos con descripciones en el conjunto ["file1", "file2", "file3", "file4", "file5"]
router.get('/api/files/documents', async (req, res) => {
  try {
    const descriptions = ["file1", "file2", "file3", "file4", "file5"];
    // Crear un marcador de posición para cada descripción en el array.
    const placeholders = descriptions.map(() => '?').join(',');

    const query = `
      SELECT d.*, u.name AS user_name
      FROM documents d
      INNER JOIN users u ON d.users_id = u.id
      WHERE d.description IN (${placeholders})
    `;
    const [results, fields] = await db.query(query, descriptions);
    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener datos de la base de datos' });
  }
});




// Configura multer para manejar la carga de archivos
const storage = multer.memoryStorage(); // Almacena el archivo en memoria
const upload = multer({ storage: storage });

// Ruta para crear una nueva consignación con un archivo adjunto
const path = require('path');
const fs = require('fs');


// Crear un nuevo documento CIS & File
router.post('/api/file', upload.single('file'), async (req, res) => {
  const { description, date, users_id } = req.body;
  const file = req.file; // El archivo se encuentra en req.file

  try {
    // Verificar si el usuario puede subir más documentos con la misma descripción
    const queryCheck = `SELECT COUNT(*) AS documentCount FROM documents WHERE users_id = ? AND description = ?`;
    const [checkResults] = await db.query(queryCheck, [users_id, description]);

    const documentCount = checkResults[0].documentCount;

    // Verificar si el usuario puede subir más documentos con la descripción dada
    if (documentCount >= 1) {
      return res.status(400).json({ error: 'No se pueden subir más documentos con la misma descripción' });
    }

    // Almacena el archivo en el directorio 'data_file' en tu servidor
    const uploadDir = path.join(__dirname, 'data_file'); // Ajusta la ruta según tu estructura
    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(uploadDir, fileName);

    fs.writeFileSync(filePath, file.buffer);

    // Genera la URL para el archivo
    const fileUrl = `/data_file/${fileName}`;

    // Inserta el nuevo documento en la base de datos
    const query = `INSERT INTO documents (file, date, description, users_id) VALUES (?, ?, ?, ?)`;
    await db.query(query, [fileUrl, date, description, users_id]);

    res.status(201).json({ message: 'Documento creado exitosamente' });
  } catch (error) {
    console.error('Error en la consulta SQL:', error);
    res.status(500).json({ error: 'Error al crear el documento', details: error });
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

// Eliminar un documento por su ID //ok
router.delete('/api/file/:userId/files', async (req, res) => {
  const userId = req.params.userId;
  const descriptionsToDelete = ["file1", "file2", "file3", "file4", "file5"];

  try {
    // Eliminar todos los documentos del usuario con las descripciones especificadas.
    const query = 'DELETE FROM documents WHERE users_id = ? AND description IN (?)';
    const result = await db.query(query, [userId, descriptionsToDelete]);

    if (result[0].affectedRows === 0) {
      res.status(404).json({ error: 'No se encontraron documentos para eliminar' });
    } else {
      res.status(200).json({ message: 'Documentos eliminados exitosamente' });
    }
  } catch (error) {
    console.error('Error en la consulta SQL:', error);
    res.status(500).json({ error: 'Error al eliminar los documentos', details: error });
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
    const query = `
      SELECT d.*, u.name AS user_name
      FROM documents d
      INNER JOIN users u ON d.users_id = u.id
      WHERE d.users_id = ? AND d.description = "CIS"
    `;
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
  

  // Obtener documentos con la descripción "CIS" y el nombre del usuario
router.get('/api/files/cis', async (req, res) => {
  const query = `
    SELECT d.*, u.name AS user_name
    FROM documents d
    INNER JOIN users u ON d.users_id = u.id
    WHERE d.description = "CIS"
  `;
  try {
    const [results] = await db.query(query);
    res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching data from the database:', error);
    res.status(500).json({ error: 'Error fetching data from the database' });
  }
});

// Obtener documentos de un usuario específico por su nombre //seaarch
router.get('/api/files/cis/user/:name', async (req, res) => {
  const userName = req.params.name;

  try {
    // Consulta para buscar documentos relacionados con el usuario por su nombre
    const query = `
      SELECT d.*, u.name AS user_name
      FROM documents d
      INNER JOIN users u ON d.users_id = u.id
      WHERE u.name = ?
    `;
    const [results] = await db.query(query, [userName]);

    // Convierte los resultados en objetos JSON
    const userDocuments = results.map((row) => {
      return {
        id: row.id,
        date: row.date,
        description: row.description,
        file: row.file,
        users_id: row.users_id,
        user_name: row.user_name, // Incluye el nombre del usuario en la respuesta
      };
    });

    res.status(200).json(userDocuments);
  } catch (error) {
    console.error('Error en la consulta SQL:', error);
    res.status(500).json({ error: 'Error al obtener datos de la base de datos', details: error });
  }
});


// Obtener documentos de un usuario específico con descripciones en el conjunto ["file01", "file02", "file03", "file04", "file05"]
router.get('/api/file/:id/files', async (req, res) => {
  const userId = req.params.id;
  const descriptions = ["file1", "file2", "file3", "file4", "file5"];

  // Crear un marcador de posición para cada descripción en el array.
  const placeholders = descriptions.map(() => '?').join(',');

  // Consulta SQL con los marcadores de posición para las descripciones.
  const query = `SELECT * FROM documents WHERE users_id = ? AND description IN (${placeholders})`;

  try {
    const [results] = await db.query(query, [userId, ...descriptions]);
    if (results.length === 0) {
      return res.status(200).json({ message: 'Usuario no existe o no hay documentos con esas descripciones' });
    }
    res.status(200).json(results);
  } catch (error) {
    console.error('Error al obtener datos de la base de datos:', error);
    res.status(500).json({ error: 'Error al obtener datos de la base de datos' });
  }
});

// Obtener documentos de un usuario específico por su nombre y descripciones // search
router.get('/api/files/documents/user/:name', async (req, res) => {
  const userName = req.params.name;
  const descriptions = ["file1", "file2", "file3", "file4", "file5"];

  // Crear un marcador de posición para cada descripción en el array.
  const placeholders = descriptions.map(() => '?').join(',');

  // Consulta SQL con los marcadores de posición para las descripciones.
  const query = `
    SELECT d.*, u.name AS user_name
    FROM documents d
    INNER JOIN users u ON d.users_id = u.id
    WHERE u.name = ? AND d.description IN (${placeholders})
  `;

  try {
    const [results] = await db.query(query, [userName, ...descriptions]);
    
      return res.status(200).json(results);

  } catch (error) {
    console.error('Error al obtener datos de la base de datos:', error);
    res.status(500).json({ error: 'Error al obtener datos de la base de datos' });
  }
});



module.exports = router;


