const { Router } = require('express');
const db = require('../../db'); // Ajusta la ruta según tu estructura
const router = Router();

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


// Crear un nuevo consignments
router.post('/api/amount', (req, res) => {
    const { date, amount, bank, voucher, users_id } = req.body;
  

    const query = `INSERT INTO consignments (date, amount, bank, voucher, users_id) VALUES (?, ?, ?, ?, ?)`;
     db.query(query, [date, amount, bank, voucher, users_id], (err, result) => {
       if (err) {
         console.log('Error en la consulta SQL:', err);
         res.status(500).json({ error: 'Error al crear un nuevo documento', details: err });
       } else {
         res.status(201).json({ message: 'Documento creado exitosamente' });
       }
     });
    
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
      res.status(200).json(results[0][0]);
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
    res.status(200).json({totalAmount});
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
    res.status(200).json({totalAmount});
  } catch (error) {
    console.error('Error en la consulta SQL:', error);
    res.status(500).json({ error: 'Error al obtener datos de la base de datos', details: error });
  }
});


module.exports = router;


