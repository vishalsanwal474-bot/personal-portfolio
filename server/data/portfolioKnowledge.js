/**
 * Backend knowledge used by the AI assistant.
 * Keep this in sync with src/data/* when you update portfolio content.
 * Prefer honesty: empty fields mean "not available".
 * Phone is intentionally private — never add it here.
 */
const portfolioKnowledge = {
  name: "Vishal Sanwal",
  title: "Software Developer | Full-Stack Web Developer",
  bio: "Vishal Sanwal is a software and full-stack web developer who builds modern, responsive web applications and digital solutions. He focuses on practical software — clean interfaces, reliable APIs, and maintainable delivery for businesses and freelance clients.",
  approach:
    "Understand the goal, keep architecture simple, and ship solutions that are maintainable and user-focused.",
  location: "India",
  availability: "Open to freelance projects and full-time roles",
  skills: {
    frontend: ["HTML", "CSS", "JavaScript", "React", "Vite"],
    backend: ["Node.js", "Express.js", "REST APIs"],
    database: ["MongoDB", "MySQL"],
    tools: ["Git", "GitHub", "VS Code", "Cursor"],
  },
  projects: [
    {
      name: "FitTrack",
      description:
        "A gym workout and fitness progress tracker for logging workouts, tracking progress, estimating calories, and exporting shareable reports.",
      tech: ["React", "Vite", "Node.js", "Express", "MongoDB", "JWT", "Tailwind CSS", "Recharts"],
      features: [
        "Auth with JWT and protected routes",
        "Workout logging, history, and quick start",
        "Progress charts, PRs, streaks, nutrition estimates",
        "Shareable PNG cards and PDF reports",
      ],
      github: "https://github.com/vishalsanwal474-bot/FitTrack",
      live: "https://fit-track-chi-orcin.vercel.app/login",
    },
    {
      name: "Resonance — Music Player",
      description:
        "A responsive MERN music player for browsing and searching a library, uploading MP3s with optional cover art, and playing tracks from a sticky player bar.",
      tech: ["React", "Vite", "Node.js", "Express", "MongoDB", "Multer"],
      features: [
        "Browse and search song library",
        "Upload MP3 files with optional covers",
        "Sticky playback player bar",
      ],
      github: "https://github.com/vishalsanwal474-bot/Music-Player",
      live: "https://music-player-fr-6pm8.onrender.com/",
    },
    {
      name: "Expense Tracker",
      description:
        "A full-stack expense tracking application for managing income and expenses, viewing dashboards, and analyzing spending over time. Not deployed live yet — GitHub available.",
      tech: ["React", "Vite", "Node.js", "Express", "MongoDB", "Recharts"],
      features: [
        "Authentication",
        "Income and expense transactions",
        "Dashboard summaries and charts",
      ],
      github: "https://github.com/vishalsanwal474-bot/Expense-Tracker-App",
      live: "",
    },
    {
      name: "KharidoNow",
      description:
        "A light, responsive online clothing store with a customer shop and an admin panel for products, orders, categories, customers, reviews, and coupons. Live demo and GitHub are not published yet.",
      tech: ["Node.js", "Express", "JavaScript", "HTML", "CSS"],
      features: [
        "Customer shop with cart and checkout",
        "Admin catalog and order management",
        "Coupons, wishlist, reviews, order tracking",
      ],
      github: "",
      live: "",
    },
    {
      name: "Wedding Point",
      description:
        "A full-stack wedding platform that helps users explore wedding-related services and manage wedding information through a modern web interface.",
      tech: ["React", "Vite", "Node.js", "Express.js", "MongoDB", "JWT"],
      features: [
        "Responsive wedding-focused web interface",
        "User authentication and protected features",
        "Backend REST API with MongoDB database",
      ],
      github: "https://github.com/vishalsanwal474-bot/Wedding-Point",
      live: "https://wedding-point.onrender.com/",
    },
  ],
  experience: [
    {
      role: "Independent Developer — Personal Projects",
      company: "Self-directed",
      duration: "Ongoing",
      description:
        "Building full-stack web applications including fitness tracking, music playback, expense management, wedding services, and storefront experiences.",
      tech: ["React", "Vite", "Node.js", "Express", "MongoDB"],
    },
  ],
  services: [
    "Web Development — responsive websites and web applications",
    "Full-Stack Development — frontend + backend with APIs and databases",
    "Website Development — modern business and portfolio websites",
    "Bug Fixing & Improvements — debugging, performance, feature updates",
    "Deployment — deploying and configuring web applications",
  ],
  profiles: {
    github: "https://github.com/vishalsanwal474-bot",
    linkedin: "",
    upwork:
      "https://www.upwork.com/freelancers/~01ba17ac29bcea614d?mp_source=share",
    website: "",
  },
  contact: {
    email: "vishalsanwal474@gmail.com",
    phone: "",
  },
  resume: {
    available: false,
    note: "Resume will be added later. For now, direct visitors to the Contact section or Upwork.",
  },
  hiring: {
    note: "Vishal is open to freelance projects and full-time roles. Contact him by email, through the Contact form, or on Upwork.",
  },
};

function buildSystemPrompt(knowledge) {
  return `You are Vishal Sanwal's portfolio assistant on his personal website.
Answer ONLY using the structured portfolio knowledge below.
Be concise, professional, and helpful.
If information is missing, say honestly that you do not have that information yet and suggest contacting Vishal.
Never invent experience, clients, education, certifications, awards, earnings, reviews, ratings, years of experience, or contact details.
Never share a phone number. Phone is private.
If LinkedIn or resume is empty, say it will be available later and offer email/Upwork/Contact instead.
If a project has no live URL, say it is not deployed yet and share the GitHub link when available.
If the visitor seems interested in hiring Vishal, include a short CTA inviting them to use the Contact section or Upwork (if a link exists).
When relevant, suggest action labels from this list only: "Contact Vishal", "View Projects", "View Skills", "View Services", "View GitHub", "View Upwork", "View LinkedIn", "View Resume".

PORTFOLIO KNOWLEDGE (JSON):
${JSON.stringify(knowledge, null, 2)}`;
}

module.exports = {
  portfolioKnowledge,
  buildSystemPrompt,
};
