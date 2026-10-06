import { ArrowDown, Mail, Briefcase } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./icons";
import { useContent } from "../context/ContentContext";

function SocialLink({ href, label, children }) {
  if (!href) {
    return (
      <span
        className="social-link social-link--disabled"
        title={`${label} coming soon`}
        aria-disabled="true"
      >
        {children}
        <span className="sr-only">{label} (coming soon)</span>
      </span>
    );
  }

  return (
    <a
      href={href}
      className="social-link"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
    >
      {children}
    </a>
  );
}

export default function Hero() {
  const { site } = useContent();
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="hero">
      <div className="hero__bg" aria-hidden="true" />
      <div className="container hero__content">
        <p className="hero__eyebrow">Portfolio</p>
        <h1 className="hero__name">{site.name}</h1>
        <p className="hero__title">{site.title}</p>
        <p className="hero__tagline">{site.tagline}</p>

        <div className="hero__actions">
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => scrollTo("projects")}
          >
            View My Work
          </button>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => scrollTo("contact")}
          >
            Contact Me
          </button>
        </div>

        <div className="hero__socials" aria-label="Social profiles">
          <SocialLink href={site.profiles.github} label="GitHub">
            <GithubIcon size={20} />
          </SocialLink>
          <SocialLink href={site.profiles.linkedin} label="LinkedIn">
            <LinkedinIcon size={20} />
          </SocialLink>
          <SocialLink href={site.profiles.upwork} label="Upwork">
            <Briefcase size={20} />
          </SocialLink>
          <SocialLink
            href={site.email ? `mailto:${site.email}` : ""}
            label="Email"
          >
            <Mail size={20} />
          </SocialLink>
        </div>

        <button
          type="button"
          className="hero__scroll"
          onClick={() => scrollTo("about")}
          aria-label="Scroll to about section"
        >
          <ArrowDown size={18} />
          <span>Scroll</span>
        </button>
      </div>
    </section>
  );
}
