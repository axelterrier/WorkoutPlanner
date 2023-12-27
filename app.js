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
        res.status(500).send('Erreur lors de la récupération des données' + err.message);
    }
});
  

/*
route pour filtrer selon les besoins, il faut renseigner les champs que l'on veut (aucun=tous)
exemple:
{
  "GroupeMusculaire": "Poitrine",
  "Equipement": "Chest Press",
  "NomExercice": "Développé assis"
  // Ajoutez d'autres champs selon les besoins
}
*/
app.post('/exercices', async (req, res) => {
  try {
      let query = {};
      // Boucle sur tous les paramètres de requête
      for (let param in req.query) {
          // Ajoute le paramètre au filtre de requête si il existe dans le modèle
          if (req.query.hasOwnProperty(param) && Exercice.schema.path(param)) {
              query[param] = req.query[param];
          }
      }

      const exercices = await Exercice.find(query);
      res.json(exercices);
  } catch (err) {
      res.status(500).send('Erreur lors de la récupération des données: ' + err.message);
  }
});
