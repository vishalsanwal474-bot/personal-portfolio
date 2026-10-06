const fs = require("fs");
const path = require("path");
const express = require("express");
const multer = require("multer");
const rateLimit = require("express-rate-limit");
const {
  isAdminConfigured,
  safeEqual,
  signAdminToken,
  requireAdmin,
} = require("../middleware/adminAuth");
const { readContent, writeContent } = require("../services/contentStore");

const router = express.Router();
const uploadsDir = path.join(__dirname, "..", "uploads", "resume");

fs.mkdirSync(uploadsDir, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadsDir),
    filename: (_req, file, cb) => {
      const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "-");
      cb(null, safe.endsWith(".pdf") ? safe : `${safe}.pdf`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF resumes are allowed."));
    }
    return cb(null, true);
  },
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts. Try again later." },
});

router.get("/status", (_req, res) => {
  res.json({ configured: isAdminConfigured() });
});

router.post("/login", loginLimiter, (req, res) => {
  if (!isAdminConfigured()) {
    return res.status(503).json({
      error: "Set ADMIN_PASSWORD in server/.env to enable admin access.",
    });
  }

  const password = String(req.body?.password || "");
  if (!password || !safeEqual(password, process.env.ADMIN_PASSWORD)) {
    return res.status(401).json({ error: "Invalid admin password." });
  }

  return res.json({
    token: signAdminToken(),
    expiresIn: "8h",
  });
});

router.get("/content", requireAdmin, (_req, res) => {
  return res.json({ content: readContent() });
});

router.put("/content", requireAdmin, (req, res) => {
  try {
    const content = writeContent(req.body?.content || req.body || {});
    return res.json({ ok: true, content });
  } catch (error) {
    console.error("[admin] save failed:", error.message);
    return res.status(400).json({ error: "Could not save content." });
  }
});

router.post(
  "/resume",
  requireAdmin,
  (req, res, next) => {
    upload.single("resume")(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: err.message || "Upload failed." });
      }
      return next();
    });
  },
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "PDF file is required." });
    }

    const content = readContent();
    const previous = content.resume?.url || "";
    if (previous.startsWith("/resume/")) {
      const oldPath = path.join(uploadsDir, path.basename(previous));
      if (fs.existsSync(oldPath) && path.basename(oldPath) !== req.file.filename) {
        fs.unlinkSync(oldPath);
      }
    }

    content.resume = {
      url: `/resume/${req.file.filename}`,
      label: content.resume?.label || "Download Resume",
    };
    writeContent(content);

    return res.json({ ok: true, resume: content.resume, content });
  }
);

router.delete("/resume", requireAdmin, (_req, res) => {
  const content = readContent();
  const current = content.resume?.url || "";

  if (current.startsWith("/resume/")) {
    const filePath = path.join(uploadsDir, path.basename(current));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  content.resume = {
    url: "",
    label: content.resume?.label || "Download Resume",
  };
  writeContent(content);

  return res.json({ ok: true, content });
});

module.exports = router;
