import { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = ({user}) => {
  // const { token } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", domain: "" });
  const [creating, setCreating] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        // const projects = await getProjects(token);
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/dashboard/projects`, { withCredentials: true });
        const projects = response.data.projects;
        setProjects(projects);
      } catch (err) {
        
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };



  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setCreating(true);
    try {
      // const project = await createProject(form, token);
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/dashboard/addProject`, form, { withCredentials: true });
      setForm({ name: "", domain: "" });
      setProjects((prev) => [...prev, response.data.project]);
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
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/dashboard/deleteProject/${id}`, { withCredentials: true }); 
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
                  <tr key={project.apiKey} className="border-b border-slate-100 last:border-0">
                    <td className="px-6 py-3 font-medium text-slate-800">{project.name}</td>
                    <td className="px-6 py-3 text-slate-600">{project.domain}</td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-slate-100 rounded px-2 py-1 text-slate-700">
                          {project.apiKey}
                        </code>
                        <button
                          onClick={() => handleCopy(project.id, project.api_key)}
                          className="text-xs text-indigo-600 hover:underline"
                        >
                          {copiedId === project.id ? "Copied!" : "Copy"}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-slate-600">{project.message_count}</td>
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
