const admin = require('firebase-admin');

const authMiddleware = (req, res, next) => {
  const idToken = req.headers.authorization;

  admin.auth().verifyIdToken(idToken)
    .then((decodedToken) => {
      req.user = decodedToken;
      next();
    })
    .catch((error) => {
      res.status(401).send('Unauthorized');
    });
};

module.exports = authMiddleware;
