const mongoose = require("mongoose");

const notesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    userID: {
        type: String,
        required: true
    }
});

const notesModel = mongoose.model("notes", notesSchema);

module.exports = { notesModel };