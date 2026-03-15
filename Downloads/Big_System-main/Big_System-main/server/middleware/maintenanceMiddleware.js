const maintenanceMiddleware = (req, res, next) => {
  // Check if maintenance mode is enabled
  // You can set this in environment variables or database
  const isMaintenanceMode = process.env.MAINTENANCE_MODE === 'true';
  
  // Allow access to admin routes even during maintenance
  if (isMaintenanceMode && !req.path.startsWith('/api/admin')) {
    return res.status(503).json({
      message: 'Server is currently under maintenance. Please try again later.',
      maintenance: true
    });
  }
  
  next();
};

module.exports = maintenanceMiddleware;
