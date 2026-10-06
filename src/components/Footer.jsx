import { Briefcase, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./icons";
import { useContent } from "../context/ContentContext";

function FooterLink({ href, label, children }) {
  if (!href) {
    return (
      <span className="footer__social footer__social--disabled" title={`${label} coming soon`}>
        {children}
        <span className="sr-only">{label} (coming soon)</span>
      </span>
    );
  }

  return (
    <a
      href={href}
      className="footer__social"
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      aria-label={label}
    >
      {children}
    </a>
  );
}

export default function Footer() {
  const { site } = useContent();

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div>
          <strong className="footer__name">{site.name}</strong>
          <p>{site.shortTitle}</p>
        </div>

        <div className="footer__socials" aria-label="Footer social links">
          <FooterLink href={site.profiles.github} label="GitHub">
            <GithubIcon size={18} />
          </FooterLink>
          <FooterLink href={site.profiles.linkedin} label="LinkedIn">
            <LinkedinIcon size={18} />
          </FooterLink>
          <FooterLink href={site.profiles.upwork} label="Upwork">
            <Briefcase size={18} />
          </FooterLink>
          <FooterLink
            href={site.email ? `mailto:${site.email}` : ""}
            label="Email"
          >
            <Mail size={18} />
          </FooterLink>
        </div>

        <p className="footer__copy">
          © 2026 {site.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
