import { MapPin, Sparkles } from "lucide-react";
import { useContent } from "../context/ContentContext";
import ScrollReveal from "./ScrollReveal";

export default function About() {
  const { site } = useContent();
  const initials = site.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <section id="about" className="section">
      <div className="container">
        <ScrollReveal>
          <div className="section__header">
            <p className="section__eyebrow">About</p>
            <h2 className="section__title">Who I am</h2>
            <p className="section__lead">
              A developer focused on practical software and clear delivery.
            </p>
          </div>
        </ScrollReveal>

        <div className="about__grid">
          <ScrollReveal className="about__copy">
            {site.bio.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
            <ul className="about__highlights">
              {site.aboutHighlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </ScrollReveal>

          <ScrollReveal delay={120} className="about__card-wrap">
            <aside className="about__card" aria-label="Profile summary">
              <div className="about__avatar" aria-hidden="true">
                {initials}
              </div>
              <h3>{site.name}</h3>
              <p className="about__card-title">{site.shortTitle}</p>
              <div className="about__meta">
                {site.location && (
                  <p>
                    <MapPin size={16} aria-hidden="true" />
                    <span>{site.location}</span>
                  </p>
                )}
                {site.availability && (
                  <p>
                    <Sparkles size={16} aria-hidden="true" />
                    <span>{site.availability}</span>
                  </p>
                )}
              </div>
            </aside>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
