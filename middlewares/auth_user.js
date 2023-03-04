const jwt = require("jsonwebtoken");
const secretKey = "SECRET_KEY";
const pool = require("../db_server.js");

function authentication(req, res, next) {
  console.log("testing");
  console.log(req.headers);
  const { access_token } = req.headers;
  if (access_token) {
    // BERHASIL
    try {
      const decoded = jwt.verify(access_token, secretKey);
      const { id, email } = decoded;
      const findUser = `
          SELECT * FROM users
          WHERE id = $1;
          `;
      //console.log(decoded)
      pool.query(findUser, [id], (err, result) => {
        if (err) next(err);

        if (result.rows.length === 0) {
          // NOT FOUND
          next({ name: "ErrorNotFound" });
        } else {
          // FOUND USER
          //BERHASIL LOLOS AUTHENTICATION
          const user = result.rows[0];

          req.loggedUser = {
            id: user.id,
            email: user.email,
            is_admin: user.is_admin,
          };
          next();
        }
      });
    } catch (err) {
      //console.log(err)
      next({ name: "JWT error" });
    }
  }
}

function authorization(req, res, next) {
  console.log("testing");
  console.log(req.loggedUser);
  const { is_admin, email, id } = req.loggedUser;
  if (is_admin) {
    // AUTHORIZED
    next();
  } else {
    // UNAUTHORIZED
    next({ name: "Unauthorized" });
  }
}

module.exports = { authentication, authorization };
