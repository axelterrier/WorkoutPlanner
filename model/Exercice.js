const mongoose = require('mongoose');

const exerciceSchema = new mongoose.Schema({
    NomExercice: String,
    GroupeMusculaire: [String],
    Equipement: [String],
    Muscle: [String]
});

module.exports = mongoose.model('Exercice', exerciceSchema);
