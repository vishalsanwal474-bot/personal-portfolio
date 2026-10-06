import { Download, FileText } from "lucide-react";
import { useContent } from "../context/ContentContext";
import ScrollReveal from "./ScrollReveal";

export default function Resume() {
  const { site } = useContent();
  const hasResume = Boolean(site.resume?.url);

  return (
    <section id="resume" className="section">
      <div className="container">
        <ScrollReveal>
          <div className="resume-cta">
            <div>
              <p className="section__eyebrow">Resume</p>
              <h2 className="section__title">Want the full picture?</h2>
              <p className="section__lead">
                Download or view my resume for a concise overview of skills and
                project work.
              </p>
            </div>
            <div className="resume-cta__actions">
              {hasResume ? (
                <>
                  <a
                    href={site.resume.url}
                    className="btn btn--primary"
                    download
                  >
                    <Download size={18} aria-hidden="true" />
                    {site.resume.label}
                  </a>
                  <a
                    href={site.resume.url}
                    className="btn btn--ghost"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FileText size={18} aria-hidden="true" />
                    View Resume
                  </a>
                </>
              ) : (
                <>
                  <span className="btn btn--disabled">
                    <Download size={18} aria-hidden="true" />
                    Download Resume
                  </span>
                  <span className="btn btn--disabled">
                    <FileText size={18} aria-hidden="true" />
                    View Resume
                  </span>
                </>
              )}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
