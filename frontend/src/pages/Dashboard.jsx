import { useEffect, useState } from "react";

const Dashboard = () => {
  // const { token } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({ name: "", domain: "" });
  const [creating, setCreating] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setCreating(true);
    try {
      // const project = await createProject(form, token);
      const project = { id: 1, name: form.name, domain: form.domain, apiKey: "api_key_123", messageCount: 0 };
      setProjects((prev) => [...prev, project]);
      setForm({ name: "", domain: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  useEffect(() => {console.log(projects)},[projects]);

  const handleDelete = async (id) => {

    if (!window.confirm("Delete this project? This cannot be undone.")) return;
    try {
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCopy = async (id, apiKey) => {
    try {
      await navigator.clipboard.writeText(apiKey);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      // clipboard access can be denied by the browser; nothing to do
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Projects</h1>
        <p className="text-sm text-slate-500">Create a project to get an API key for sending messages.</p>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 text-red-600 text-sm px-3 py-2">{error}</div>
      )}

      <form
        onSubmit={handleCreate}
        className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col sm:flex-row gap-4 sm:items-end"
      >
        <div className="flex-1">
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
            Project name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="My App"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex-1">
          <label htmlFor="domain" className="block text-sm font-medium text-slate-700 mb-1">
            Domain
          </label>
          <input
            id="domain"
            name="domain"
            type="text"
            required
            value={form.domain}
            onChange={handleChange}
            placeholder="myapp.com"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button
          type="submit"
          disabled={creating}
          className="rounded-md bg-indigo-600 text-white text-sm font-medium px-4 py-2 hover:bg-indigo-700 disabled:opacity-60 transition-colors"
        >
          {creating ? "Creating..." : "Create project"}
        </button>
      </form>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <p className="p-6 text-sm text-slate-500">Loading projects...</p>
        ) : projects.length === 0 ? (
          <p className="p-6 text-sm text-slate-500">No projects yet. Create one above to get started.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-500">
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Domain</th>
                  <th className="px-6 py-3 font-medium">API key</th>
                  <th className="px-6 py-3 font-medium">Messages</th>
                  <th className="px-6 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id} className="border-b border-slate-100 last:border-0">
                    <td className="px-6 py-3 font-medium text-slate-800">{project.name}</td>
                    <td className="px-6 py-3 text-slate-600">{project.domain}</td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-slate-100 rounded px-2 py-1 text-slate-700">
                          {project.apiKey}
                        </code>
                        <button
                          onClick={() => handleCopy(project.id, project.apiKey)}
                          className="text-xs text-indigo-600 hover:underline"
                        >
                          {copiedId === project.id ? "Copied!" : "Copy"}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-slate-600">{project.messageCount}</td>
                    <td className="px-6 py-3 text-right">
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="text-xs font-medium text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
