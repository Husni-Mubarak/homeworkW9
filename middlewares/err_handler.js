function errorHandler(err, req, res, next) {
  console.log(err);

  // ERROR MOVIES & USERS
  if (err.name === ":id movies not found") {
    res.status(404).json({
      message: "ID MOVIES TIDAK TERSEDIA",
    });
  } else if (err.name === ":id users not found") {
    res.status(404).json({
      message: "ID USERS TIDAK TERSEDIA",
    });
  }

  // ERROR REGISTER & LOGIN
  else if (err.name === "email is already") {
    res.status(400).json({
      message: "EMAIL TELAH DIGUNAKAN",
    });
  } else if (err.name === "err hash") {
    res.status(400).json({
      message: "HASH ERROR",
    });
  } else if (err.name === "Wrong email") {
    res.status(400).json({
      message: "EMAIL YANG ANDA MASUKAN SALAH",
    });
  } else if (err.name === "Wrong password") {
    res.status(400).json({
      message: "PASSWORD YANG ANDA MASUKAN SALAH",
    });
  }

  // ERROR AUTHENTICATION & AUTORIZATION
  else if (err.name === "ErrorNotFound") {
    res.status(400).json({
      message: "TIDAK AUTENTIK",
    });
  } else if (err.name === "JWTerror") {
    res.status(400).json({
      message: "JWT ERROR",
    });
  } else if (err.name === "Unauthenticated") {
    res.status(400).json({
      message: "TOKEN TIDAK AUTENTIK",
    });
  } else if (err.name === "Unauthorized") {
    res.status(401).json({
      message: "HANYA DAPAT DIAKSES OLEH ADMIN",
    });
  }

  // ERROR
  else {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

module.exports = errorHandler;
