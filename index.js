const express = require("express");
const { connection } = require("./config/db");
const { userRouter } = require("./routes/User.routes");
const jwt = require("jsonwebtoken");
const { auth } = require("./middleware/auth.middleware");
const { noteRouter } = require("./routes/Note.routes");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

require("dotenv").config();
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Learning API documentation using swagger",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  apis: ["./routes/*.js"],
};

const specification = swaggerJsdoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specification));

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
