require("dotenv").config();
const express = require("express");
const app = express();
const massive = require("massive");
const session = require("express-session");
const PORT = 4000;
const { CONNECTION_STRING, SESSION_SECRET } = process.env;
const ac = require("./controllers/authController");
const treasureController = require("./controllers/treasureController");
const auth = require("./middleware/authMiddleware");

app.use(express.json());

massive(CONNECTION_STRING).then(db => {
  app.set("db", db);
  console.log("Database Connected");
});

app.use(
  session({
    resave: true,
    saveUninitialized: false,
    secret: SESSION_SECRET
  })
);

app.post("/auth/register", ac.register);
app.post("/auth/login", ac.login);
app.get("/auth/logout", ac.logout);
app.get("/api/treasure/dragon", treasureController.dragonTreasure);
app.get(
  "/api/treasure/user",
  auth.usersOnly,
  treasureController.getUserTreasure
);
app.post(
  "/api/treasure/user",
  auth.usersOnly,
  treasureController.addUserTreasure
);
app.get(
  "/api/treasure/all",
  auth.usersOnly,
  auth.adminsOnly,
  treasureController.getAllTreasure
);

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
