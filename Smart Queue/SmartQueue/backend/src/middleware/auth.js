const jwt = require("jsonwebtoken");
const User = require("../models/User");

function getTokenFromHeader(req) {
  const auth = req.headers.authorization || "";
  const [type, token] = auth.split(" ");
  if (type !== "Bearer") return null;
  return token || null;
}

async function requireAuth(req, res, next) {
  try {
    const token = getTokenFromHeader(req);
    if (!token) return res.status(401).json({ message: "Missing Bearer token" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.userId).select("_id name email role");
    if (!user) return res.status(401).json({ message: "Invalid token user" });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  if (req.user.role !== "admin") return res.status(403).json({ message: "Admin only" });
  next();
}

module.exports = { requireAuth, requireAdmin };

