const CodeBlock = ({ children }) => (
  <pre className="bg-slate-900 text-slate-100 text-xs rounded-lg p-4 overflow-x-auto">
    <code>{children}</code>
  </pre>
);

const Docs = () => (
  <div className="space-y-8 max-w-3xl">
    <div>
      <h1 className="text-2xl font-semibold text-slate-800">API Documentation</h1>
      <p className="text-sm text-slate-500 mt-1">
        Use your project's API key to send messages through the API.
      </p>
    </div>

    <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-3">
      <h2 className="text-lg font-semibold text-slate-800">Authentication</h2>
      <p className="text-sm text-slate-600">
        Every project has its own API key, shown on the{" "}
        <span className="font-medium">Dashboard</span> after you create a project. Send it
        with every request in the <code className="bg-slate-100 rounded px-1 py-0.5">x-api-key</code>{" "}
        header.
      </p>
    </section>

    <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-3">
      <h2 className="text-lg font-semibold text-slate-800">Send a message</h2>
      <p className="text-sm text-slate-600">
        <span className="font-mono bg-slate-100 rounded px-1 py-0.5">POST /api/v1/messages</span>
      </p>

      <p className="text-sm font-medium text-slate-700 mt-4">Request body</p>
      <CodeBlock>{`{
  "to": "recipient@example.com",
  "subject": "Hello",
  "message": "This is the message body"
}`}</CodeBlock>

      <p className="text-sm font-medium text-slate-700 mt-4">cURL</p>
      <CodeBlock>{`curl -X POST http://localhost:3000/api/v1/messages \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: YOUR_API_KEY" \\
  -d '{
    "to": "recipient@example.com",
    "subject": "Hello",
    "message": "This is the message body"
  }'`}</CodeBlock>

      <p className="text-sm font-medium text-slate-700 mt-4">JavaScript (fetch)</p>
      <CodeBlock>{`await fetch("http://localhost:3000/api/v1/messages", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": "YOUR_API_KEY",
  },
  body: JSON.stringify({
    to: "recipient@example.com",
    subject: "Hello",
    message: "This is the message body",
  }),
});`}</CodeBlock>

      <p className="text-sm font-medium text-slate-700 mt-4">Response</p>
      <CodeBlock>{`{
  "message": "Message accepted",
  "totalMessages": 1
}`}</CodeBlock>
    </section>

    <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-2">
      <h2 className="text-lg font-semibold text-slate-800">Errors</h2>
      <ul className="text-sm text-slate-600 list-disc pl-5 space-y-1">
        <li>
          <span className="font-mono">401</span> — missing or invalid{" "}
          <code className="bg-slate-100 rounded px-1 py-0.5">x-api-key</code>
        </li>
        <li>
          <span className="font-mono">400</span> — <code className="bg-slate-100 rounded px-1 py-0.5">to</code>,{" "}
          <code className="bg-slate-100 rounded px-1 py-0.5">subject</code> or{" "}
          <code className="bg-slate-100 rounded px-1 py-0.5">message</code> missing from the request body
        </li>
      </ul>
    </section>
  </div>
);

export default Docs;
