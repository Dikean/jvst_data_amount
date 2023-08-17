const express = require('express');
const morgan = require('morgan');

const cors = require('cors'); // Agrega esta línea

const usersController = require('./routes/users/usersController'); // Ajusta la ruta según tu estructura
const fileController = require('./routes/documents/fileController')
const amountController = require('./routes/amount/amountController')
const contactsController = require('./routes/users/contacts/contactsController');
const familyController = require('./routes/users/Family/familyController');
const healthyController = require('./routes/users/healthy_conditions/healthyController');
const referencesController = require('./routes/users/References/referencesController');



const app = express();

// Settings
app.set('port', process.env.PORT || 3000);
app.set('json spaces', 2);


// Morgan
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Configurar CORS
app.use(cors()); // Agrega esta línea para habilitar CORS
// Rutas
app.use(usersController);
app.use(fileController);
app.use(amountController);
app.use(contactsController);
app.use(familyController);
app.use(healthyController);
app.use(referencesController);
// Conexión a la base de datos

// Iniciar el servidor
app.listen(app.get('port'), () => {
  console.log(`Servidor corriendo en el puerto ${app.get('port')}`);
});
