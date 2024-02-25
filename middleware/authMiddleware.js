const { getAuth } = require('firebase/auth');

const authMiddleware = async (req, res, next) => {
  const idToken = req.headers.authorization;

  try {
    const decodedToken = await getAuth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    res.status(401).json({ error: 'Unauthorized' });
  }
};

module.exports = authMiddleware;
