const jwt = require('jsonwebtoken');

// Generate a JWT token
const generateToken = (userId) => {
  const payload = { userId };  // You can include other information as needed
  const secretKey = process.env.JWT_SECRET_KEY;  // Make sure to set this secret in your .env file
  const options = { expiresIn: '1h' };  // Token will expire in 1 hour
  
  return jwt.sign(payload, secretKey, options);
};

// Verify a JWT token
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    return decoded;
  } catch (err) {
    return null;  // If token is invalid or expired
  }
};

module.exports = { generateToken, verifyToken };
