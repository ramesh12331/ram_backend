const express = require("express");
const { connection } = require("./config/db");
const { userRouter } = require("./routes/User.routes");
const jwt = require("jsonwebtoken");
const { auth } = require("./middleware/auth.middleware");
const { noteRouter } = require("./routes/Note.routes");
require("dotenv").config();
var cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/users", userRouter);

app.use(auth);
app.use("/notes", noteRouter);

app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log("connected to database");
  } catch (error) {
    console.log(error);
  }
  console.log(`running at${process.env.port} `);
});

//protected
// app.use(auth);
// app.get("/movies", (req, res) => {
//   res.status(200).send("movie data");
// });
// app.get("/series", (req, res) => {
//   res.status(200).send("series data");
// });
