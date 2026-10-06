import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useContent } from "../context/ContentContext";

const navItems = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "services", label: "Services" },
  { id: "profiles", label: "Profiles" },
  { id: "contact", label: "Contact" },
];

export default function Navbar() {
  const { site } = useContent();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 16);

      const offset = 120;
      let current = "home";
      for (const item of navItems) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top - offset <= 0) {
          current = item.id;
        }
      }
      setActive(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    setOpen(false);
  };

  return (
    <header className={`nav ${scrolled ? "nav--scrolled" : ""}`}>
      <div className="nav__inner container">
        <a
          href="#home"
          className="nav__brand"
          onClick={(e) => {
            e.preventDefault();
            scrollTo("home");
          }}
        >
          {site.name}
        </a>

        <nav className="nav__links" aria-label="Primary">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`nav__link ${active === item.id ? "nav__link--active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                scrollTo(item.id);
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className="btn btn--primary nav__cta"
          onClick={() => scrollTo("contact")}
        >
          Let&apos;s Work Together
        </button>

        <button
          type="button"
          className="nav__toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="nav__mobile nav__mobile--open">
          <nav className="nav__mobile-links" aria-label="Mobile">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={active === item.id ? "is-active" : ""}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(item.id);
                }}
              >
                {item.label}
              </a>
            ))}
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => scrollTo("contact")}
            >
              Let&apos;s Work Together
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
