const pool = require("../db_server.js");
const express = require("express");
const usersRouter = express.Router();
const { authorization } = require("../middlewares/auth_user");

// Endoint GET /users
usersRouter.get("/users/:id", (req, res) => {
  const { id } = req.params;
  const findQuery = `SELECT * FROM users WHERE id = $1`;

  pool.query(findQuery, [id], (err, response) => {
    if (err) next(err);

    if (response.rows.length === 0) {
      next({ name: ":id users not found" });
    } else {
      res.status(200).json(response.rows[0]);
    }
  });
});

// Endoint GET /users
usersRouter.get("/users", (req, res) => {
  const limit = req.query.limit || 10;
  const page = req.query.page || 1;
  const offset = (page - 1) * limit;
  const limitQuery = `SELECT COUNT(*) FROM users`;

  pool.query(limitQuery, (err, countResult) => {
    if (err) throw err;

    const totalUsers = countResult.rows[0].count;
    const totalPages = Math.ceil(totalUsers / limit);

    pool.query(`SELECT * FROM users LIMIT ${limit} OFFSET ${offset}`, (err, dataResult) => {
      if (err) throw err;

      res.status(200).json({
        users: dataResult.rows,
        totalUsers: totalUsers,
        currentPage: page,
        totalPages: totalPages,
      });
    });
  });
});

// Endoint POST /users
usersRouter.post("/users", function (req, res) {
  const { id, email, gender, password } = req.body;
  const insertQuery = `
      INSERT INTO users
        ("id", "email", "gender", "password")
      VALUES
        ($1, $2, $3, $4);
  `;

  pool.query(insertQuery, [id, email, gender, password], (err, response) => {
    if (err) throw err;

    res.status(201).json({
      message: "User created successfully",
    });
  });
});

// Endoint PUT /users
usersRouter.put("/users", authorization, (req, res) => {
  const alterQuery = `
      ALTER TABLE users
      ADD COLUMN is_admin
      BOOLEAN;
  `;

  pool.query(alterQuery, (err, response) => {
    if (err) throw err;

    res.status(200).json({
      message: "Alter column successfully",
    });
  });
});

// Endoint DELETE /users
usersRouter.delete("/users/:id", authorization, (req, res) => {
  const { id } = req.params;
  const findQuery = `
      SELECT 
          *
      FROM users
          WHERE id = $1
  `;

  pool.query(findQuery, [id], (err, response) => {
    if (err) throw err;

    if (response.rows[0]) {
      const deleteQuery = `
              DELETE FROM users
              WHERE id = $1;
          `;

      pool.query(deleteQuery, [id], (err, response) => {
        if (err) throw err;

        res.status(200).json({
          message: "Deleted successfully",
        });
      });
    } else {
      res.status(404).json({
        message: "Users Not Found",
      });
    }
  });
});

module.exports = usersRouter;
