const express = require("express");
const signRouter = express.Router();
const pool = require("../db_server.js");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const secretKey = "SECRET_KEY";

// Endpoint POST /register
signRouter.post("/register", (req, res, next) => {
  const { id, email, password, is_admin } = req.body;
  // console.log(req.body);
  // console.log(password);
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  // console.log(hash);
  // const hashedPassword = bcrypt.hashSync(password, salt);
  // console.log(hashedPassword);

  // Periksa apakah email sudah terdaftar
  const checkEmail = `
    SELECT * FROM users 
    WHERE email = $1;
    `;
  pool.query(checkEmail, [email], (err, result) => {
    if (err) next(err);

    if (result.rows.length > 0) {
      next({ name: "email is already" });
    } else {
      const insertUser = `
        INSERT INTO users 
        (id, email, password, is_admin) 
        VALUES ($1, $2, $3, $4);
        `;
      pool.query(insertUser, [id, email, hash, is_admin], (err, result) => {
        if (err) next({ name: "err hash" });

        res.status(201).json({ message: "User has been registered" });
      });
    }
  });
});

// Endpoint POST /login
signRouter.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  const findUser = `
      SELECT 
      *
      FROM users
      WHERE email = $1
  `;

  pool.query(findUser, [email], (err, result) => {
    if (err) next(err);

    if (result.rows.length === 0) {
      // NOT FOUND
      next({ name: "Wrong email" });
    } else {
      // FOUND
      const data = result.rows[0];
      const comparePassword = bcrypt.compareSync(password, data.password);

      if (comparePassword) {
        // PASSWORD BENAR
        const accessToken = jwt.sign(
          {
            id: data.id,
            email: data.email,
          },
          secretKey
        );

        res.status(200).json({
          id: data.id,
          email: data.email,
          is_admin: data.is_admin,
          accessToken: accessToken,
        });
      } else {
        // PASSWORD SALAH
        next({ name: "Wrong password" });
      }
    }
  });
});

module.exports = signRouter;
