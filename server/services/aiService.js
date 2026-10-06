const { buildSystemPrompt } = require("../data/portfolioKnowledge");
const { readContent, toPortfolioKnowledge } = require("./contentStore");

const MAX_MESSAGE_LENGTH = 1000;

function getKnowledge() {
  return toPortfolioKnowledge(readContent());
}

function getProvider() {
  return (process.env.AI_PROVIDER || "openai").toLowerCase();
}

function isConfigured() {
  return Boolean(process.env.AI_API_KEY && process.env.AI_API_KEY.trim());
}

function skillLines(skills = {}) {
  return Object.entries(skills)
    .map(([key, values]) => {
      const label = key.charAt(0).toUpperCase() + key.slice(1);
      return `- ${label}: ${(values || []).join(", ")}`;
    })
    .join("\n");
}

function detectActions(message = "", reply = "") {
  const text = `${message} ${reply}`.toLowerCase();
  const actions = [];
  const profiles = getKnowledge().profiles;

  const push = (action) => {
    if (!actions.some((a) => a.label === action.label)) actions.push(action);
  };

  if (
    /hire|contact|email|reach|available|freelance|work together|get in touch/.test(
      text
    )
  ) {
    push({ label: "Contact Vishal", type: "scroll", target: "contact" });
    push({
      label: "View Upwork",
      href: profiles.upwork || "",
      disabled: !profiles.upwork,
    });
  }

  if (/project|built|portfolio|fittrack|wedding|music|expense|kharidonow/.test(text)) {
    push({ label: "View Projects", type: "scroll", target: "projects" });
  }

  if (/skill|tech|react|node|stack|tools/.test(text)) {
    push({ label: "View Skills", type: "scroll", target: "skills" });
  }

  if (/service|offer|help with|website|bug|deploy/.test(text)) {
    push({ label: "View Services", type: "scroll", target: "services" });
  }

  if (/github|code|repo/.test(text)) {
    push({
      label: "View GitHub",
      href: profiles.github || "",
      disabled: !profiles.github,
    });
  }

  if (/linkedin/.test(text)) {
    push({
      label: "View LinkedIn",
      href: profiles.linkedin || "",
      disabled: !profiles.linkedin,
    });
  }

  if (/resume|cv/.test(text)) {
    push({ label: "View Resume", type: "scroll", target: "resume" });
  }

  return actions.slice(0, 4);
}

function projectByName(projects, matcher) {
  return projects.find((project) => matcher(project.name.toLowerCase()));
}

