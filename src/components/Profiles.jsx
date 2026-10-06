import { Briefcase, Globe, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./icons";
import { useContent } from "../context/ContentContext";
import ScrollReveal from "./ScrollReveal";

const icons = {
  Github: GithubIcon,
  Briefcase,
  Linkedin: LinkedinIcon,
  Globe,
  Mail,
};

export default function Profiles() {
  const { profiles } = useContent();

  return (
    <section id="profiles" className="section section--alt">
      <div className="container">
        <ScrollReveal>
          <div className="section__header">
            <p className="section__eyebrow">Professional Profiles</p>
            <h2 className="section__title">Find me online</h2>
            <p className="section__lead">
              Connect with me across platforms for code, freelance work, and
              professional updates.
            </p>
          </div>
        </ScrollReveal>

        <div className="profiles__grid">
          {profiles.map((profile, index) => {
            const Icon = icons[profile.icon] || Globe;
            const hasUrl = Boolean(profile.url);
            const isHash = profile.url?.startsWith("#");

            return (
              <ScrollReveal key={profile.id} delay={index * 70}>
                <article className="profile-card">
                  <div className="profile-card__icon" aria-hidden="true">
                    <Icon size={22} />
                  </div>
                  <h3>{profile.name}</h3>
                  <p>{profile.description}</p>
                  {hasUrl ? (
                    <a
                      href={profile.url}
                      className="btn btn--sm btn--primary"
                      {...(!isHash && !profile.isInternal
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      onClick={
                        isHash
                          ? (e) => {
                              e.preventDefault();
                              document
                                .getElementById(profile.url.slice(1))
                                ?.scrollIntoView({ behavior: "smooth" });
                            }
                          : undefined
                      }
                    >
                      {profile.cta}
                    </a>
                  ) : (
                    <span className="btn btn--sm btn--disabled">Coming soon</span>
                  )}
                </article>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
