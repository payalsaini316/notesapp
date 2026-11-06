const express = require("express");

const { notesModel } = require("../model/notes.model");

const notesRouter = express.Router();


// CREATE NOTES
notesRouter.post("/create", async (req, res) => {
    const { title, description } = req.body;

    try {
        const note = new notesModel({
            title,
            description,
            userID: req.userID
        });

        await note.save();

        res.status(201).send({
            msg: "Note Created Successfully",
            note
        });

    } catch (error) {
        res.status(500).send({
            msg: "Can't Create Note",
            error: error.message
        });
    }
});


// READ ALL NOTES
notesRouter.get("/read", async (req, res) => {
    try {
        const notes = await notesModel.find({
            userID: req.userID
        });

        res.send(notes);

    } catch (error) {
        res.status(500).send({
            msg: "Can't Read Notes",
            error: error.message
        });
    }
});


// READ NOTES BY ID
notesRouter.get("/read/:id", async (req, res) => {
    const { id } = req.params;

    try {
        if (!require("mongoose").isValidObjectId(id)) {
            return res.status(400).send({
                msg: "Invalid Note ID"
            });
        }

        const note = await notesModel.findOne({
            _id: id,
            userID: req.userID
        });

        if (!note) {
            return res.status(404).send({
                msg: "Note Not Found"
            });
        }

        res.send(note);

    } catch (error) {
        res.status(500).send({
            msg: "Can't Read Note"
        });
    }
});


// UPDATE NOTES
notesRouter.patch("/update/:id", async (req, res) => {
    const { id } = req.params;

    try {
        if (!require("mongoose").isValidObjectId(id)) {
            return res.status(400).send({
                msg: "Invalid Note ID"
            });
        }

        const note = await notesModel.findOneAndUpdate(
            {
                _id: id,
                userID: req.userID
            },
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!note) {
            return res.status(404).send({
                msg: "Note Not Found"
            });
        }

        res.send({
            msg: "Note Updated Successfully",
            note
        });

    } catch (error) {
        res.status(500).send({
            msg: "Can't Update Note",
            error: error.message
        });
    }
});


// DELETE NOTES
notesRouter.delete("/delete/:id", async (req, res) => {
    const { id } = req.params;

    try {
        if (!require("mongoose").isValidObjectId(id)) {
            return res.status(400).send({
                msg: "Invalid Note ID"
            });
        }

        const note = await notesModel.findOneAndDelete({
            _id: id,
            userID: req.userID
        });

        if (!note) {
            return res.status(404).send({
                msg: "Note Not Found"
            });
        }

        res.send({
            msg: "Note Deleted Successfully"
        });

    } catch (error) {
        res.status(500).send({
            msg: "Can't Delete Note",
            error: error.message
        });
    }
});


module.exports = { notesRouter };