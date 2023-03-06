const jwt = require("jsonwebtoken");
const secretKey = "SECRET_KEY";
const pool = require("../db_server.js");

function authentication(req, res, next) {
  // console.log(req.headers);
  const { access_token } = req.headers;

  if (access_token) {
    // BERHASIL LOGIN
    try {
      const decoded = jwt.verify(access_token, secretKey);
      const { id, email } = decoded;
      const findUser = `
        SELECT * FROM users
        WHERE id = $1;
        `;
      pool.query(findUser, [id], (err, result) => {
        if (err) next(err);

        if (result.rows.length === 0) {
          // NOT FOUND
          next({ name: "ErrorNotFound" });
        } else {
          // FOUND USER
          // BERHASIL LOLOS AUTHENTICATION
          const user = result.rows[0];

          req.loggedUser = {
            id: user.id,
            email: user.email,
          };
          // console.log(req.loggedUser);
          next();
        }
      });

      // console.log(decoded);
    } catch (err) {
      next({ name: "JWTerror" });
    }
  } else {
    //GAGAL LOGIN

    next({ name: "Unauthenticated" });
  }
}

function authorization(req, res, next) {
  // console.log("testing");
  const { id, email, is_admin } = req.loggedUser;
  console.log(req.loggedUser);
  
  if (is_admin) { 
    // AUTHORIZED
    next();
  } else {
    // UNAUTHORIZED
    next({ name: "Unauthorized" });
  }
}

module.exports = { authentication, authorization };
