const RATE_LIMIT = 60;
const WINDOW_MS = 60 * 1000;
const MAX_BYTES = 10 * 1024 * 1024;

const ipStore = new Map();

function getIP(request) {
  return request.headers.get("CF-Connecting-IP") || "unknown";
}

function rateLimit(ip) {
  const now = Date.now();
  const entry = ipStore.get(ip) || { count: 0, start: now };

  if (now - entry.start > WINDOW_MS) {
    entry.count = 0;
    entry.start = now;
  }

  entry.count++;
  ipStore.set(ip, entry);

  return entry.count <= RATE_LIMIT;
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Max-Age": "86400"
  };
}

function normalize(input) {
  try {
    let u = decodeURIComponent(input).trim();
    if (!/^https?:\/\//i.test(u)) u = "https://" + u;
    return u;
  } catch {
    return input;
  }
}

function blocked(url) {
  try {
    const u = new URL(url);
    const h = u.hostname.toLowerCase();

    if (!["http:", "https:"].includes(u.protocol)) return true;
    if (h === "localhost") return true;
    if (h.startsWith("127.")) return true;
    if (h.startsWith("10.")) return true;
    if (h.startsWith("192.168.")) return true;
    if (h.startsWith("172.")) return true;

    return false;
  } catch {
    return true;
  }
}

function html() {
  return `
<!doctype html>
<html>
<head>
  <title>OnyxOS Proxy Worker</title>
</head>
<body style="background:#111;color:#eee;font-family:sans-serif;padding:40px;">
  <h1>OnyxOS Proxy Worker</h1>
  <p>Usage:</p>
  <ul>
    <li><code>?quest=https://example.com</code></li>
    <li><code>?url=https://example.com</code></li>
  </ul>
  <p>Do not abuse it :)</p>
</body>
</html>
`;
}

export default {
  async fetch(request) {
    const ip = getIP(request);
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders()
      });
    }

    if (!rateLimit(ip)) {
      return new Response("Rate limit exceeded", {
        status: 429,
        headers: corsHeaders()
      });
    }

    const target = url.searchParams.get("quest") || url.searchParams.get("url");

    if (target) {
      const finalUrl = normalize(target);

      if (blocked(finalUrl)) {
        return new Response("Blocked", {
          status: 403,
          headers: corsHeaders()
        });
      }

      const res = await fetch(finalUrl, {
        method: request.method,
        headers: {
          "User-Agent": "Mozilla/5.0",
          Accept: "*/*"
        },
        redirect: "follow"
      });

      const body = await res.arrayBuffer();

      if (body.byteLength > MAX_BYTES) {
        return new Response("Too large", {
          status: 413,
          headers: corsHeaders()
        });
      }

      const headers = new Headers(res.headers);

      const ct = headers.get("content-type") || "";

      headers.set("Access-Control-Allow-Origin", "*");
      headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      headers.set("Access-Control-Allow-Headers", "*");

      if (ct.includes("text/html")) {
        headers.set("content-type", "text/html; charset=utf-8");
      }

      return new Response(body, {
        status: res.status,
        headers
      });
    }

    return new Response(html(), {
      headers: {
        "content-type": "text/html; charset=utf-8",
        ...corsHeaders()
      }
    });
  }
};
