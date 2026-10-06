import { useEffect, useState } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  LogOut,
  Plus,
  Save,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useContent } from "../context/ContentContext";

function emptyProject() {
  return {
    id: `project-${Date.now()}`,
    name: "",
    description: "",
    tech: [],
    features: [],
    image: "/projects/placeholder.svg",
    github: "",
    live: "",
  };
}

function emptyExperience() {
  return {
    id: `experience-${Date.now()}`,
    role: "",
    company: "",
    duration: "",
    description: "",
    responsibilities: [],
    tech: [],
  };
}

function linesToList(value) {
  return String(value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function listToLines(list) {
  return Array.isArray(list) ? list.join("\n") : "";
}

export default function AdminPanel() {
  const { adminFetch, isAdminAuthed, saveAdminToken, refreshContent } =
    useContent();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [draft, setDraft] = useState(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);

  useEffect(() => {
    const syncHash = () => setOpen(window.location.hash === "#admin");
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  useEffect(() => {
    if (!open || !isAdminAuthed) return;
    let cancelled = false;

    (async () => {
      try {
        setError("");
        const data = await adminFetch("/api/admin/content");
        if (!cancelled) setDraft(data.content);
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          saveAdminToken("");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, isAdminAuthed, adminFetch, saveAdminToken]);

  if (!open) return null;

  const close = () => {
    saveAdminToken("");
    setDraft(null);
    setResumeFile(null);
    window.location.hash = "";
    setOpen(false);
    setPassword("");
    setShowPassword(false);
    setStatus("");
    setError("");
  };

  const login = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      saveAdminToken(data.token);
      setPassword("");
      setShowPassword(false);
      setStatus("Logged in.");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const logout = () => {
    saveAdminToken("");
    setDraft(null);
    setStatus("Logged out.");
  };

  const updateField = (key, value) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const updateProfile = (key, value) => {
    setDraft((prev) => ({
      ...prev,
      profiles: { ...prev.profiles, [key]: value },
    }));
  };

  const saveContent = async () => {
    setBusy(true);
    setError("");
    setStatus("");
    try {
      await adminFetch("/api/admin/content", {
        method: "PUT",
        body: JSON.stringify({ content: draft }),
      });
      await refreshContent();
      setStatus("Saved. Public page updated.");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const uploadResume = async () => {
    if (!resumeFile) {
      setError("Choose a PDF resume first.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const form = new FormData();
      form.append("resume", resumeFile);
      const data = await adminFetch("/api/admin/resume", {
        method: "POST",
        body: form,
      });
      setDraft(data.content);
      setResumeFile(null);
      await refreshContent();
      setStatus("Resume uploaded.");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const deleteResume = async () => {
    setBusy(true);
    setError("");
    try {
      const data = await adminFetch("/api/admin/resume", { method: "DELETE" });
      setDraft(data.content);
      await refreshContent();
      setStatus("Resume removed.");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin" role="dialog" aria-modal="true" aria-label="Private admin panel">
      <div className="admin__panel">
        <header className="admin__header">
          <div>
            <p className="admin__eyebrow">Private access</p>
            <h2>Portfolio Admin</h2>
          </div>
          <div className="admin__header-actions">
            {isAdminAuthed && (
              <button type="button" className="btn btn--sm btn--ghost" onClick={logout}>
                <LogOut size={16} />
                Logout
              </button>
            )}
            <button type="button" className="btn btn--sm btn--ghost" onClick={close}>
              <X size={16} />
              Close
            </button>
          </div>
        </header>

        {!isAdminAuthed ? (
          <form className="admin__login" onSubmit={login}>
            <Lock size={28} />
            <p>This area is not linked publicly. Only you can open it with your admin password.</p>
            <label htmlFor="admin-password">Admin password</label>
            <div className="admin__password-field">
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="Enter admin password"
                required
              />
              <button
                type="button"
                className="admin__password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <button type="submit" className="btn btn--primary" disabled={busy}>
              Unlock Admin
            </button>
          </form>
        ) : !draft ? (
          <p className="admin__status">Loading your content…</p>
        ) : (
          <div className="admin__body">
            <section className="admin__section">
              <h3>Personal information</h3>
              <div className="admin__grid">
                <label>
                  Name
                  <input
                    value={draft.name}
                    onChange={(e) => updateField("name", e.target.value)}
                  />
                </label>
                <label>
                  Title
                  <input
                    value={draft.title}
                    onChange={(e) => updateField("title", e.target.value)}
                  />
                </label>
                <label>
                  Short title
                  <input
                    value={draft.shortTitle}
                    onChange={(e) => updateField("shortTitle", e.target.value)}
                  />
                </label>
                <label>
                  Email
                  <input
                    value={draft.email}
                    onChange={(e) => updateField("email", e.target.value)}
                  />
                </label>
                <label>
                  Location
                  <input
                    value={draft.location}
                    onChange={(e) => updateField("location", e.target.value)}
                  />
                </label>
                <label>
                  Availability
                  <input
                    value={draft.availability}
                    onChange={(e) => updateField("availability", e.target.value)}
                  />
                </label>
              </div>
              <label>
                Tagline
                <textarea
                  rows={2}
                  value={draft.tagline}
                  onChange={(e) => updateField("tagline", e.target.value)}
                />
              </label>
              <label>
                Bio (one paragraph per line)
                <textarea
                  rows={5}
                  value={listToLines(draft.bio)}
                  onChange={(e) => updateField("bio", linesToList(e.target.value))}
                />
              </label>
              <label>
                About highlights (one per line)
                <textarea
                  rows={4}
                  value={listToLines(draft.aboutHighlights)}
                  onChange={(e) =>
                    updateField("aboutHighlights", linesToList(e.target.value))
                  }
                />
              </label>
            </section>

            <section className="admin__section">
              <h3>Professional links</h3>
              <div className="admin__grid">
                {["github", "linkedin", "upwork", "website"].map((key) => (
                  <label key={key}>
                    {key}
                    <input
                      value={draft.profiles?.[key] || ""}
                      onChange={(e) => updateProfile(key, e.target.value)}
                      placeholder={`https://...`}
                    />
                  </label>
                ))}
              </div>
            </section>

            <section className="admin__section">
              <h3>Resume</h3>
              <p className="admin__hint">
                Current: {draft.resume?.url ? draft.resume.url : "No resume uploaded"}
              </p>
              <div className="admin__row">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                />
                <button
                  type="button"
                  className="btn btn--sm btn--primary"
                  onClick={uploadResume}
                  disabled={busy}
                >
                  <Upload size={16} />
                  Upload PDF
                </button>
                <button
                  type="button"
                  className="btn btn--sm btn--ghost"
                  onClick={deleteResume}
                  disabled={busy || !draft.resume?.url}
                >
                  <Trash2 size={16} />
                  Delete Resume
                </button>
              </div>
            </section>

            <section className="admin__section">
              <div className="admin__section-head">
                <h3>Projects</h3>
                <button
                  type="button"
                  className="btn btn--sm btn--ghost"
                  onClick={() =>
                    setDraft((prev) => ({
                      ...prev,
                      projects: [...(prev.projects || []), emptyProject()],
                    }))
                  }
                >
                  <Plus size={16} />
                  Add project
                </button>
              </div>
              {(draft.projects || []).map((project, index) => (
                <article key={project.id || index} className="admin__card">
                  <div className="admin__section-head">
                    <strong>{project.name || `Project ${index + 1}`}</strong>
                    <button
                      type="button"
                      className="btn btn--sm btn--ghost"
                      onClick={() =>
                        setDraft((prev) => ({
                          ...prev,
                          projects: prev.projects.filter((_, i) => i !== index),
                        }))
                      }
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                  <div className="admin__grid">
                    <label>
                      Name
                      <input
                        value={project.name}
                        onChange={(e) => {
                          const value = e.target.value;
                          setDraft((prev) => {
                            const projects = [...prev.projects];
                            projects[index] = { ...projects[index], name: value };
                            return { ...prev, projects };
                          });
                        }}
                      />
                    </label>
                    <label>
                      Image path
                      <input
                        value={project.image}
                        onChange={(e) => {
                          const value = e.target.value;
                          setDraft((prev) => {
                            const projects = [...prev.projects];
                            projects[index] = { ...projects[index], image: value };
                            return { ...prev, projects };
                          });
                        }}
                      />
                    </label>
                    <label>
                      GitHub
                      <input
                        value={project.github}
                        onChange={(e) => {
                          const value = e.target.value;
                          setDraft((prev) => {
                            const projects = [...prev.projects];
                            projects[index] = { ...projects[index], github: value };
                            return { ...prev, projects };
                          });
                        }}
                      />
                    </label>
                    <label>
                      Live demo
                      <input
                        value={project.live}
                        onChange={(e) => {
                          const value = e.target.value;
                          setDraft((prev) => {
                            const projects = [...prev.projects];
                            projects[index] = { ...projects[index], live: value };
                            return { ...prev, projects };
                          });
                        }}
                      />
                    </label>
                  </div>
                  <label>
                    Description
                    <textarea
                      rows={3}
                      value={project.description}
                      onChange={(e) => {
                        const value = e.target.value;
                        setDraft((prev) => {
                          const projects = [...prev.projects];
                          projects[index] = {
                            ...projects[index],
                            description: value,
                          };
                          return { ...prev, projects };
                        });
                      }}
                    />
                  </label>
                  <label>
                    Tech (comma separated)
                    <input
                      value={(project.tech || []).join(", ")}
                      onChange={(e) => {
                        const value = e.target.value
                          .split(",")
                          .map((item) => item.trim())
                          .filter(Boolean);
                        setDraft((prev) => {
                          const projects = [...prev.projects];
                          projects[index] = { ...projects[index], tech: value };
                          return { ...prev, projects };
                        });
                      }}
                    />
                  </label>
                  <label>
                    Features (one per line)
                    <textarea
                      rows={3}
                      value={listToLines(project.features)}
                      onChange={(e) => {
                        const value = linesToList(e.target.value);
                        setDraft((prev) => {
                          const projects = [...prev.projects];
                          projects[index] = {
                            ...projects[index],
                            features: value,
                          };
                          return { ...prev, projects };
                        });
                      }}
                    />
                  </label>
                </article>
              ))}
            </section>

            <section className="admin__section">
              <div className="admin__section-head">
                <h3>Experience</h3>
                <button
                  type="button"
                  className="btn btn--sm btn--ghost"
                  onClick={() =>
                    setDraft((prev) => ({
                      ...prev,
                      experience: [...(prev.experience || []), emptyExperience()],
                    }))
                  }
                >
                  <Plus size={16} />
                  Add experience
                </button>
              </div>
              {(draft.experience || []).map((item, index) => (
                <article key={item.id || index} className="admin__card">
                  <div className="admin__section-head">
                    <strong>{item.role || `Experience ${index + 1}`}</strong>
                    <button
                      type="button"
                      className="btn btn--sm btn--ghost"
                      onClick={() =>
                        setDraft((prev) => ({
                          ...prev,
                          experience: prev.experience.filter((_, i) => i !== index),
                        }))
                      }
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                  <div className="admin__grid">
                    <label>
                      Role
                      <input
                        value={item.role}
                        onChange={(e) => {
                          const value = e.target.value;
                          setDraft((prev) => {
                            const experience = [...prev.experience];
                            experience[index] = { ...experience[index], role: value };
                            return { ...prev, experience };
                          });
                        }}
                      />
                    </label>
                    <label>
                      Company / client
                      <input
                        value={item.company}
                        onChange={(e) => {
                          const value = e.target.value;
                          setDraft((prev) => {
                            const experience = [...prev.experience];
                            experience[index] = {
                              ...experience[index],
                              company: value,
                            };
                            return { ...prev, experience };
                          });
                        }}
                      />
                    </label>
                    <label>
                      Duration
                      <input
                        value={item.duration}
                        onChange={(e) => {
                          const value = e.target.value;
                          setDraft((prev) => {
                            const experience = [...prev.experience];
                            experience[index] = {
                              ...experience[index],
                              duration: value,
                            };
                            return { ...prev, experience };
                          });
                        }}
                      />
                    </label>
                    <label>
                      Tech (comma separated)
                      <input
                        value={(item.tech || []).join(", ")}
                        onChange={(e) => {
                          const value = e.target.value
                            .split(",")
                            .map((entry) => entry.trim())
                            .filter(Boolean);
                          setDraft((prev) => {
                            const experience = [...prev.experience];
                            experience[index] = { ...experience[index], tech: value };
                            return { ...prev, experience };
                          });
                        }}
                      />
                    </label>
                  </div>
                  <label>
                    Description
                    <textarea
                      rows={3}
                      value={item.description}
                      onChange={(e) => {
                        const value = e.target.value;
                        setDraft((prev) => {
                          const experience = [...prev.experience];
                          experience[index] = {
                            ...experience[index],
                            description: value,
                          };
                          return { ...prev, experience };
                        });
                      }}
                    />
                  </label>
                  <label>
                    Responsibilities (one per line)
                    <textarea
                      rows={3}
                      value={listToLines(item.responsibilities)}
                      onChange={(e) => {
                        const value = linesToList(e.target.value);
                        setDraft((prev) => {
                          const experience = [...prev.experience];
                          experience[index] = {
                            ...experience[index],
                            responsibilities: value,
                          };
                          return { ...prev, experience };
                        });
                      }}
                    />
                  </label>
                </article>
              ))}
            </section>

            <div className="admin__footer">
              <button
                type="button"
                className="btn btn--primary"
                onClick={saveContent}
                disabled={busy}
              >
                <Save size={16} />
                Save all changes
              </button>
            </div>
          </div>
        )}

        {(status || error) && (
          <p className={`admin__status ${error ? "admin__status--error" : ""}`}>
            {error || status}
          </p>
        )}
      </div>
    </div>
  );
}
