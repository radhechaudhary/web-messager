import { useState } from "react";
import { Link } from "react-router-dom";

const BASE_URL = "https://web-messager.mohitch.me";

const SNIPPETS = {
  javascript: `await fetch("${BASE_URL}/api/send-message", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    api: import.meta.env.VITE_MESSAGE_API_KEY,
    from: form.email,
    name: form.name,
    subject: "New contact form submission",
    message: form.message,
  }),
});`,
  curl: `curl -X POST ${BASE_URL}/api/send-message \\
  -H "Content-Type: application/json" \\
  -d '{
    "api": "YOUR_API_KEY",
    "from": "visitor@example.com",
    "name": "Jane Doe",
    "subject": "New contact form submission",
    "message": "Hi, I would like to know more about your pricing."
  }'`,
  python: `import requests

requests.post(
    "${BASE_URL}/api/send-message",
    json={
        "api": API_KEY,
        "from": form["email"],
        "name": form["name"],
        "subject": "New contact form submission",
        "message": form["message"],
    },
)`,
};

const STEPS = [
  {
    title: "Create a project",
    body: "Sign up, then add a project with a name and the domain you'll call the API from. Takes about ten seconds.",
  },
  {
    title: "Copy the API key",
    body: "Each project gets its own key and its own counter, so one site's traffic never shows up in another's numbers.",
  },
  {
    title: "POST your form",
    body: "Send the key and the message in a single JSON request. The message lands in the inbox you signed up with.",
  },
];

const FEATURES = [
  {
    title: "No backend to write",
    body: "Post straight from the browser. There's no server to deploy, no SMTP credentials to store, and no mail library to keep updated.",
  },
  {
    title: "Your inbox stays private",
    body: "Messages are delivered to the address on your account. It never appears in your markup, so scrapers never find it.",
  },
  {
    title: "A key per project",
    body: "Run a marketing site, a docs site and a side project from one account, each with a separate key you can rotate on its own.",
  },
  {
    title: "Counted, not guessed",
    body: "The dashboard shows all-time and daily message counts per project, so you know what a form is actually doing.",
  },
  {
    title: "Predictable limits",
    body: "100 messages per project per day, reset each calendar day. Over the limit you get a clean 429 instead of a surprise.",
  },
  {
    title: "One endpoint to learn",
    body: "Three required fields, two optional ones, and documented error codes. The whole API fits on a single page.",
  },
];

const FAQS = [
  {
    q: "Where do the messages go?",
    a: "To the email address you registered with. Every request becomes one email containing the sender, their name and the message body.",
  },
  {
    q: "Do my visitors need an account?",
    a: "No. They fill in your form, your page calls the API with your project key, and that's the whole exchange.",
  },
  {
    q: "How long is a key valid?",
    a: "One year from the moment the project is created. After that the API returns 401 and you create a new project to get a fresh key.",
  },
  {
    q: "What happens when I hit the daily limit?",
    a: "Requests are rejected with 429 until the next calendar day. Nothing is queued and nothing is delivered late, so your form can tell the visitor straight away.",
  },
];

