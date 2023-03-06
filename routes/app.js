const express = require("express");
const router = express.Router();
const moviesRouter = require("./api_movies.js");
const usersRouter = require("./api_users.js");
const signRouter = require("./api_sign.js");

const { authentication } = require("../middlewares/auth_user.js");

router.use(signRouter);
router.use(authentication); // MIDDLEWARE AUTHENTICATION
router.use(moviesRouter);
router.use(usersRouter);

module.exports = router;
