const express = require('express');
const mongoose = require('mongoose');
const Exercice = require('./model/Exercice'); 
const app = express();

// Middleware pour parser le JSON
app.use(express.json());

mongoose.connect('mongodb+srv://axelterrier:anrESoisw4kpbfyC@workoutplanner.7lx9gsr.mongodb.net/ExercicesDB?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connecté à MongoDB'))
  .catch(err => console.error('Erreur de connexion à MongoDB', err));

// Démarrez le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur en écoute sur le port ${PORT}`);
});

app.get('/', async (req, res) => {
    try {
        const exercices = await Exercice.find(); // Récupère tous les documents
        res.json(exercices);
    } catch (err) {
        res.status(500).send('Erreur lors de la récupération des données');
    }
});
  