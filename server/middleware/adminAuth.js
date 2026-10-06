const crypto = require("crypto");
const jwt = require("jsonwebtoken");

function getJwtSecret() {
  return (
    process.env.ADMIN_JWT_SECRET ||
    process.env.ADMIN_PASSWORD ||
    "dev-only-change-me"
  );
}

function isAdminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD.trim());
}

function safeEqual(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

function signAdminToken() {
  return jwt.sign({ role: "admin" }, getJwtSecret(), { expiresIn: "8h" });
}

function verifyAdminToken(token) {
  const payload = jwt.verify(token, getJwtSecret());
  if (payload?.role !== "admin") {
    throw new Error("Invalid token role");
  }
  return payload;
}

function requireAdmin(req, res, next) {
  try {
    if (!isAdminConfigured()) {
      return res.status(503).json({
        error: "Admin access is not configured on the server.",
      });
    }

    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";
    if (!token) {
      return res.status(401).json({ error: "Admin login required." });
    }

    verifyAdminToken(token);
    return next();
  } catch {
    return res.status(401).json({ error: "Admin session expired. Please log in again." });
  }
}

module.exports = {
  isAdminConfigured,
  safeEqual,
  signAdminToken,
  requireAdmin,
};
