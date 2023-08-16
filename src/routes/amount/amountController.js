const { Router } = require('express');
const db = require('../../db'); // Ajusta la ruta según tu estructura
const router = Router();

//delete
// Array global de ejemplo para almacenar datos
const exampleData = [
  {
    id: 1,
    date: '2023-08-15',
    amount: 1500,
    bank: 'bancolombia',
    voucher: '12345',
    users_id: 123,
  },
  {
    id: 2,
    date: '2023-08-14',
    amount: 2000,
    bank: 'nequi',
    voucher: '67890',
    users_id: 456,
  },
  // Agrega más datos aquí
  {
    id: 3,
    date: '2023-08-13',
    amount: 3000,
    bank: 'bancolombia',
    voucher: '23456',
    users_id: 789,
  },
  {
    id: 4,
    date: '2023-08-12',
    amount: 2500,
    bank: 'nequi',
    voucher: '34567',
    users_id: 123,
  },
  {
    id: 5,
    date: '2023-08-11',
    amount: 1800,
    bank: 'bancolombia',
    voucher: '45678',
    users_id: 456,
  },
  {
    id: 6,
    date: '2023-08-10',
    amount: 2100,
    bank: 'nequi',
    voucher: '56789',
    users_id: 789,
  },
  {
    id: 7,
    date: '2023-08-09',
    amount: 2700,
    bank: 'bancolombia',
    voucher: '67890',
    users_id: 123,
  },
  {
    id: 8,
    date: '2023-08-08',
    amount: 1900,
    bank: 'nequi',
    voucher: '78901',
    users_id: 456,
  },
  {
    id: 9,
    date: '2023-08-07',
    amount: 2300,
    bank: 'bancolombia',
    voucher: '89012',
    users_id: 789,
  },
  {
    id: 10,
    date: '2023-08-06',
    amount: 2600,
    bank: 'nequi',
    voucher: '90123',
    users_id: 123,
  },

  {
    id: 11,
    date: '2023-08-05',
    amount: 1750,
    bank: 'bancolombia',
    voucher: '34567',
    users_id: 789,
  },
  {
    id: 12,
    date: '2023-08-04',
    amount: 2100,
    bank: 'nequi',
    voucher: '45678',
    users_id: 123,
  },
  {
    id: 13,
    date: '2023-08-03',
    amount: 1850,
    bank: 'bancolombia',
    voucher: '56789',
    users_id: 456,
  },
  {
    id: 14,
    date: '2023-08-02',
    amount: 2300,
    bank: 'nequi',
    voucher: '67890',
    users_id: 789,
  },
  {
    id: 15,
    date: '2023-08-01',
    amount: 2500,
    bank: 'bancolombia',
    voucher: '78901',
    users_id: 123,
  },
];


// Obtener todos los consignments
router.get('/api/amount', (req, res) => {

  res.status(200).json(exampleData);

  // const query = 'SELECT * FROM consignments';
  // db.query(query, (err, results) => {
  //   if (err) {
  //     res.status(500).json({ error: 'Error al obtener datos de la base de datos' });
  //   } else {
  //     res.status(200).json(results);
  //   }
  // });
});

// Crear un nuevo consignments
router.post('/api/amount', (req, res) => {
    const { date, amount, bank, voucher, users_id } = req.body;
  
    //delete
    const newConsignation = {
      id: exampleData.length + 1,
      date,
      amount,
      bank,
      voucher,
      users_id,
    };
    exampleData.push(newConsignation);
    res.status(201).json({ message: 'Consignacion creado exitosamente' });
     //end delete

    // const query = `INSERT INTO consignments (date, amount, bank, voucher, users_id) VALUES (?, ?, ?, ?, ?)`;
    // db.query(query, [date, amount, bank, voucher, users_id], (err, result) => {
    //   if (err) {
    //     console.log('Error en la consulta SQL:', err);
    //     res.status(500).json({ error: 'Error al crear un nuevo documento', details: err });
    //   } else {
    //     res.status(201).json({ message: 'Documento creado exitosamente' });
    //   }
    // });
    
  });

// Eliminar un consignments por su ID
router.delete('/api/amount/:id', (req, res) => {
    const fileId = req.params.id;

    //delete
    const index = exampleData.findIndex((item) => item.id === parseInt(fileId));
    if (index !== -1) {
    exampleData.splice(index, 1);
    res.status(200).json({ message: 'consigment eliminado exitosamente' });
    } else {
    res.status(404).json({ error: 'consigment no encontrado' });
    }
    //end delete
  
    // const query = 'DELETE FROM consignments WHERE id = ?';
    // db.query(query, [fileId], (err, result) => {
    //   if (err) {
    //     console.log('Error en la consulta SQL:', err);
    //     res.status(500).json({ error: 'Error al eliminar el documento', details: err });
    //   } else {
    //     res.status(200).json({ message: 'Documento eliminado exitosamente' });
    //   }
    // });

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

  //delte
  const totalAmount = 4750; // Número fijo como ejemplo
  res.status(200).json({ totalAmount });
   //end delete
  // const bankName = 'bancolombia'; // Cambia esto según cómo esté almacenado el nombre del banco en tu base de datos

  // const query = 'SELECT SUM(amount) AS totalAmount FROM consignments WHERE bank = ?';
  // db.query(query, [bankName], (err, result) => {
  //   if (err) {
  //     res.status(500).json({ error: 'Error al obtener datos de la base de datos' });
  //   } else {
  //     const totalAmount = result[0].totalAmount;
  //     res.status(200).json({ totalAmount });
  //   }
  // });
});

// Obtener la suma total de los montos de consignaciones de Nequi
router.get('/api/amount/nequi/total', (req, res) => {
  
  //delete
   const totalAmountnequi = 4750; // Número fijo como ejemplo
   res.status(200).json({ totalAmountnequi });
    //end delete
 
  // const bankName = 'nequi'; // Cambia esto según cómo esté almacenado el nombre del banco en tu base de datos

  // const query = 'SELECT SUM(amount) AS totalAmount FROM consignments WHERE bank = ?';
  // db.query(query, [bankName], (err, result) => {
  //   if (err) {
  //     res.status(500).json({ error: 'Error al obtener datos de la base de datos' });
  //   } else {
  //     const totalAmount = result[0].totalAmount;
  //     res.status(200).json({ totalAmount });
  //   }
  // });
});


module.exports = router;


