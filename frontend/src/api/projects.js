async function request(path, { method = "GET", body, token } = {}) {
  const res = await fetch(`/api/projects${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return null;

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export const listProjects = (token) => request("", { token });

export const createProject = ({ name, domain }, token) =>
  request("", { method: "POST", body: { name, domain }, token });

export const deleteProject = (id, token) =>
  request(`/${id}`, { method: "DELETE", token });