const Landing = () => {
  const [lang, setLang] = useState("javascript");

  return (
    <div className="min-h-screen bg-white text-slate-800">
      {/* Nav */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-slate-200">
        <nav className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-semibold text-slate-800">Message Service</span>
          <div className="flex items-center gap-1">
            <a
              href="#how-it-works"
              className="hidden sm:block text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2 rounded-md transition-colors"
            >
              How it works
            </a>
            <a
              href="#code"
              className="hidden sm:block text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2 rounded-md transition-colors"
            >
              API
            </a>
            <Link
              to="/login"
              className="text-sm font-medium text-slate-700 border border-slate-300 px-3.5 py-2 rounded-md hover:bg-slate-50 hover:text-slate-900 transition-colors"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="text-sm font-medium bg-indigo-600 text-white px-3.5 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Get started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="border-b border-slate-200 bg-gradient-to-b from-indigo-50/60 to-white">
        <div className="max-w-5xl mx-auto px-4 pt-20 pb-16">
          <div className="max-w-2xl">
            <span className="inline-block text-xs font-medium text-indigo-700 bg-indigo-100 rounded-full px-3 py-1">
              One endpoint. No backend.
            </span>
            <h1 className="mt-5 text-4xl sm:text-5xl font-semibold tracking-tight text-slate-900 leading-tight">
              Contact forms that email you, without a server.
            </h1>
            <p className="mt-5 text-lg text-slate-600 leading-relaxed">
              Point your form at one API endpoint and every submission arrives in your inbox.
              No SMTP setup, no serverless function, no inbox address sitting in your HTML for
              bots to harvest.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/register"
                className="rounded-md bg-indigo-600 text-white text-sm font-medium px-5 py-2.5 hover:bg-indigo-700 transition-colors"
              >
                Create a free project
              </Link>
              <a
                href="#code"
                className="rounded-md border border-slate-300 bg-white text-slate-700 text-sm font-medium px-5 py-2.5 hover:bg-slate-50 transition-colors"
              >
                See the request
              </a>
            </div>
            <p className="mt-4 text-sm text-slate-500">
              Free while you're building — 100 messages per project each day.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="max-w-5xl mx-auto px-4 py-16 scroll-mt-16">
        <h2 className="text-2xl font-semibold text-slate-900">How it works</h2>
        <p className="mt-2 text-slate-600">Three steps between an empty project and a working form.</p>
        <ol className="mt-8 grid gap-5 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-6"
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 text-sm font-semibold">
                {i + 1}
              </span>
              <h3 className="mt-4 font-semibold text-slate-800">{step.title}</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Code */}
      <section id="code" className="border-y border-slate-200 bg-slate-50 scroll-mt-16">
        <div className="max-w-5xl mx-auto px-4 py-16 grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">The entire integration</h2>
            <p className="mt-3 text-slate-600 leading-relaxed">
              One <code className="text-sm bg-white border border-slate-200 rounded px-1.5 py-0.5">POST</code>{" "}
              to <code className="text-sm bg-white border border-slate-200 rounded px-1.5 py-0.5">/api/send-message</code>.
              Send your project key as <code className="text-sm bg-white border border-slate-200 rounded px-1.5 py-0.5">api</code>,
              plus who it's from and what they wrote.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-slate-600">
              <li>
                <span className="font-medium text-slate-800">Required:</span>{" "}
                <code className="bg-white border border-slate-200 rounded px-1.5 py-0.5">api</code>,{" "}
                <code className="bg-white border border-slate-200 rounded px-1.5 py-0.5">from</code>,{" "}
                <code className="bg-white border border-slate-200 rounded px-1.5 py-0.5">message</code>
              </li>
              <li>
                <span className="font-medium text-slate-800">Optional:</span>{" "}
                <code className="bg-white border border-slate-200 rounded px-1.5 py-0.5">name</code>,{" "}
                <code className="bg-white border border-slate-200 rounded px-1.5 py-0.5">subject</code>
              </li>
              <li>
                <span className="font-medium text-slate-800">Back:</span> 200 on delivery, and
                documented codes for a bad key, a missing field or a spent quota.
              </li>
            </ul>
            <Link
              to="/docs"
              className="mt-6 inline-block text-sm font-medium text-indigo-600 hover:underline"
            >
              Read the full API reference →
            </Link>
          </div>

          <div className="rounded-xl overflow-hidden border border-slate-800 shadow-sm">
            <div className="flex bg-slate-800">
              {Object.keys(SNIPPETS).map((key) => (
                <button
                  key={key}
                  onClick={() => setLang(key)}
                  className={`px-4 py-2.5 text-xs font-medium capitalize transition-colors ${
                    lang === key
                      ? "bg-slate-900 text-white"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>
            <pre className="bg-slate-900 text-slate-100 text-xs p-5 overflow-x-auto leading-relaxed">
              <code>{SNIPPETS[lang]}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-semibold text-slate-900">Why use it</h2>
        <p className="mt-2 text-slate-600">
          Everything a contact form needs, and nothing it doesn't.
        </p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-6"
            >
              <h3 className="font-semibold text-slate-800">{feature.title}</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">{feature.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Limits */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 py-16">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 sm:flex sm:items-center sm:justify-between sm:gap-8">
            <div className="max-w-lg">
              <h2 className="text-2xl font-semibold text-slate-900">Free to start</h2>
              <p className="mt-3 text-slate-600 leading-relaxed">
                Every project sends up to 100 messages a day, counted per project rather than per
                account — so a second site brings a second 100. The counter resets each calendar
                day, and you can watch it on the dashboard.
              </p>
            </div>
            <div className="mt-6 sm:mt-0 shrink-0">
              <p className="text-4xl font-semibold text-slate-900">100</p>
              <p className="text-sm text-slate-500">messages / project / day</p>
              <Link
                to="/register"
                className="mt-4 inline-block rounded-md bg-indigo-600 text-white text-sm font-medium px-5 py-2.5 hover:bg-indigo-700 transition-colors"
              >
                Get your API key
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-semibold text-slate-900">Questions</h2>
        <dl className="mt-8 space-y-6">
          {FAQS.map((faq) => (
            <div key={faq.q} className="border-b border-slate-100 pb-6 last:border-0">
              <dt className="font-medium text-slate-800">{faq.q}</dt>
              <dd className="mt-2 text-sm text-slate-600 leading-relaxed">{faq.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-8 flex flex-wrap items-center justify-between gap-4">
          <span className="text-sm text-slate-500">
            © {new Date().getFullYear()} Message Service
          </span>
          <div className="flex items-center gap-5 text-sm">
            <Link to="/docs" className="text-slate-600 hover:text-slate-900">
              Docs
            </Link>
            <Link to="/login" className="text-slate-600 hover:text-slate-900">
              Log in
            </Link>
            <Link to="/register" className="text-indigo-600 font-medium hover:underline">
              Get started
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
