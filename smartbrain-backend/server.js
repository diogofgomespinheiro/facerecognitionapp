const express = require("express");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const cors = require("cors");
const knex = require("knex");

if (process.env.NODE_ENV !== "production") require("dotenv").config();

const register = require("./controllers/register");
const signin = require("./controllers/signIn");
const profile = require("./controllers/profile");
const auth = require("./controllers/authorization");

const db = knex({
  client: "pg",
  connection: process.env.POSTGRES_URI
});

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("It is working");
});

app.post("/signIn",signin.signInAuthentication(db, bcrypt));

app.post("/register", (req, res) => { register.handleRegister(req, res, db, bcrypt, saltRounds)});

app.post("/profile/api", auth.requireAuth, profile.handleApiCall());

app.get("/profile/:id", auth.requireAuth, profile.getProfile(db));

app.post("/profile/:id", auth.requireAuth, profile.handleProfileUpdate(db));

app.put("/profile/entries", auth.requireAuth, profile.getEntries(db));

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000 }`);
});
