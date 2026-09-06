# Web Messager — Contact Form to Email API for Static Sites

**Web Messager is a self-hostable contact form backend: a single REST API endpoint that turns
form submissions on your website into emails in your inbox — no SMTP setup in your frontend, no
serverless function, and no email address exposed in your HTML.**

Live demo: **[web-messager.mohitch.me](https://web-messager.mohitch.me)**

Add a working contact form to a static site, portfolio, landing page, or JAMstack app by POSTing
JSON to one endpoint. Every project you create gets its own API key and its own message counter,
so a marketing site, a docs site, and a side project can all send to the same inbox while staying
separately tracked and separately revocable.

---

## Table of contents

- [Why use a contact form API?](#why-use-a-contact-form-api)
- [Features](#features)
- [How it works](#how-it-works)
- [Quick start: send your first message](#quick-start-send-your-first-message)
- [API reference](#api-reference)
- [Tech stack](#tech-stack)
- [Self-hosting and local development](#self-hosting-and-local-development)
- [Environment variables](#environment-variables)
- [Database schema](#database-schema)
- [Project structure](#project-structure)
- [Deployment](#deployment)
- [Security notes](#security-notes)
- [FAQ](#faq)
- [Roadmap](#roadmap)
- [License](#license)

---

## Why use a contact form API?

Static sites have no backend, so a contact form has nowhere to post to. The usual workarounds all
have a cost:

| Approach | Problem |
| --- | --- |
| `mailto:` link | Exposes your address to scrapers, and opens a mail client instead of sending |
| SMTP from the browser | Impossible without leaking credentials to every visitor |
| A serverless function per site | A deploy, a runtime, and a secret to maintain for a 20-line form |
| A full backend | Weeks of work for one form |

Web Messager replaces all of them with one HTTP request. Your credentials stay on the server, your
inbox address never reaches the browser, and the frontend integration is a single `fetch` call.

## Features

- **One endpoint** — `POST /api/send-message` with three required fields. The whole API fits on one page.
- **No backend code on your side** — call it directly from the browser, a static site generator, or a mobile app.
- **Email delivery to your inbox** — every submission arrives as an email at the address on your account, via Nodemailer over SMTP.
- **Per-project API keys** — one account, many sites; rotate or delete a key without touching the others.
- **Usage tracking** — all-time and per-day message counts per project, visible on the dashboard.
- **Rate limiting built in** — 100 messages per project per day, reset each calendar day, with a clean `429` when spent.
- **JWT authentication** — dashboard sessions use httpOnly cookies; API keys are signed JWTs with a one-year expiry.
- **Self-hostable** — Node.js, Express and PostgreSQL, with a Docker Compose file for the database.
- **React dashboard included** — sign up, create projects, copy keys, watch counts, read the API docs.

## How it works

1. **Create an account** on the dashboard — your account email is the inbox every message is delivered to.
2. **Create a project**, giving it a name and the domain you'll call the API from. The server generates an API key (a signed JWT carrying the project id) valid for one year.
3. **POST your form** to `/api/send-message` with the key in the JSON body.
4. **Read your mail.** The server checks the key, checks the project's daily quota, increments the counters, and sends you an email containing the sender, their name, and the message.

## Quick start: send your first message

Sign up at [web-messager.mohitch.me](https://web-messager.mohitch.me), create a project, copy the
API key, and send a request:

```bash
curl -X POST https://web-messager.mohitch.me/api/send-message \
  -H "Content-Type: application/json" \
  -d '{
    "api": "YOUR_API_KEY",
    "from": "visitor@example.com",
    "name": "Jane Doe",
    "subject": "New contact form submission",
    "message": "Hi, I would like to know more about your pricing."
  }'
```

### React contact form example

```jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  const res = await fetch("https://web-messager.mohitch.me/api/send-message", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api: import.meta.env.VITE_MESSAGE_API_KEY,
      from: form.email,
      name: form.name,
      subject: "New contact form submission",
      message: form.message,
    }),
  });
  setSent(res.ok);
};
```

### HTML + vanilla JavaScript example

```html
<form id="contact">
  <input name="email" type="email" required />
  <textarea name="message" required></textarea>
  <button>Send</button>
</form>

<script>
  document.getElementById("contact").addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    await fetch("https://web-messager.mohitch.me/api/send-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api: "YOUR_API_KEY",
        from: data.get("email"),
        message: data.get("message"),
      }),
    });
  });
</script>
```

### Python example

```python
import requests

requests.post(
    "https://web-messager.mohitch.me/api/send-message",
    json={
        "api": API_KEY,
        "from": "visitor@example.com",
        "message": "Hello from Python",
    },
)
```

## API reference

### `POST /api/send-message`

Public endpoint (CORS open). Authentication is the `api` field in the body — there is no
`Authorization` header.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `api` | string | Yes | Your project's API key, copied from the dashboard |
| `from` | string | Yes | Who the message is from, typically the visitor's email address |
| `message` | string | Yes | The message body |
| `name` | string | No | Sender's name; falls back to `Anonymous` |
| `subject` | string | No | Subject line of the email you receive |

**Success — `200`**

```json
{ "message": "Email sent successfully" }
```

**Errors**

| Status | Body | Cause |
| --- | --- | --- |
| `400` | `Missing required fields` | `api`, `from` or `message` is absent |
| `401` | `Invalid Api Key` | Key is missing, malformed, or expired |
| `404` | `Project not found` | Key is valid but its project was deleted |
| `429` | `Daily limit reached` | This project already sent 100 messages today |
| `500` | `Failed to send email` | Accepted but delivery failed; safe to retry |

### Dashboard endpoints

These back the web UI and require the httpOnly session cookie set at login.

| Method | Route | Description |
| --- | --- | --- |
| `POST` | `/auth/register` | Create an account (email, name, password) |
| `POST` | `/auth/login` | Log in; sets a JWT session cookie |
| `GET` | `/auth/verify` | Validate the current session cookie |
| `GET` | `/auth/logout` | Clear the session cookie |
| `GET` | `/dashboard/projects` | List your projects with their message counts |
| `POST` | `/dashboard/addProject` | Create a project and generate its API key |
| `DELETE` | `/dashboard/deleteProject/:id` | Delete a project and revoke its key |

## Tech stack

| Layer | Technology |
| --- | --- |
| Backend | Node.js, Express 5, ES modules |
| Database | PostgreSQL 17 (`pg`), schema created on boot |
| Email | Nodemailer over SMTP |
| Auth | `jsonwebtoken`, `bcryptjs`, httpOnly cookies |
| Frontend | React 19, React Router 7, Vite 8, Tailwind CSS 4, Axios |
| Infra | Docker Compose for PostgreSQL |

## Self-hosting and local development

### Prerequisites

- Node.js 18 or newer
- Docker (for PostgreSQL), or an existing PostgreSQL instance
- An SMTP account for outbound mail — with Gmail, use an [App Password](https://support.google.com/accounts/answer/185833), not your login password

### 1. Clone and start the database

```bash
git clone https://github.com/radhechaudhary/web-messager.git
cd web-messager
docker compose up -d
```

The `postgres` service listens on `5432` and persists to the `pg_data` volume. Tables are created
automatically the first time the backend connects.

### 2. Configure and run the backend

```bash
cd backend
npm install
cp example.env .env   # then fill in the values below
node index.js
```

The API starts on `http://localhost:3000`.

### 3. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Vite serves the dashboard on `http://localhost:5173`. Make sure `frontend/.env` points at your
backend and `FRONTEND_URL` in `backend/.env` points back at Vite, or CORS will reject the
dashboard's requests.

## Environment variables

### `backend/.env`

| Variable | Description |
| --- | --- |
| `PORT` | Port the API listens on (default `3000`) |
| `JWT_SECRET` | Secret used to sign session cookies **and** project API keys |
| `FRONTEND_URL` | Origin allowed by CORS for the dashboard, e.g. `http://localhost:5173` |
| `SMTP_USER` | SMTP account used to send mail |
| `SMTP_PASS` | SMTP password or app password |
| `POSTGRES_HOST` | Database host, e.g. `localhost` |
| `POSTGRES_PORT` | Database port, e.g. `5432` |
| `POSTGRES_DB` | Database name, e.g. `messager` |
| `POSTGRES_USER` | Database user |
| `POSTGRES_PASSWORD` | Database password |

### `frontend/.env`

| Variable | Description |
| --- | --- |
| `VITE_BACKEND_URL` | Base URL of the API, e.g. `http://localhost:3000` |

## Database schema

Both tables are created on startup if they don't exist.

```sql
users (
  email     VARCHAR(255) PRIMARY KEY,
  name      VARCHAR(255) NOT NULL,
  password  VARCHAR(255) NOT NULL   -- bcrypt hash
)

projects (
  id                   SERIAL PRIMARY KEY,
  name                 VARCHAR(255) NOT NULL,
  domain               VARCHAR(255) NOT NULL,
  api_key              VARCHAR(255) NOT NULL,
  message_count        INT  DEFAULT 0,
  user_email           VARCHAR(255) REFERENCES users(email),
  daily_limit          INT  DEFAULT 100,
  daily_message_count  INT  DEFAULT 0,
  last_reset           DATE DEFAULT CURRENT_DATE
)
```

## Project structure

```
message_service/
├── backend/
│   ├── index.js                 # Express app, CORS, static SPA hosting
│   ├── db.js                    # PostgreSQL pool + schema bootstrap
│   ├── routes/                  # auth, dashboard, sendmail routers
│   ├── controllers/             # auth and dashboard handlers
│   └── middlewares/             # JWT cookie verification
├── frontend/
│   └── src/
│       ├── pages/               # Landing, Login, Register, Dashboard, Docs
│       ├── components/          # Navbar, ProtectedRoute
│       ├── layouts/             # DashboardLayout
│       └── api/                 # Axios clients
└── docker-compose.yaml          # PostgreSQL 17
```

## Deployment

The backend serves the built dashboard itself, so one process hosts both. Build the frontend and
copy the output into `backend/public`:

```bash
cd frontend && npm run build
cp -r dist/* ../backend/public/
```

Express serves `backend/public` as static files and falls back to `index.html` for unknown paths,
so client-side routes like `/dashboard` and `/docs` resolve on a hard refresh. Set `FRONTEND_URL`
to your production origin before deploying.

## Security notes

- Passwords are hashed with bcrypt; plaintext is never stored.
- Session tokens are httpOnly cookies, so page scripts can't read them.
- API keys are signed JWTs — treat them as secrets. Anyone holding one can send messages to your inbox and consume the project's daily quota.
- Because the key travels in the request body from the browser, a determined visitor can read it from your page source. The daily cap and per-project revocation are the mitigations; rotate a key by deleting the project and creating a new one.
- Never commit `.env`. It is already listed in `.gitignore`.

## FAQ

**Where do messages get delivered?**
To the email address you registered with. Each API request becomes one email containing the
sender, their name, and the message body.

**Do my visitors need an account?**
No. They fill in your form, your page calls the API with your project key, and that's the whole
exchange.

**How long is an API key valid?**
One year from the moment the project is created. After that the API returns `401` and you create a
new project to get a fresh key.

**What happens when I hit the daily limit?**
Requests are rejected with `429` until the next calendar day. Nothing is queued and nothing is
delivered late, so your form can tell the visitor immediately.

**Is the limit per account or per project?**
Per project. Two projects have 100 messages each per day.

**Can I use it with Next.js, Astro, Hugo, or plain HTML?**
Yes. It's a plain HTTP endpoint with no SDK, so anything that can send a JSON POST works.

**Can I self-host it?**
Yes — that's the setup documented above. You need Node.js, PostgreSQL, and an SMTP account.

## Roadmap

- Configurable per-project daily limits (the `daily_limit` column exists but the API currently enforces a fixed 100)
- Domain allowlisting so a key only works from its registered origin
- Spam filtering and honeypot support
- Webhook delivery alongside email
- Message history in the dashboard

## License

ISC.

---

**Keywords:** contact form API, contact form backend, form to email, static site contact form,
email API, send email from JavaScript, form submission endpoint, JAMstack contact form, serverless
contact form alternative, Node.js email service, Express contact form, React contact form, self-hosted
form backend, Nodemailer API, portfolio contact form.
