const { verifyToken } = require('../utils/jwt');

const auth = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];  // Bearer token

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  // Verify token
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }

  req.user = decoded;  // Attach decoded user data to the request object
  next();
};

module.exports = auth;
