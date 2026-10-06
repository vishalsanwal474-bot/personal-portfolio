import { Code2, Globe, Layers, Rocket, Wrench } from "lucide-react";
import { useContent } from "../context/ContentContext";
import ScrollReveal from "./ScrollReveal";

const icons = {
  Code2,
  Layers,
  Globe,
  Wrench,
  Rocket,
};

export default function Services() {
  const { services } = useContent();

  return (
    <section id="services" className="section">
      <div className="container">
        <ScrollReveal>
          <div className="section__header">
            <p className="section__eyebrow">Services</p>
            <h2 className="section__title">How I can help</h2>
            <p className="section__lead">
              Practical development services for businesses, startups, and
              clients who need reliable web delivery.
            </p>
          </div>
        </ScrollReveal>

        <div className="services__grid">
          {services.map((service, index) => {
            const Icon = icons[service.icon] || Code2;
            return (
              <ScrollReveal key={service.id} delay={index * 70}>
                <article className="service-card">
                  <div className="service-card__icon" aria-hidden="true">
                    <Icon size={22} />
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </article>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
