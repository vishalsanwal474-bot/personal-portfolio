# Vishal Sanwal — Personal Portfolio

One-page portfolio + AI assistant API.

## Local development

```bash
npm install
npm install --prefix server
npm run dev
```

- Site: http://localhost:5173  
- API: http://localhost:5000/api/health  

## Production (frontend + chatbot together)

```bash
npm install
npm install --prefix server
npm run build
npm start
```

Server serves `dist/` and `/api/chat` on the same port.

### Deploy on Render (recommended)

1. Push this folder to GitHub.
2. In Render → **New → Blueprint** (uses `render.yaml`), or **Web Service**:
   - **Build:** `npm install && npm install --prefix server && npm run build`
   - **Start:** `npm start`
3. Optional env vars:
   - `AI_API_KEY` — for real AI answers (leave empty for local fallback)
   - `AI_MODEL` — default `gpt-4o-mini`
   - `CLIENT_ORIGIN` — `*` is fine when frontend is served by the same app

After deploy, set in `src/data/site.js`:

- `profiles.website` → your live URL  
- `seo.url` → your live URL  

Then rebuild/redeploy.

## Edit your content

| What | File |
| --- | --- |
| Personal info / links | `src/data/site.js` |
| Projects | `src/data/projects.js` |
| Skills | `src/data/skills.js` |
| Experience | `src/data/experience.js` |
| Chatbot knowledge | `server/data/portfolioKnowledge.js` |

### Add later

- LinkedIn / resume can also be added from the private admin panel
- Keep phone private (never store it in content)

## Private admin panel (only for you)

Not linked in the public nav.

1. Set `ADMIN_PASSWORD` and `ADMIN_JWT_SECRET` in `server/.env`
2. Run the app (`npm run dev`)
3. Open: `http://localhost:5173/#admin`
4. Log in with your admin password

You can then add/edit/delete:

- Personal info
- Professional links
- Projects
- Experience
- Resume upload/delete

Public visitors cannot access this without your password. Changes save to `server/data/content.json` and update the live page + chatbot knowledge.

## AI chatbot

- UI: `src/components/Chatbot.jsx`
- API: `POST /api/chat`
- Env: copy `server/.env.example` → `server/.env`
