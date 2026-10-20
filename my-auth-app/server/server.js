require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

// ---- in-memory "DB" for demo (swap for MongoDB/Postgres later) ----
const users = [];

// ---- middlewares ----
function authMiddleware(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: "No token provided" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}

const requireRole = (...roles) => (req, res, next) =>
  roles.some((r) => req.user.roles.includes(r))
    ? next()
    : res.status(403).json({ message: "Forbidden" });

// ---- routes ----
app.post("/api/signup", async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email and password required" });
  if (users.find((u) => u.email === email))
    return res.status(409).json({ message: "User already exists" });

  const user = {
    id: users.length + 1,
    email,
    passwordHash: await bcrypt.hash(password, 10),
    roles: [role === "admin" ? "admin" : "user"],
  };
  users.push(user);

  const payload = { id: user.id, email: user.email, roles: user.roles };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.status(201).json({ token, user: payload });
});

app.post("/api/login", async (req, res) => {
  const user = users.find((u) => u.email === req.body.email);
  if (!user || !(await bcrypt.compare(req.body.password || "", user.passwordHash)))
    return res.status(401).json({ message: "Invalid credentials" });

  const payload = { id: user.id, email: user.email, roles: user.roles };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ token, user: payload });
});

app.get("/api/profile", authMiddleware, (req, res) => {
  res.json({ email: req.user.email, roles: req.user.roles });
});

app.get("/api/admin", authMiddleware, requireRole("admin"), (req, res) => {
  res.json({ message: "Admin data", totalUsers: users.length });
});

app.listen(process.env.PORT, () => console.log("API running on :5000"));