function fallbackReply(message) {
  const q = message.toLowerCase();
  const k = getKnowledge();

  if (/who is|about vishal|who are you/.test(q)) {
    return {
      reply: `${k.bio} His approach: ${k.approach}`,
      actions: [
        { label: "View Projects", type: "scroll", target: "projects" },
        { label: "Contact Vishal", type: "scroll", target: "contact" },
      ],
      source: "fallback",
    };
  }

  if (/what does|do\b|title|role/.test(q)) {
    return {
      reply: `${k.name} is a ${k.title}. ${k.bio}`,
      actions: [
        { label: "View Services", type: "scroll", target: "services" },
        { label: "Contact Vishal", type: "scroll", target: "contact" },
      ],
      source: "fallback",
    };
  }

  if (/skill|tech|stack|react|node|tools/.test(q)) {
    return {
      reply: `${k.name} works with:\n${skillLines(k.skills)}`,
      actions: [{ label: "View Skills", type: "scroll", target: "skills" }],
      source: "fallback",
    };
  }

  if (/project|built|portfolio|work/.test(q)) {
    const list = k.projects
      .map((p) => {
        const live = p.live ? " (live demo available)" : " (not deployed yet)";
        return `- ${p.name}: ${p.description}${live}`;
      })
      .join("\n");
    return {
      reply: `Here are projects documented in ${k.name}'s portfolio:\n${list}`,
      actions: [{ label: "View Projects", type: "scroll", target: "projects" }],
      source: "fallback",
    };
  }

  const named = [
    [/fittrack/, (n) => n.includes("fittrack")],
    [/wedding/, (n) => n.includes("wedding")],
    [/music|resonance/, (n) => n.includes("music") || n.includes("resonance")],
    [/expense/, (n) => n.includes("expense")],
    [/kharido|store|ecommerce|e-commerce|clothing/, (n) => n.includes("kharido")],
  ];

  for (const [pattern, matcher] of named) {
    if (pattern.test(q)) {
      const p = projectByName(k.projects, matcher);
      if (!p) break;
      const links = [
        p.github ? `GitHub: ${p.github}` : null,
        p.live ? `Live: ${p.live}` : "Live demo is not available yet.",
      ]
        .filter(Boolean)
        .join("\n");
      return {
        reply: `${p.name}: ${p.description}\nTech: ${(p.tech || []).join(", ")}\n${links}`,
        actions: [{ label: "View Projects", type: "scroll", target: "projects" }],
        source: "fallback",
      };
    }
  }

  if (/service|offer/.test(q)) {
    return {
      reply: `${k.name} offers:\n${k.services.map((s) => `- ${s}`).join("\n")}`,
      actions: [
        { label: "View Services", type: "scroll", target: "services" },
        { label: "Contact Vishal", type: "scroll", target: "contact" },
      ],
      source: "fallback",
    };
  }

  if (/hire|available|freelance|work together/.test(q)) {
    return {
      reply: k.hiring.note,
      actions: [
        { label: "Contact Vishal", type: "scroll", target: "contact" },
        {
          label: "View Upwork",
          href: k.profiles.upwork || "",
          disabled: !k.profiles.upwork,
        },
      ],
      source: "fallback",
    };
  }

  if (/contact|email|reach/.test(q)) {
    const email = k.contact.email
      ? `Email: ${k.contact.email}`
      : "Use the Contact form on the site.";
    return {
      reply: `You can reach ${k.name} through the Contact section. ${email}`,
      actions: [{ label: "Contact Vishal", type: "scroll", target: "contact" }],
      source: "fallback",
    };
  }

  if (/github/.test(q)) {
    return {
      reply: k.profiles.github
        ? `GitHub: ${k.profiles.github}`
        : "GitHub URL is not set in the portfolio yet.",
      actions: [
        {
          label: "View GitHub",
          href: k.profiles.github || "",
          disabled: !k.profiles.github,
        },
      ],
      source: "fallback",
    };
  }

  if (/linkedin/.test(q)) {
    return {
      reply: k.profiles.linkedin
        ? `LinkedIn: ${k.profiles.linkedin}`
        : "LinkedIn will be added later.",
      actions: [
        {
          label: "View LinkedIn",
          href: k.profiles.linkedin || "",
          disabled: !k.profiles.linkedin,
        },
      ],
      source: "fallback",
    };
  }

  if (/upwork/.test(q)) {
    return {
      reply: k.profiles.upwork
        ? `Upwork: ${k.profiles.upwork}`
        : "Upwork URL is not set yet.",
      actions: [
        {
          label: "View Upwork",
          href: k.profiles.upwork || "",
          disabled: !k.profiles.upwork,
        },
      ],
      source: "fallback",
    };
  }

  if (/resume|cv/.test(q)) {
    return {
      reply: k.resume.available
        ? "You can download or view the resume from the Resume section."
        : k.resume.note,
      actions: [{ label: "View Resume", type: "scroll", target: "resume" }],
      source: "fallback",
    };
  }

  return {
    reply:
      "I don't have that information in the portfolio yet. You can contact Vishal directly for more details, or ask about projects, skills, services, or how to reach him.",
    actions: [
      { label: "Contact Vishal", type: "scroll", target: "contact" },
      { label: "View Projects", type: "scroll", target: "projects" },
    ],
    source: "fallback",
  };
}

async function callOpenAICompatible({ message, history = [] }) {
  const apiKey = process.env.AI_API_KEY;
  const model = process.env.AI_MODEL || "gpt-4o-mini";
  const baseUrl = (process.env.AI_BASE_URL || "https://api.openai.com/v1").replace(
    /\/$/,
    ""
  );
  const knowledge = getKnowledge();

  const messages = [
    { role: "system", content: buildSystemPrompt(knowledge) },
    ...history
      .filter(
        (m) =>
          m &&
          (m.role === "user" || m.role === "assistant") &&
          typeof m.content === "string"
      )
      .slice(-10)
      .map((m) => ({
        role: m.role,
        content: String(m.content).slice(0, MAX_MESSAGE_LENGTH),
      })),
    { role: "user", content: message },
  ];

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.3,
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    const error = new Error("AI provider request failed");
    error.status = response.status;
    error.details = errText.slice(0, 200);
    throw error;
  }

  const data = await response.json();
  const reply =
    data?.choices?.[0]?.message?.content?.trim() ||
    "I couldn't generate a response right now.";

  return {
    reply,
    actions: detectActions(message, reply),
    source: getProvider(),
  };
}

async function generateReply({ message, history }) {
  if (!isConfigured()) {
    return fallbackReply(message);
  }

  try {
    return await callOpenAICompatible({ message, history });
  } catch (error) {
    console.error("[aiService] provider error:", error.status || "", error.message);
    const fallback = fallbackReply(message);
    return {
      ...fallback,
      reply: `${fallback.reply}\n\n(Note: the AI provider was unavailable, so this is a local portfolio-based answer.)`,
      source: "fallback-after-error",
    };
  }
}

module.exports = {
  generateReply,
  isConfigured,
  MAX_MESSAGE_LENGTH,
};
