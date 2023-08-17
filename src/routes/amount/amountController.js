const { Router } = require('express');
const db = require('../../db'); // Ajusta la ruta según tu estructura
const router = Router();

// Obtener todos los consignments
router.get('/api/amount', (req, res) => {

   const query = 'SELECT * FROM consignments';
   db.query(query, (err, results) => {
     if (err) {
       res.status(500).json({ error: 'Error al obtener datos de la base de datos' });
     } else {
       res.status(200).json(results);
   }
   });
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
router.delete('/api/amount/:id', (req, res) => {
    const fileId = req.params.id;

   
  
    const query = 'DELETE FROM consignments WHERE id = ?';
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
router.get('/api/amount/:id/amount', (req, res) => {
    const userId = req.params.id;
    const query = 'SELECT * FROM consignments WHERE users_id = ?';
    db.query(query, [userId], (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Error al obtener datos de la base de datos' });
      } else {
        res.status(200).json(results);
      }
    });
  });

 // Obtener la suma total de los montos de consignaciones de Bancolombia
router.get('/api/amount/bancolombia/total', (req, res) => {

 
   const bankName = 'bancolombia'; // Cambia esto según cómo esté almacenado el nombre del banco en tu base de datos

   const query = 'SELECT SUM(amount) AS totalAmount FROM consignments WHERE bank = ?';
   db.query(query, [bankName], (err, result) => {
     if (err) {
       res.status(500).json({ error: 'Error al obtener datos de la base de datos' });
     } else {
       const totalAmount = result[0].totalAmount;
       res.status(200).json({ totalAmount });
     }
   });
});

// Obtener la suma total de los montos de consignaciones de Nequi
router.get('/api/amount/nequi/total', (req, res) => {
  

 
  const bankName = 'nequi'; // Cambia esto según cómo esté almacenado el nombre del banco en tu base de datos

   const query = 'SELECT SUM(amount) AS totalAmount FROM consignments WHERE bank = ?';
   db.query(query, [bankName], (err, result) => {
     if (err) {
       res.status(500).json({ error: 'Error al obtener datos de la base de datos' });
     } else {
       const totalAmount = result[0].totalAmount;
       res.status(200).json({ totalAmount });
     }
   });
});


module.exports = router;


