const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

function signToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });
}

async function register(req, res) {
  const { name, email, password, role } = req.body || {};
  if (!name || !email || !password) return res.status(400).json({ message: "name, email, password are required" });
  if (String(password).length < 6) return res.status(400).json({ message: "Password must be at least 6 chars" });

  const existing = await User.findOne({ email: String(email).toLowerCase() }).select("_id");
  if (existing) return res.status(409).json({ message: "Email already registered" });

  const hash = await bcrypt.hash(String(password), 10);

  const safeRole = role === "admin" ? "admin" : "student";
  const user = await User.create({
    name: String(name).trim(),
    email: String(email).toLowerCase().trim(),
    password: hash,
    role: safeRole,
  });

  const token = signToken(user._id.toString());
  return res.status(201).json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
}

async function login(req, res) {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ message: "email and password are required" });

  const user = await User.findOne({ email: String(email).toLowerCase().trim() });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(String(password), user.password);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const token = signToken(user._id.toString());
  return res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
}

module.exports = { register, login };

