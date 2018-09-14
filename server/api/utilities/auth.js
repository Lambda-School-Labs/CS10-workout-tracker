const jwt = require("jsonwebtoken");
require("dotenv").config();

const secret = process.env.SECRET;

function generateToken(username, userId) {
  const options = {
    expiresIn: "1440m"
  };
  console.log(`About to make a token for ${username}`);
  const payload = { name: username, userId };
  const token = jwt.sign(payload, secret, options);
  console.log("Made the token: ", token);
  return token;
}

function generateResetToken(username, userId) {
  const options = {
    expiresIn: "30m"
  };
  console.log(`About to make a token for ${username}`);
  const payload = { name: username, userId };
  const token = jwt.sign(payload, secret, options);
  console.log("Made the token: ", token);
  return token;
}

function verifyToken(req, res, next) {
  const token = req.headers["x-access-token"];
  if (!token)
    return res
      .status(403)
      .send({ authed: false, message: "No token provided." });
  jwt.verify(token, secret, (err, decoded) => {
    if (err)
      return res
        .status(500)
        .send({ authed: false, message: "The token could not be verified " });
    req.username = decoded.name;
    req.userId = decoded.userId;
    next();
  });
}

module.exports = {
  generateToken,
  generateResetToken,
  verifyToken
};