import { useContent } from "../context/ContentContext";
import ScrollReveal from "./ScrollReveal";

export default function Skills() {
  const { skills } = useContent();

  return (
    <section id="skills" className="section section--alt">
      <div className="container">
        <ScrollReveal>
          <div className="section__header">
            <p className="section__eyebrow">Skills</p>
            <h2 className="section__title">Technical toolkit</h2>
            <p className="section__lead">
              Technologies I use to design, build, and ship web applications.
            </p>
          </div>
        </ScrollReveal>

        <div className="skills__grid">
          {skills.map((category, index) => (
            <ScrollReveal key={category.id} delay={index * 80}>
              <article className="skills__card">
                <h3>{category.title}</h3>
                <ul className="skills__list">
                  {category.skills.map((skill) => (
                    <li key={skill} className="skills__badge">
                      {skill}
                    </li>
                  ))}
                </ul>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
