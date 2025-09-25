import React, { useCallback, useMemo, useState } from "react";

const pretty = (obj) => JSON.stringify(obj, null, 2);

export default function LibKeyTestPage() {
  const [mode, setMode] = useState("doi"); // "doi" | "pmid"
  const [value, setValue] = useState("");
  const [includeJournal, setIncludeJournal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const endpoint = useMemo(() => {
    const params = new URLSearchParams();
    if (mode === "doi" && value) params.set("doi", value.trim());
    if (mode === "pmid" && value) params.set("pmid", value.trim());
    if (includeJournal) params.set("include", "journal");
    return `/api/libkey-lookup?${params.toString()}`;
  }, [mode, value, includeJournal]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError(null);
      setResult(null);
      if (!value.trim()) {
        setError("Enter a DOI or PMID value.");
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(endpoint);
        const json = await res.json();
        if (!res.ok) {
          setError(`Request failed (${res.status}): ${pretty(json)}`);
        } else {
          setResult(json);
        }
      } catch (err) {
        setError(String(err));
      } finally {
        setLoading(false);
      }
    },
    [endpoint, value]
  );

  return (
    <main style={{ maxWidth: 900, margin: "40px auto", padding: 16, fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif" }}>
      <h1>LibKey DOI/PMID Lookup Test</h1>
      <p>
        This page calls the server function at <code>/api/libkey-lookup</code> which securely
        proxies the Third Iron LibKey API. Add your <code>LIBKEY_API_KEY</code> and <code>LIBKEY_LIBRARY_ID</code>
        to your environment to enable live requests.
      </p>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <div>
          <label style={{ marginRight: 12 }}>
            <input
              type="radio"
              name="mode"
              value="doi"
              checked={mode === "doi"}
              onChange={() => setMode("doi")}
            />
            <span style={{ marginLeft: 6 }}>DOI</span>
          </label>
          <label style={{ marginLeft: 16 }}>
            <input
              type="radio"
              name="mode"
              value="pmid"
              checked={mode === "pmid"}
              onChange={() => setMode("pmid")}
            />
            <span style={{ marginLeft: 6 }}>PMID</span>
          </label>
        </div>

        <input
          type="text"
          placeholder={mode === "doi" ? "e.g. 10.1056/NEJMe1702728" : "e.g. 28317425"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          style={{ padding: 10, fontSize: 16, width: "100%" }}
        />

        <label>
          <input
            type="checkbox"
            checked={includeJournal}
            onChange={(e) => setIncludeJournal(e.target.checked)}
          />
          <span style={{ marginLeft: 8 }}>Include journal metadata (?include=journal)</span>
        </label>

        <button
          type="submit"
          disabled={loading}
          style={{ padding: "8px 14px", fontSize: 16 }}
        >
          {loading ? "Looking up..." : "Lookup"}
        </button>
      </form>

      <section style={{ marginTop: 24 }}>
        <h2>Request</h2>
        <pre style={{ background: "#f6f8fa", padding: 12, borderRadius: 6, overflowX: "auto" }}>{endpoint}</pre>
      </section>

      {error && (
        <section style={{ marginTop: 24 }}>
          <h2 style={{ color: "#b00020" }}>Error</h2>
          <pre style={{ background: "#fff5f5", padding: 12, borderRadius: 6, overflowX: "auto" }}>{error}</pre>
        </section>
      )}

      {result && (
        <section style={{ marginTop: 24 }}>
          <h2>Response</h2>
          <pre style={{ background: "#f6f8fa", padding: 12, borderRadius: 6, overflowX: "auto" }}>{pretty(result)}</pre>
        </section>
      )}
    </main>
  );
}
