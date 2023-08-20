const { Router } = require('express');
const db = require('../../db'); // Ajusta la ruta según tu estructura
const router = Router();
const express = require('express');
const app = express();

const multer = require('multer');
const storage = multer.memoryStorage(); // Almacena los archivos en memoria
const upload = multer({ storage: storage });

// Obtener todos los consignments //ok

router.get('/api/amount', async (req, res) => {
  try {
    const query = 'SELECT * FROM consignments';
    const [results, fields] = await db.query(query); // Utiliza db.promise().query() para trabajar con promesas
    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener datos de la base de datos' });
  }
});


// Ruta para crear una nueva consignación con un archivo adjunto
const path = require('path');
const fs = require('fs');


router.post('/api/amount', upload.single('voucher'), async (req, res) => {
  const { date, amount, bank, users_id } = req.body;
  const voucher = req.file; // El archivo adjunto estará disponible en req.file

  try {
    // Asegúrate de que req.file contiene el archivo y su contenido
    if (!voucher) {
      return res.status(400).json({ error: 'Debes adjuntar un archivo' });
    }

    // Almacena el archivo en el directorio 'uploads' en tu servidor
    const uploadDir = path.join(__dirname, 'uploads');
    const fileName = `${Date.now()}-${voucher.originalname}`;
    const filePath = path.join(uploadDir, fileName);

    fs.writeFileSync(filePath, voucher.buffer);

    // Genera la URL para el archivo
    const fileUrl = `/uploads/${fileName}`;

    // Luego, puedes insertar los datos en tu base de datos
    const query = `
      INSERT INTO consignments (date, amount, bank, voucher, users_id)
      VALUES (?, ?, ?, ?, ?)
    `;

    await db.query(query, [date, amount, bank, fileUrl, users_id]);

    res.status(201).json({ message: 'Consignación creada exitosamente' });
  } catch (error) {
    console.error('Error al insertar consignación:', error);
    res.status(500).json({ error: 'Error al insertar consignación' });
  }
});




// Eliminar un consignments por su ID
 router.delete('/api/amount/:id', async (req, res) => {
    const fileId = req.params.id;
  
    try {
      const query = 'DELETE FROM consignments WHERE id = ?';
      const result = await db.query(query, [fileId]);
      
      if (result[0].affectedRows === 0) {
        res.status(404).json({ error: 'amount no encontrado' });
      } else {
        res.status(200).json({ message: 'amount eliminado exitosamente' });
      }
    } catch (error) {
      console.error('Error en la consulta SQL:', error);
      res.status(500).json({ error: 'Error al eliminar el amount', details: error });
    }
  });
  

  // Obtener consignments8 de un usuario específico
  router.get('/api/amount/:id/amount', async (req, res) => {
    const userId = req.params.id;
  
    try {
      const query = 'SELECT * FROM consignments WHERE users_id = ?';
      const results = await db.query(query, [userId]);
      res.status(200).json(results[0]);
    } catch (error) {
      console.error('Error en la consulta SQL:', error);
      res.status(500).json({ error: 'Error al obtener datos de la base de datos', details: error });
    }
  });
  

 // Obtener la suma total de los montos de consignaciones de Bancolombia //ok
 router.get('/api/amount/bancolombia/total', async (req, res) => {
  try {
    const bankName = 'bancolombia'; // Cambia esto según cómo esté almacenado el nombre del banco en tu base de datos

    const query = 'SELECT SUM(amount) AS totalAmount FROM consignments WHERE bank = ?';
    const result = await db.query(query, [bankName]);

    const totalAmount = result[0][0].totalAmount;
    res.status(200).json(totalAmount);
  } catch (error) {
    console.error('Error en la consulta SQL:', error);
    res.status(500).json({ error: 'Error al obtener datos de la base de datos', details: error });
  }
});


// Obtener la suma total de los montos de consignaciones de Nequi //ok
router.get('/api/amount/nequi/total', async (req, res) => {
  try {
    const bankName = 'nequi'; // Cambia esto según cómo esté almacenado el nombre del banco en tu base de datos

    const query = 'SELECT SUM(amount) AS totalAmount FROM consignments WHERE bank = ?';
    const result = await db.query(query, [bankName]);

    const totalAmount = result[0][0].totalAmount;
    res.status(200).json(totalAmount);
  } catch (error) {
    console.error('Error en la consulta SQL:', error);
    res.status(500).json({ error: 'Error al obtener datos de la base de datos', details: error });
  }
});


module.exports = router;


