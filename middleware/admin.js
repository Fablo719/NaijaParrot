module.exports = (req, res, next) => {
  console.log("User in admin middleware:", req.user); // 🔍

  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access only"
    });
  }

  next();
};