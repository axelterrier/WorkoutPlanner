const mongoose = require('mongoose');

const seanceSchema = new mongoose.Schema({
    exercices: [{
        exerciceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Exercice'
        },
        ordreExecution: Number
    }],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Remplacez 'User' par le nom de votre modèle d'utilisateur, si vous en avez un
        default: null
    }
});

module.exports = mongoose.model('Seance', seanceSchema);
