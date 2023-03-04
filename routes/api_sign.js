const pool = require("../db_server.js");
const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { authentication } = require("../middlewares/auth_user.js");
const signRouter = express.Router();
const secretKey = "SECRET_KEY";

signRouter.use(bodyParser.json());

// Endpoint POST /register
signRouter.post("/register", async (req, res, next) => {
  const { email, password, is_admin } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const checkEmail = `
    SELECT * FROM users 
    WHERE email = $1;
    `;
  pool.query(checkEmail, [email], (err, result) => {
    if (err) next(err);

    if (result.rows.length > 0) {
      res.status(400).json({ message: "email is already taken" });
    } else {
      const insertNewUser = `
        INSERT INTO users 
        (email, password, is_admin) 
        VALUES ($1, $2, $3);
        `;
      pool.query(insertNewUser, [email, hashedPassword, is_admin], (err) => {
        if (err) next(err);

        res.status(201).json({ message: "User has been registered" });
      });
    }
  });
});

// Endpoint POST /login
signRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const findEmail = `
    SELECT * FROM users 
    WHERE email = $1;
  `;
  pool.query(findEmail, [email], async (err, result) => {
    if (err) throw err;
    if (result.rows.length === 0) {
      return res.status(400).send("Email not found");
    } else {
      const user = result.rows[0];
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(400).send("Wrong password");
      }

      // Generate Token
      const accessToken = jwt.sign({ userId: user.id }, secretKey);
      res.send({ accessToken });
    }
  });
});

signRouter.use(authentication);

module.exports = signRouter;
