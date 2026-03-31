const base = "http://localhost:3001";
const headers = { "Content-Type": "application/json" };

(async () => {
  try {
    let r = await fetch(`${base}/signup`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        name: "Test User2",
        avatar: "https://example.com/avatar.png",
        email: "testuser2@example.com",
        password: "password123",
      }),
    });
    console.log("/signup", r.status, await r.text());

    r = await fetch(`${base}/signin`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        email: "testuser2@example.com",
        password: "password123",
      }),
    });
    const signin = await r.json();
    console.log("/signin", r.status, signin);

    const token = signin.token;
    const authHeaders = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    r = await fetch(`${base}/users/me`, {
      method: "GET",
      headers: authHeaders,
    });
    console.log("/users/me", r.status, await r.text());

    r = await fetch(`${base}/users/me`, {
      method: "PATCH",
      headers: authHeaders,
      body: JSON.stringify({
        name: "Updated User2",
        avatar: "https://example.com/avatar2.png",
      }),
    });
    console.log("/users/me PATCH", r.status, await r.text());

    r = await fetch(`${base}/items`, { method: "GET" });
    console.log("/items", r.status, await r.text());

    r = await fetch(`${base}/items`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({
        name: "Test Item",
        weather: "warm",
        imageUrl: "https://example.com/item.png",
      }),
    });
    const created = await r.json();
    console.log("/items POST", r.status, created);

    const itemId = created._id;
    r = await fetch(`${base}/items/${itemId}/likes`, {
      method: "PUT",
      headers: authHeaders,
    });
    console.log("/items/:id/likes PUT", r.status, await r.text());

    r = await fetch(`${base}/items/${itemId}/likes`, {
      method: "DELETE",
      headers: authHeaders,
    });
    console.log("/items/:id/likes DELETE", r.status, await r.text());

    r = await fetch(`${base}/items/${itemId}`, {
      method: "DELETE",
      headers: authHeaders,
    });
    console.log("/items/:id DELETE", r.status, await r.text());
  } catch (e) {
    console.error(e);
  }
})();
