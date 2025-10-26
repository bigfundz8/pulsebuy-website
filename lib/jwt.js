import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET

// JWT Token genereren
export function generateToken(payload, expiresIn = '7d') {
  return jwt.sign(payload, JWT_SECRET, { expiresIn })
}

// JWT Token verifiëren
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

// Middleware voor API routes
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' })
  }

  const decoded = verifyToken(token)
  if (!decoded) {
    return res.status(403).json({ success: false, message: 'Invalid or expired token' })
  }

  req.user = decoded
  next()
}

// Refresh token genereren
export function generateRefreshToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' })
}

export default {
  generateToken,
  verifyToken,
  authenticateToken,
  generateRefreshToken
}
