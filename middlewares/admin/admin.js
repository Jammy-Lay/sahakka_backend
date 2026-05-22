exports.superAdminOnly = (req, res, next) => {
  try {
    if (req.user.role !== 'super_admin') {
      return res.status(403).json({
        result: false,
        message: 'Access denied'
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      result: false,
      message: error.message
    });
  }
};