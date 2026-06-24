const jwt = require('jsonwebtoken');

const authenticateUser = async (req, res, next) => {
  // Check for token in cookies
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ msg: 'Authentication invalid: No token provided' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user payload to the request object
    req.user = { userId: payload.userId, name: payload.name };
    next();
  } catch (error) {
    return res.status(401).json({ msg: 'Authentication invalid: Token verification failed' });
  }
};

module.exports = { authenticateUser };
