const { Router } = require('express');
const db = require('../../../db'); // Ajusta la ruta según tu estructura
const router = Router();

// Obtener todos los healthy
router.get('/api/healthy', async (req, res) => {
  try {
    const query = `
      SELECT hc.*, u.name AS user_name
      FROM healthy_conditions hc
      INNER JOIN users u ON hc.users_id = u.id
    `;
    const [results, fields] = await db.query(query);
    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener datos de la base de datos' });
  }
});


// Crear un nuevo healthy
router.post('/api/healthy', async (req, res) => {
  try {
    const { alergia, enfermedad, prescripcionMedica, incapacidad, RestriccionAlimenticia, users_id } = req.body;
    const query = `INSERT INTO healthy_conditions (alergia, enfermedad, prescripcionMedica, incapacidad, RestriccionAlimenticia, users_id) VALUES (?, ?, ?, ?, ?, ?)`;
    
    const [result] = await db.query(query, [alergia, enfermedad, prescripcionMedica, incapacidad, RestriccionAlimenticia, users_id]);

    res.status(201).json({ message: 'Condición de salud creada exitosamente', insertedId: result.insertId });
  } catch (error) {
    console.error('Error en la solicitud POST de healthy:', error);
    res.status(500).json({ error: 'Error en la solicitud POST de healthy', details: error.message });
  }
});

// Eliminar un healthy por su ID
router.delete('/api/healthy/:id', async (req, res) => {
  try {
    const fileId = req.params.id;
  
    const query = 'DELETE FROM healthy_conditions WHERE id = ?';
    const [result] = await db.query(query, [fileId]);

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Condición de salud no encontrada' });
    } else {
      res.status(200).json({ message: 'Condición de salud eliminada exitosamente' });
    }
  } catch (error) {
    console.error('Error en la solicitud DELETE de healthy:', error);
    res.status(500).json({ error: 'Error en la solicitud DELETE de healthy', details: error.message });
  }
});

// Obtener healthy de un usuario específico
router.get('/api/healthy/:id/healthy', async (req, res) => {
  try {
    const userId = req.params.id;
    const query = 'SELECT * FROM healthy_conditions WHERE users_id = ?';

    // Ejecuta la consulta en la base de datos utilizando async/await
    const [results] = await db.query(query, [userId]);

    res.status(200).json(results);
  } catch (error) {
    console.error('Error en la solicitud GET de healthy_conditions:', error);
    res.status(500).json({ error: 'Error en la solicitud GET de healthy_conditions', details: error.message });
  }
});

// Actualizar datos de salud de un usuario por su ID
router.put('/api/users/:userId/healthy', async (req, res) => {
  const userId = req.params.userId;
  const { alergia, enfermedad, prescripcionMedica, incapacidad, RestriccionAlimenticia } = req.body;

  try {
    // Verificar si el usuario existe (puedes agregar esta verificación si es necesario)
    const userQuery = 'SELECT * FROM users WHERE id = ?';
    const [userResult] = await db.query(userQuery, [userId]);

    if (!userResult || userResult.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const updateQuery = `
      UPDATE healthy_conditions
      SET alergia = ?, enfermedad = ?, prescripcionMedica = ?, incapacidad = ?, RestriccionAlimenticia = ?
      WHERE users_id = ?
    `;

    await db.query(updateQuery, [alergia, enfermedad, prescripcionMedica, incapacidad, RestriccionAlimenticia, userId]);

    res.status(200).json({ message: 'Datos de salud del usuario actualizados exitosamente' });
  } catch (error) {
    console.error('Error al actualizar datos de salud del usuario:', error);
    res.status(500).json({ error: 'Error al actualizar datos de salud del usuario' });
  }
});



module.exports = router;
