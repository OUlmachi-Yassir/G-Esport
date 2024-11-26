require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./src/routes/auth');
const eventRoutes = require('./src/routes/eventRoutes');
const cors = require('cors');


const app = express();
app.use(bodyParser.json());
app.use(cors());


mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/sports_app', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connecté à MongoDB'))
  .catch((err) => console.error('Erreur de connexion à MongoDB :', err));

  
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
