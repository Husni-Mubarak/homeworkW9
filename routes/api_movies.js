const pool = require("../db_server.js");
const express = require("express");
const moviesRouter = express.Router();
const { auhorization } = require("../middlewares/auth_user");

// Endoint GET /movies
moviesRouter.get("/movies/:id", (req, res, next) => {
  const { id } = req.params;
  const findQuery = `SELECT * FROM movies WHERE id = $1;`;

  pool.query(findQuery, [id], (err, response) => {
    if (err) next(err);

    if (response.rows.length === 0) {
      next({ name: ":id not found" });
    } else {
      res.status(200).json(response.rows[0]);
    }
  });
});

// Endoint GET /movies
moviesRouter.get("/movies", (req, res) => {
  const limit = req.query.limit || 10;
  const page = req.query.page || 1;
  const offset = (page - 1) * limit;
  const limitQuery = `SELECT COUNT(*) FROM movies`;

  pool.query(limitQuery, (err, countResult) => {
    if (err) throw err;

    const totalMovies = countResult.rows[0].count;
    const totalPages = Math.ceil(totalMovies / limit);

    pool.query(`SELECT * FROM movies LIMIT ${limit} OFFSET ${offset}`, (err, dataResult) => {
      if (err) throw err;

      res.status(200).json({
        movies: dataResult.rows,
        totalMovies: totalMovies,
        currentPage: page,
        totalPages: totalPages,
      });
    });
  });
});

// Endoint POST /movies
moviesRouter.post("/movies", function (req, res) {
  const { title, genres, year } = req.body;
  const insertQuery = `
      INSERT INTO movies
        ("title", "genres", "year")
      VALUES 
        ($1, $2, $3)
  `;

  pool.query(insertQuery, [title, genres, year], (err, response) => {
    if (err) throw err;

    res.status(201).json({
      message: "Movie created successfully",
    });
    console.log(req.body);
  });
});

// Endoint PUT /movies
moviesRouter.put("/movies/:id", (req, res) => {
  const { id } = req.params;
  const { year } = req.body;
  const updateQuery = `
      UPDATE movies
      SET year = $1
      WHERE id = $2;
  `;

  pool.query(updateQuery, [year, id], (err, response) => {
    if (err) throw err;

    res.status(200).json({
      message: "Movie updated successfully",
    });
  });
});

// Endoint DELETE /movies
moviesRouter.delete("/movies/:id", (req, res) => {
  const { id } = req.params;
  const findQuery = `
      SELECT 
          *
      FROM movies
          WHERE id = $1
  `;

  pool.query(findQuery, [id], (err, response) => {
    if (err) throw err;

    if (response.rows[0]) {
      const deleteQuery = `
              DELETE FROM movies
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
        message: "Movie Not Found",
      });
    }
  });
});

module.exports = moviesRouter;
