const path = require("path");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");
const chatRouter = require("./routes/chat");
const contentRouter = require("./routes/content");
const adminRouter = require("./routes/admin");
const { isConfigured } = require("./services/aiService");
const { isAdminConfigured } = require("./middleware/adminAuth");

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const distPath = path.join(__dirname, "..", "dist");
const resumePath = path.join(__dirname, "uploads", "resume");
const serveFrontend = fs.existsSync(path.join(distPath, "index.html"));

fs.mkdirSync(resumePath, { recursive: true });

const allowedOrigins = CLIENT_ORIGIN.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      if (serveFrontend && NODE_ENV === "production") {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
  })
);

app.use(express.json({ limit: "1mb" }));
app.use("/resume", express.static(resumePath));

const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many chat requests. Please wait a moment and try again.",
  },
});

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    aiConfigured: isConfigured(),
    adminConfigured: isAdminConfigured(),
    servingFrontend: serveFrontend,
  });
});

app.use("/api/content", contentRouter);
app.use("/api/admin", adminRouter);
app.use("/api/chat", chatLimiter, chatRouter);

if (serveFrontend) {
  app.use(express.static(distPath));
  app.get(/^(?!\/api)(?!\/resume).*/, (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.use((err, _req, res, _next) => {
  if (err?.type === "entity.too.large") {
    return res.status(413).json({ error: "Request body is too large." });
  }
  if (err?.message === "Not allowed by CORS") {
    return res.status(403).json({ error: "Origin not allowed." });
  }
  console.error("[server] error:", err.message);
  return res.status(500).json({ error: "Server error." });
});

app.listen(PORT, () => {
  console.log(`Portfolio server running on http://localhost:${PORT}`);
  console.log(
    isConfigured()
      ? "AI provider: configured"
      : "AI provider: not configured — using local fallback answers"
  );
  console.log(
    isAdminConfigured()
      ? "Admin panel: enabled (open site with #admin)"
      : "Admin panel: disabled — set ADMIN_PASSWORD in server/.env"
  );
  console.log(
    serveFrontend
      ? `Serving frontend from ${distPath}`
      : "Frontend dist/ not found — API only (run npm run build for production)"
  );
});
