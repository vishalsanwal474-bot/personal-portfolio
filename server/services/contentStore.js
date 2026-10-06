const fs = require("fs");
const path = require("path");

const CONTENT_PATH = path.join(__dirname, "..", "data", "content.json");

function getDefaultContent() {
  return {
    name: "",
    title: "",
    shortTitle: "",
    tagline: "",
    bio: [],
    aboutHighlights: [],
    location: "",
    availability: "",
    email: "",
    profiles: {
      github: "",
      linkedin: "",
      upwork: "",
      website: "",
    },
    resume: {
      url: "",
      label: "Download Resume",
    },
    seo: {
      title: "",
      description: "",
      url: "",
      image: "/og-image.svg",
    },
    skills: [],
    projects: [],
    experience: [],
    services: [],
  };
}

function sanitizeContent(input = {}) {
  const base = getDefaultContent();
  const profiles = {
    ...base.profiles,
    ...(input.profiles || {}),
  };

  // Never accept/store phone from admin payloads
  const cleaned = {
    ...base,
    ...input,
    profiles: {
      github: String(profiles.github || ""),
      linkedin: String(profiles.linkedin || ""),
      upwork: String(profiles.upwork || ""),
      website: String(profiles.website || ""),
    },
    resume: {
      url: String(input.resume?.url || ""),
      label: String(input.resume?.label || "Download Resume"),
    },
    seo: {
      ...base.seo,
      ...(input.seo || {}),
    },
    bio: Array.isArray(input.bio) ? input.bio.map(String) : base.bio,
    aboutHighlights: Array.isArray(input.aboutHighlights)
      ? input.aboutHighlights.map(String)
      : base.aboutHighlights,
    skills: Array.isArray(input.skills) ? input.skills : base.skills,
    projects: Array.isArray(input.projects) ? input.projects : base.projects,
    experience: Array.isArray(input.experience)
      ? input.experience
      : base.experience,
    services: Array.isArray(input.services) ? input.services : base.services,
    name: String(input.name || ""),
    title: String(input.title || ""),
    shortTitle: String(input.shortTitle || ""),
    tagline: String(input.tagline || ""),
    location: String(input.location || ""),
    availability: String(input.availability || ""),
    email: String(input.email || ""),
  };

  delete cleaned.phone;
  return cleaned;
}

function readContent() {
  try {
    const raw = fs.readFileSync(CONTENT_PATH, "utf8");
    return sanitizeContent(JSON.parse(raw));
  } catch {
    return getDefaultContent();
  }
}

function writeContent(content) {
  const cleaned = sanitizeContent(content);
  fs.writeFileSync(CONTENT_PATH, `${JSON.stringify(cleaned, null, 2)}\n`, "utf8");
  return cleaned;
}

function toPublicSite(content) {
  return {
    name: content.name,
    title: content.title,
    shortTitle: content.shortTitle,
    tagline: content.tagline,
    bio: content.bio,
    aboutHighlights: content.aboutHighlights,
    location: content.location,
    availability: content.availability,
    email: content.email,
    phone: "",
    profiles: content.profiles,
    resume: content.resume,
    seo: content.seo,
    chatApiUrl: "/api/chat",
  };
}

function toPortfolioKnowledge(content) {
  return {
    name: content.name,
    title: content.title,
    bio: content.bio.join(" "),
    approach:
      "Understand the goal, keep architecture simple, and ship solutions that are maintainable and user-focused.",
    location: content.location,
    availability: content.availability,
    skills: Object.fromEntries(
      (content.skills || []).map((category) => [
        category.id || category.title?.toLowerCase() || "skills",
        category.skills || [],
      ])
    ),
    projects: (content.projects || []).map((project) => ({
      name: project.name,
      description: project.description,
      tech: project.tech || [],
      features: project.features || [],
      github: project.github || "",
      live: project.live || "",
    })),
    experience: (content.experience || []).map((item) => ({
      role: item.role,
      company: item.company,
      duration: item.duration,
      description: item.description,
      tech: item.tech || [],
    })),
    services: (content.services || []).map(
      (service) => `${service.title} — ${service.description}`
    ),
    profiles: {
      github: content.profiles?.github || "",
      linkedin: content.profiles?.linkedin || "",
      upwork: content.profiles?.upwork || "",
      website: content.profiles?.website || "",
    },
    contact: {
      email: content.email || "",
      phone: "",
    },
    resume: {
      available: Boolean(content.resume?.url),
      note: content.resume?.url
        ? "Resume is available in the Resume section."
        : "Resume will be added later. For now, direct visitors to the Contact section or Upwork.",
    },
    hiring: {
      note: `${content.name || "Vishal"} is open to freelance projects and full-time roles. Contact by email, through the Contact form, or on Upwork.`,
    },
  };
}

module.exports = {
  CONTENT_PATH,
  readContent,
  writeContent,
  sanitizeContent,
  toPublicSite,
  toPortfolioKnowledge,
};
