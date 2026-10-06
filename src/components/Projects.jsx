import { ExternalLink } from "lucide-react";
import { GithubIcon } from "./icons";
import { useContent } from "../context/ContentContext";
import ScrollReveal from "./ScrollReveal";

function ProjectLink({ href, children, label }) {
  if (!href) {
    return (
      <span
        className="btn btn--sm btn--disabled"
        aria-disabled="true"
        title={`${label} is not available`}
      >
        {children}
      </span>
    );
  }

  return (
    <a
      href={href}
      className="btn btn--sm btn--ghost"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}

export default function Projects() {
  const { projects } = useContent();

  return (
    <section id="projects" className="section">
      <div className="container">
        <ScrollReveal>
          <div className="section__header">
            <p className="section__eyebrow">Projects</p>
            <h2 className="section__title">Selected work</h2>
            <p className="section__lead">
              Applications and products I&apos;ve built end to end.
            </p>
          </div>
        </ScrollReveal>

        <div className="projects__grid">
          {projects
            .filter((project) => !project.isPlaceholder)
            .map((project, index) => (
            <ScrollReveal key={project.id} delay={index * 70}>
              <article className="project-card">
                <div className="project-card__media">
                  <img
                    src={project.image}
                    alt={`${project.name} project preview`}
                    loading="lazy"
                  />
                </div>
                <div className="project-card__body">
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                  <ul className="project-card__tech">
                    {project.tech.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <ul className="project-card__features">
                    {project.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                  <div className="project-card__actions">
                    <ProjectLink href={project.github} label="GitHub">
                      <GithubIcon size={16} />
                      GitHub
                    </ProjectLink>
                    <ProjectLink href={project.live} label="Live Demo">
                      <ExternalLink size={16} aria-hidden="true" />
                      Live Demo
                    </ProjectLink>
                  </div>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
