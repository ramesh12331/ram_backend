const express = require("express");
const { NoteModel } = require("../models/Note.model");

const noteRouter = express.Router();

noteRouter.post("/create", async (req, res) => {
  try {
    const note = new NoteModel(req.body);
    await note.save();
    res.status(200).send({ message: "new note has been added" });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error.message });
  }
});
noteRouter.get("/", async (req, res) => {
  try {
    const notes = await NoteModel.find({ authorID: req.body.authorID });
    res.status(200).send(notes);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error.message });
  }
});
noteRouter.delete("/delete/:noteID", async (req, res) => {
  const { noteID } = req.params;
  const note = await NoteModel.findOne({ _id: noteID });

  try {
    if (req.body.authorID !== note.authorID) {
      res.status(200).send({ message: "you are not authorized" });
    } else {
      await NoteModel.findByIdAndDelete({ _id: noteID });
      res
        .status(200)
        .send({ message: `the note with ID${noteID} has been delete` });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error.message });
  }
});
noteRouter.patch("/update/:noteID", async (req, res) => {
  const { noteID } = req.params;
  const payload = req.body;

  const note = await NoteModel.findOne({ _id: noteID });
  const userID = req.body.authorID;

  try {
    if (note.authorID !== userID) {
      res.send({ message: "you are not authorized" });
    } else {
      await NoteModel.findByIdAndUpdate({ _id: noteID }, payload);
      res
        .status(200)
        .send({ message: `the note with ID${noteID} has been updated` });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error.message });
  }
});

module.exports = {
  noteRouter,
};
