// middleware/admin.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Middleware to check if user is an admin
const adminMiddleware = async (req, res, next) => {
  try {
    // The auth middleware should already have added the user object to the request
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    // Get user from database to check admin status
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { isAdmin: true }
    });
    
    if (!user || !user.isAdmin) {
      return res.status(403).json({ 
        message: 'Access denied. Admin privileges required for this resource.' 
      });
    }
    
    // User is an admin, proceed to next middleware or controller
    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({ message: 'Server error in authorization process' });
  }
};

module.exports = adminMiddleware;