async function request(path, body) {
  const res = await fetch(`/api/auth/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export const registerUser = ({ name, email, password }) =>
  request("register", { name, email, password });

export const loginUser = ({ email, password }) =>
  request("login", { email, password });
