import { useState } from "react";
import { Briefcase, Mail, Send } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./icons";
import { useContent } from "../context/ContentContext";
import ScrollReveal from "./ScrollReveal";

function ContactChannel({ href, icon: Icon, label, value }) {
  if (!href) {
    return (
      <div className="contact__channel contact__channel--disabled">
        <Icon size={18} aria-hidden="true" />
        <div>
          <strong>{label}</strong>
          <span>Coming soon</span>
        </div>
      </div>
    );
  }

  const external = href.startsWith("http");
  return (
    <a
      href={href}
      className="contact__channel"
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      <Icon size={18} aria-hidden="true" />
      <div>
        <strong>{label}</strong>
        <span>{value}</span>
      </div>
    </a>
  );
}

export default function Contact() {
  const { site } = useContent();
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus("Please fill in your name, email, and message.");
      return;
    }

    // mailto fallback — easy to replace with a real email/API service later
    if (site.email) {
      const body = [
        `Name: ${form.name}`,
        `Email: ${form.email}`,
        "",
        form.message,
      ].join("\n");

      const mailto = `mailto:${site.email}?subject=${encodeURIComponent(
        form.subject || "Portfolio inquiry"
      )}&body=${encodeURIComponent(body)}`;

      window.location.href = mailto;
      setStatus(
        "Opening your email client… If nothing opens, email Vishal directly."
      );
      return;
    }

    setStatus("Unable to send right now. Please try again later.");
  };

  return (
    <section id="contact" className="section section--alt">
      <div className="container">
        <ScrollReveal>
          <div className="section__header">
            <p className="section__eyebrow">Contact</p>
            <h2 className="section__title">Let&apos;s work together</h2>
            <p className="section__lead">
              Have a project, role, or freelance opportunity? Reach out through
              the form or any of the channels below.
            </p>
          </div>
        </ScrollReveal>

        <div className="contact__grid">
          <ScrollReveal className="contact__info">
            <ContactChannel
              href={site.email ? `mailto:${site.email}` : ""}
              icon={Mail}
              label="Email"
              value={site.email || "Email"}
            />
            <ContactChannel
              href={site.profiles.linkedin}
              icon={LinkedinIcon}
              label="LinkedIn"
              value="Professional profile"
            />
            <ContactChannel
              href={site.profiles.github}
              icon={GithubIcon}
              label="GitHub"
              value="Code and repositories"
            />
            <ContactChannel
              href={site.profiles.upwork}
              icon={Briefcase}
              label="Upwork"
              value="Freelance inquiries"
            />
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <form className="contact__form" onSubmit={onSubmit} noValidate>
              <div className="form__row">
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={form.name}
                  onChange={onChange}
                  placeholder="Your name"
                  required
                />
              </div>
              <div className="form__row">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="form__row">
                <label htmlFor="subject">Subject</label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  value={form.subject}
                  onChange={onChange}
                  placeholder="Project inquiry, collaboration, etc."
                />
              </div>
              <div className="form__row">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={onChange}
                  placeholder="Tell me about your project or opportunity…"
                  required
                />
              </div>
              <button type="submit" className="btn btn--primary">
                <Send size={18} aria-hidden="true" />
                Send Message
              </button>
              {status && (
                <p className="contact__status" role="status">
                  {status}
                </p>
              )}
            </form>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
