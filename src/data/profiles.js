import { site } from "./site.js";

/**
 * Professional profile cards.
 * URLs are pulled from site.profiles / site.email so you only update one place.
 */
export const profiles = [
  {
    id: "github",
    name: "GitHub",
    description: "Code repositories, open-source work, and project history.",
    url: site.profiles.github,
    icon: "Github",
    cta: "Visit GitHub",
  },
  {
    id: "upwork",
    name: "Upwork",
    description: "Freelance profile for client work and project inquiries.",
    url: site.profiles.upwork,
    icon: "Briefcase",
    cta: "Visit Upwork",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    description: "Professional network and career updates.",
    url: site.profiles.linkedin,
    icon: "Linkedin",
    cta: "Visit LinkedIn",
  },
  {
    id: "website",
    name: "Portfolio Website",
    description: "This portfolio — projects, skills, and contact details.",
    url: site.profiles.website || "#home",
    icon: "Globe",
    cta: "View Portfolio",
    isInternal: !site.profiles.website,
  },
  {
    id: "email",
    name: "Email",
    description: "Reach out directly for freelance work or opportunities.",
    url: site.email ? `mailto:${site.email}` : "",
    icon: "Mail",
    cta: "Send Email",
  },
];
