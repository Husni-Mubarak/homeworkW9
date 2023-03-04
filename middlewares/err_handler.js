function errorHandler(err, req, res, next) {
  console.log(err);
  if (err.name === ":id not found") {
    res.status(404).json({
      message: "Movies Not Found",
    });
  } else {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

module.exports = errorHandler;
