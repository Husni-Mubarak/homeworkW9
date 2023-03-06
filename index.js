const express = require("express");
const errorHandler = require("./middlewares/err_handler.js");
const app = express();
const router = require("./routes/app.js");
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(router);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Connected server port ${port}`);
});
