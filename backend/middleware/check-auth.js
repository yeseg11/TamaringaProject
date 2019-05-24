const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; //we want the second word after bearer
    jwt.verify(token, process.env.JWT_KEY); //verufying the token with the secret string that used when token has created
    next();
  } catch (error) {
    res.status(401).json({message: "You are not authenticated!" });
  }
};
