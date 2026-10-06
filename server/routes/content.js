const express = require("express");
const { readContent, toPublicSite } = require("../services/contentStore");

const router = express.Router();

router.get("/", (_req, res) => {
  const content = readContent();
  res.json({
    site: toPublicSite(content),
    skills: content.skills,
    projects: content.projects,
    experience: content.experience,
    services: content.services,
  });
});

module.exports = router;
