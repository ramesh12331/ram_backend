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

/**
 * @swagger
 * tags:
 *    name : notes
 *    description: All the api routes related to notes
 */

/**
 * @swagger
 * /notes:
 *    get:
 *      summary: get all notes
 *      tags : [notes]
 *      security:
 *        - bearerAuth: []
 *      responses:
 *          200:
 *             description: the list of all notes.
 *             content:
 *               application/json:
 *                 schema:
 *                    type: array
 *                    items:
 *                      type: object
 *          400:
 *            description: incorrect request
 *          401:
 *            description: unauthorized access
 *
 */

/**
 * @swagger
 * /notes/create:
 *   post:
 *     summary: create a new note
 *     tags: [notes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              properties:
 *                title:
 *                  type: string
 *                body:
 *                   type: string
 *                author:
 *                  type: string
 *                category:
 *                  type: string
 *   responses:
 *     200:
 *       description: new note has been added
 *     400:
 *       description: Error occurred
 *     401:
 *       description: unauthorized access
 */

/**
 * @swagger
 * /notes/delete/{noteID}:
 *    delete:
 *      summary: Delete a specific note
 *      tags: [notes]
 *      parameters:
 *        - in: path
 *          name: noteID
 *          schema:
 *             type: string
 *          required: true
 *          description: the ID of the note to delete
 *    responses:
 *      200:
 *        description: Noted has been deleted
 *      400:
 *        description: Error occurred
 *      401:
 *       description: unauthorized access
 *
 */

/**
 * @swagger
 * /notes/update/{noteID}:
 *    patch:
 *      summary: update a specific note
 *      tags: [notes]
 *      security:
 *       - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: noteID
 *          schema:
 *             type: string
 *          required: true
 *          description: the ID of the note to update
 *    responses:
 *      200:
 *        description: Noted updated successfully
 *      400:
 *        description: Error occurred
 *      401:
 *       description: unauthorized access
 */

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
