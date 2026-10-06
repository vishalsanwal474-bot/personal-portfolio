import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { site as fallbackSite } from "../data/site";
import { skillCategories as fallbackSkills } from "../data/skills";
import { projects as fallbackProjects } from "../data/projects";
import { experience as fallbackExperience } from "../data/experience";
import { services as fallbackServices } from "../data/services";

const ContentContext = createContext(null);
const ADMIN_TOKEN_KEY = "portfolio_admin_token";

function buildProfiles(siteData) {
  return [
    {
      id: "github",
      name: "GitHub",
      description: "Code repositories, open-source work, and project history.",
      url: siteData.profiles?.github || "",
      icon: "Github",
      cta: "Visit GitHub",
    },
    {
      id: "upwork",
      name: "Upwork",
      description: "Freelance profile for client work and project inquiries.",
      url: siteData.profiles?.upwork || "",
      icon: "Briefcase",
      cta: "Visit Upwork",
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      description: "Professional network and career updates.",
      url: siteData.profiles?.linkedin || "",
      icon: "Linkedin",
      cta: "Visit LinkedIn",
    },
    {
      id: "website",
      name: "Portfolio Website",
      description: "This portfolio — projects, skills, and contact details.",
      url: siteData.profiles?.website || "#home",
      icon: "Globe",
      cta: "View Portfolio",
      isInternal: !siteData.profiles?.website,
    },
    {
      id: "email",
      name: "Email",
      description: "Reach out directly for freelance work or opportunities.",
      url: siteData.email ? `mailto:${siteData.email}` : "",
      icon: "Mail",
      cta: "Send Email",
    },
  ];
}

export function ContentProvider({ children }) {
  const [site, setSite] = useState(fallbackSite);
  const [skills, setSkills] = useState(fallbackSkills);
  const [projects, setProjects] = useState(fallbackProjects);
  const [experience, setExperience] = useState(fallbackExperience);
  const [services, setServices] = useState(fallbackServices);
  const [loading, setLoading] = useState(true);
  const [adminToken, setAdminToken] = useState(
    () => localStorage.getItem(ADMIN_TOKEN_KEY) || ""
  );

  const refreshContent = useCallback(async () => {
    try {
      const res = await fetch("/api/content");
      if (!res.ok) throw new Error("Failed to load content");
      const data = await res.json();
      if (data.site) setSite({ ...fallbackSite, ...data.site, phone: "" });
      if (Array.isArray(data.skills)) setSkills(data.skills);
      if (Array.isArray(data.projects)) setProjects(data.projects);
      if (Array.isArray(data.experience)) setExperience(data.experience);
      if (Array.isArray(data.services)) setServices(data.services);
    } catch {
      // Keep static fallbacks if API is offline
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshContent();
  }, [refreshContent]);

  const saveAdminToken = useCallback((token) => {
    setAdminToken(token || "");
    if (token) localStorage.setItem(ADMIN_TOKEN_KEY, token);
    else localStorage.removeItem(ADMIN_TOKEN_KEY);
  }, []);

  const adminFetch = useCallback(
    async (url, options = {}) => {
      const headers = {
        ...(options.headers || {}),
        Authorization: `Bearer ${adminToken}`,
      };
      if (!(options.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
      }
      const res = await fetch(url, { ...options, headers });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Admin request failed");
      }
      return data;
    },
    [adminToken]
  );

  const value = useMemo(
    () => ({
      site,
      skills,
      projects,
      experience,
      services,
      profiles: buildProfiles(site),
      loading,
      adminToken,
      isAdminAuthed: Boolean(adminToken),
      saveAdminToken,
      refreshContent,
      adminFetch,
    }),
    [
      site,
      skills,
      projects,
      experience,
      services,
      loading,
      adminToken,
      saveAdminToken,
      refreshContent,
      adminFetch,
    ]
  );

  return (
    <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) {
    throw new Error("useContent must be used within ContentProvider");
  }
  return ctx;
}
