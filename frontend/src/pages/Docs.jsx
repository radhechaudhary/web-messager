const BASE_URL = "https://web-messager.mohitch.me";

const CodeBlock = ({ children }) => (
  <pre className="bg-slate-900 text-slate-100 text-xs rounded-lg p-4 overflow-x-auto">
    <code>{children}</code>
  </pre>
);

const Field = ({ name, type, optional, children }) => (
  <tr className="border-b border-slate-100 last:border-0 align-top">
    <td className="py-2 pr-4">
      <code className="text-xs bg-slate-100 rounded px-1.5 py-0.5 text-slate-800">{name}</code>
    </td>
    <td className="py-2 pr-4 text-xs whitespace-nowrap">
      <span className="text-slate-500">{type}</span>
      {optional && <span className="block text-slate-400">optional</span>}
    </td>
    <td className="py-2 text-slate-600">{children}</td>
  </tr>
);

const Docs = () => (
  <div className="space-y-8 max-w-3xl">
    <div>
      <h1 className="text-2xl font-semibold text-slate-800">API Documentation</h1>
      <p className="text-sm text-slate-500 mt-1">
        Send messages from your site or app and receive them in your inbox.
      </p>
    </div>

    <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-3">
      <h2 className="text-lg font-semibold text-slate-800">How it works</h2>
      <p className="text-sm text-slate-600">
        Every message you send through the API is delivered as an email to the address you signed
        up with. That makes it a good fit for contact forms, feedback widgets and notifications
        from your own site — your visitors never need an account, and you never expose your inbox.
      </p>
      <ol className="text-sm text-slate-600 list-decimal pl-5 space-y-1">
        <li>
          Create a project on the <span className="font-medium">Dashboard</span> with a name and
          the domain you'll call the API from.
        </li>
        <li>Copy the API key generated for that project.</li>
        <li>
          Send a <code className="bg-slate-100 rounded px-1 py-0.5">POST</code> request to the
          endpoint below with the key included in the request body.
        </li>
      </ol>
      <p className="text-sm text-slate-600">
        Each project has its own key and its own message counter, so you can use one project per
        site and track them separately on the Dashboard.
      </p>
    </section>

    <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-3">
      <h2 className="text-lg font-semibold text-slate-800">Authentication</h2>
      <p className="text-sm text-slate-600">
        Pass your project's API key as the{" "}
        <code className="bg-slate-100 rounded px-1 py-0.5">api</code> field in the JSON body of
        every request. There is no authorization header — the key goes in the body.
      </p>
      <p className="text-sm text-slate-600">
        Keys are valid for one year from the moment the project is created. After that the API
        returns <span className="font-mono">401</span> and you'll need to create a new project to
        get a fresh key. Treat the key as a secret: anyone who has it can send messages to your
        inbox and consume your daily quota.
      </p>
    </section>

    <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-3">
      <h2 className="text-lg font-semibold text-slate-800">Send a message</h2>
      <p className="text-sm">
        <span className="font-mono bg-slate-100 rounded px-1.5 py-0.5 text-slate-800">
          POST {BASE_URL}/api/send-message
        </span>
      </p>

      <p className="text-sm font-medium text-slate-700 mt-4">Body parameters</p>
      <table className="w-full text-sm">
        <tbody>
          <Field name="api" type="string">
            Your project's API key, copied from the Dashboard.
          </Field>
          <Field name="from" type="string">
            Who the message is from — typically the email address your visitor entered in your
            form. It is shown at the top of the email body.
          </Field>
          <Field name="message" type="string">
            The message body.
          </Field>
          <Field name="name" type="string" optional>
            The sender's name, shown in the email body below{" "}
            <code className="bg-slate-100 rounded px-1 py-0.5">from</code>. Falls back to{" "}
            <span className="font-medium">Anonymous</span> when omitted.
          </Field>
          <Field name="subject" type="string" optional>
            Subject line of the email you receive. Omitting it sends the email with an empty
            subject.
          </Field>
        </tbody>
      </table>

      <p className="text-sm font-medium text-slate-700 mt-4">cURL</p>
      <CodeBlock>{`curl -X POST ${BASE_URL}/api/send-message \\
  -H "Content-Type: application/json" \\
  -d '{
    "api": "YOUR_API_KEY",
    "from": "visitor@example.com",
    "message": "Hi, I would like to know more about your pricing.",
    "name": "Jane Doe",
    "subject": "New contact form submission"
  }'`}</CodeBlock>

      <p className="text-sm font-medium text-slate-700 mt-4">JavaScript (fetch)</p>
      <CodeBlock>{`await fetch("${BASE_URL}/api/send-message", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    api: import.meta.env.VITE_MESSAGE_API_KEY,
    from: form.email,
    message: form.message,
    name: form.name, // optional
    subject: "New contact form submission", // optional
  }),
});`}</CodeBlock>

      <p className="text-sm font-medium text-slate-700 mt-4">Response</p>
      <CodeBlock>{`{
  "message": "Email sent successfully"
}`}</CodeBlock>
    </section>

    <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-3">
      <h2 className="text-lg font-semibold text-slate-800">Daily limits</h2>
      <p className="text-sm text-slate-600">
        Each project can send{" "}
        <span className="font-medium text-slate-800">100 messages per day</span>. The counter is
        per project, not per account, so two projects have 100 each.
      </p>
      <ul className="text-sm text-slate-600 list-disc pl-5 space-y-1">
        <li>The daily counter resets at the start of each calendar day.</li>
        <li>
          Once the limit is reached, further requests are rejected with{" "}
          <span className="font-mono">429</span> until the reset — nothing is queued or sent late.
        </li>
        <li>
          A request counts against your quota as soon as it is accepted, including when delivery
          later fails.
        </li>
        <li>
          The <span className="font-medium">Messages</span> column on the Dashboard shows the
          all-time total for each project, not just today's.
        </li>
      </ul>
      <p className="text-sm text-slate-600">
        If you expect more volume than this, spread traffic across projects or ask for the limit
        on your account to be raised.
      </p>
    </section>

    <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-3">
      <h2 className="text-lg font-semibold text-slate-800">Errors</h2>
      <table className="w-full text-sm">
        <tbody>
          <Field name="400" type="Missing required fields">
            One of <code className="bg-slate-100 rounded px-1 py-0.5">api</code>,{" "}
            <code className="bg-slate-100 rounded px-1 py-0.5">from</code> or{" "}
            <code className="bg-slate-100 rounded px-1 py-0.5">message</code> is missing from the
            body. <code className="bg-slate-100 rounded px-1 py-0.5">name</code> and{" "}
            <code className="bg-slate-100 rounded px-1 py-0.5">subject</code> are optional and
            never cause this.
          </Field>
          <Field name="401" type="Invalid Api Key">
            The <code className="bg-slate-100 rounded px-1 py-0.5">api</code> field is missing,
            malformed, or the key has expired.
          </Field>
          <Field name="404" type="Project not found">
            The key is valid but its project no longer exists — most likely it was deleted from
            the Dashboard.
          </Field>
          <Field name="429" type="Daily limit reached">
            This project has already sent 100 messages today. Retry after the daily reset.
          </Field>
          <Field name="500" type="Failed to send email">
            The message was accepted but could not be delivered. Safe to retry, though it will
            count against your quota again.
          </Field>
        </tbody>
      </table>
    </section>
  </div>
);

export default Docs;
