/**
 * Project entries — edit this file to add or update portfolio projects.
 * Leave live empty when the project is not deployed.
 * image: path under /public or an imported asset.
 */
export const projects = [
  {
    id: "fittrack",
    name: "FitTrack",
    description:
      "A gym workout and fitness progress tracker for logging workouts, tracking progress, estimating calories, and exporting shareable reports.",
    tech: ["React", "Vite", "Node.js", "Express", "MongoDB", "JWT", "Tailwind CSS", "Recharts"],
    features: [
      "Auth with JWT, protected routes, and profile editing",
      "Workout logging with sets, reps, weight, history, and quick start",
      "Progress charts, PRs, streaks, and nutrition estimates",
      "Shareable PNG progress cards and PDF reports",
    ],
    image: "/projects/fittrack.svg",
    github: "https://github.com/vishalsanwal474-bot/FitTrack.git",
    live: "https://fit-track-chi-orcin.vercel.app/login",
  },
  {
    id: "resonance",
    name: "Resonance — Music Player",
    description:
      "A responsive MERN music player for browsing and searching a library, uploading MP3s with optional cover art, and playing tracks from a sticky player bar.",
    tech: ["React", "Vite", "Node.js", "Express", "MongoDB", "Multer"],
    features: [
      "Browse and search song library",
      "Upload MP3 files with optional cover images",
      "Sticky playback player bar",
      "REST API for songs and media",
    ],
    image: "/projects/music-player.svg",
    github: "https://github.com/vishalsanwal474-bot/Music-Player.git",
    live: "https://music-player-fr-6pm8.onrender.com/",
  },
  {
    id: "expense-tracker",
    name: "Expense Tracker",
    description:
      "A full-stack expense tracking application for managing income and expenses, viewing dashboards, and analyzing spending over time.",
    tech: ["React", "Vite", "Node.js", "Express", "MongoDB", "Recharts"],
    features: [
      "User authentication and account access",
      "Add and categorize income and expense transactions",
      "Dashboard summaries and charts",
      "Category and time-based spending views",
    ],
    image: "/projects/expense-tracker.svg",
    github: "https://github.com/vishalsanwal474-bot/Expense-Tracker-App.git",
    live: "",
  },
  {
    id: "kharidonow",
    name: "KharidoNow",
    description:
      "A light, responsive online clothing store with a customer shop and an admin panel for products, orders, categories, customers, reviews, and coupons.",
    tech: ["Node.js", "Express", "JavaScript", "HTML", "CSS"],
    features: [
      "Customer shop with search, filters, cart, and checkout",
      "Admin CRUD for catalog and order status",
      "Coupons, wishlist, reviews, and order tracking",
      "Account, addresses, and profile management",
    ],
    image: "/projects/kharidonow.svg",
    github: "",
    live: "",
  },
  {
    id: "wedding-point",
    name: "Wedding Point",
    description:
      "A full-stack wedding platform that helps users explore wedding-related services and manage wedding information through a modern web interface.",
    tech: ["React", "Vite", "Node.js", "Express.js", "MongoDB", "JWT"],
    features: [
     "Responsive wedding-focused web interface",
     "User authentication and protected features",
     "Backend REST API with MongoDB database",
    ],
    image: "/projects/wedding-point.svg",
    github: "https://github.com/vishalsanwal474-bot/Wedding-Point.git",
    live: "https://wedding-point.onrender.com/",
    // isPlaceholder: true,
  },
];
