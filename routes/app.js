const express = require("express");
const router = express.Router();
const moviesRouter = require("./api_movies.js");
const usersRouter = require("./api_users.js");
const signRouter = require("./api_sign.js");

router.use(moviesRouter);
router.use(usersRouter);
router.use(signRouter);

module.exports = router;
