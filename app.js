const express = require('express');
const mongoose = require('mongoose');
const Exercice = require('./model/Exercice');
const Seance = require('./model/Seance');
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
app.get('/exercices', async (req, res) => {
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


//Ajouter à la query ?motsCles=mot1+mot2
app.get('/exercices/recherche', async (req, res) => {
  try {
    let query = {};
    const keywords = req.query.motsCles;

    if (keywords) {
      const regex = new RegExp("\\b" + keywords.split(' ').join('\\b|\\b') + "\\b", 'i');
      query.NomExercice = { $regex: regex };
    } else {
      // Si aucun mot-clé n'est fourni, renvoyer un message d'erreur
      return res.status(400).send({ message: "Aucun mot-clé spécifié. Veuillez fournir un mot-clé pour la recherche." });
    }

    const exercices = await Exercice.find(query).select('NomExercice -_id').limit(5);

    // Vérifier si des exercices ont été trouvés
    if (exercices.length > 0) {
      res.json(exercices);
    } else {
      // Aucun exercice n'a été trouvé, renvoyer un message personnalisé
      res.status(404).send({ message: "Aucun exercice correspondant aux mots-clés n'a été trouvé.\nEssayez avec un autre mot clé" });
    }
  } catch (err) {
    res.status(500).send('Erreur lors de la recherche des exercices: ' + err.message);
  }
});


// Aucun exercice sans equipement
// app.get('/exercices/sans-equipement', async (req, res) => {
//   try {
//       // Recherche d'exercices où le tableau 'Equipement' est vide, c'est-à-dire sa taille est de zéro
//       const exercicesSansEquipement = await Exercice.find({ Equipement: { $size: 0 } });
//       res.json(exercicesSansEquipement);
//   } catch (err) {
//       res.status(500).send('Erreur lors de la récupération des exercices sans équipement: ' + err.message);
//   }
// });



//Juste besoin d'ajouter un '/' avec le nom de l'équipement (je l'ai rendu insensible à la casse)
app.get('/exercices/equipement/:nomEquipement', async (req, res) => {
  try {
    const nomEquipement = req.params.nomEquipement;

    // Créer une expression régulière pour rendre la recherche insensible à la casse
    const regex = new RegExp("^" + nomEquipement + "$", 'i');

    const exercices = await Exercice.find({ Equipement: { $regex: regex } });
    
    if (exercices.length > 0) {
      res.json(exercices);
    } else {
      res.status(404).send({ message: "Aucun exercice trouvé pour l'équipement spécifié." });
    }
  } catch (err) {
    res.status(500).send('Erreur lors de la récupération des exercices pour l\'équipement spécifié: ' + err.message);
  }
});

app.post('/seance/create', async (req, res) => {
  try {
      // Créer une nouvelle séance avec les données reçues dans le corps de la requête
      const nouvelleSeance = new Seance(req.body);

      // Enregistrer la séance dans la base de données
      await nouvelleSeance.save();

      // Envoyer une réponse réussie
      res.status(201).json(nouvelleSeance);
  } catch (err) {
      // Gérer les erreurs
      res.status(400).send('Erreur lors de la création de la séance: ' + err.message);
  }
});
