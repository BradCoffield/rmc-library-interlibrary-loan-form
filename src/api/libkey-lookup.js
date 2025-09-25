// Gatsby Function: /api/libkey-lookup
// Proxies requests to Third Iron LibKey Article DOI/PMID Lookup endpoint securely using a server-side API key.
// Usage:
//   GET /api/libkey-lookup?doi=10.1056/NEJMe1702728
//   GET /api/libkey-lookup?pmid=28317425
// Optional:
//   include=journal  -> forwards ?include=journal to LibKey API
//
// Required environment variables (configure in .env.development / .env.production or hosting provider):
//   LIBKEY_API_KEY     - Your Third Iron API token (keep secret; do NOT prefix with GATSBY_)
//   LIBKEY_LIBRARY_ID  - Your Third Iron Library ID (numeric)

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      res.setHeader("Allow", "GET");
      return res.status(405).json({ error: "Method not allowed" });
    }

    const apiKey = process.env.LIBKEY_API_KEY;
    const libraryId = process.env.LIBKEY_LIBRARY_ID;

    if (!apiKey || !libraryId) {
      return res.status(500).json({
        error:
          "Server misconfiguration: LIBKEY_API_KEY and LIBKEY_LIBRARY_ID must be set as environment variables.",
      });
    }

    const { doi, pmid, include } = req.query || {};

    if ((!doi && !pmid) || (doi && pmid)) {
      return res.status(400).json({
        error: "Provide exactly one of ?doi= or ?pmid= query parameters.",
      });
    }

    const idType = doi ? "doi" : "pmid";
    const idValue = encodeURIComponent(doi || pmid);

    const baseUrl = `https://public-api.thirdiron.com/public/v1/libraries/${encodeURIComponent(
      libraryId
    )}/articles/${idType}/${idValue}`;

    const url = new URL(baseUrl);
    if (include === "journal") {
      url.searchParams.set("include", "journal");
    }

    const response = await fetch(url.toString(), {
      headers: {
        // Prefer Authorization header for bearer token per Third Iron docs
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
    });

    const contentType = response.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    let body;
    try {
      body = isJson ? await response.json() : await response.text();
    } catch (e) {
      body = await response.text();
    }

    // Pass through status from Third Iron, include minimal metadata
    return res.status(response.status).json({
      proxied: true,
      status: response.status,
      ok: response.ok,
      url: url.toString(),
      data: body && isJson ? body : body,
    });
  } catch (err) {
    console.error("/api/libkey-lookup error:", err);
    return res.status(500).json({ error: "Unexpected server error" });
  }
}
