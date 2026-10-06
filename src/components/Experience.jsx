import { useContent } from "../context/ContentContext";
import ScrollReveal from "./ScrollReveal";

export default function Experience() {
  const { experience } = useContent();

  return (
    <section id="experience" className="section section--alt">
      <div className="container">
        <ScrollReveal>
          <div className="section__header">
            <p className="section__eyebrow">Experience</p>
            <h2 className="section__title">Professional work</h2>
            <p className="section__lead">
              Freelance and independent development work.
            </p>
          </div>
        </ScrollReveal>

        <ol className="timeline">
          {experience
            .filter((item) => !item.isPlaceholder)
            .map((item, index) => (
              <ScrollReveal key={item.id} delay={index * 90}>
                <li className="timeline__item">
                  <div className="timeline__marker" aria-hidden="true" />
                  <article className="timeline__card">
                    <div className="timeline__top">
                      <h3>{item.role}</h3>
                      <span className="timeline__duration">{item.duration}</span>
                    </div>
                    <p className="timeline__company">{item.company}</p>
                    <p>{item.description}</p>
                    <ul className="timeline__list">
                      {item.responsibilities.map((responsibility) => (
                        <li key={responsibility}>{responsibility}</li>
                      ))}
                    </ul>
                    <ul className="timeline__tech">
                      {item.tech.map((tech) => (
                        <li key={tech}>{tech}</li>
                      ))}
                    </ul>
                  </article>
                </li>
              </ScrollReveal>
            ))}
        </ol>
      </div>
    </section>
  );
}
