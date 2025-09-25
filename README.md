# RMC Interlibrary Loan Form

This project is a Gatsby site for an interlibrary loan form.

## LibKey DOI/PMID Lookup (base functionality)

We added a secure serverless function to call the Third Iron LibKey Article DOI/PMID Lookup endpoint using your API key on the server only.

- Function: `src/api/libkey-lookup.js`
- Test page: `src/pages/libkey-test.js` (route: `/libkey-test`)

The function accepts:

- `GET /api/libkey-lookup?doi=<DOI>`
- `GET /api/libkey-lookup?pmid=<PMID>`
- Optional: `include=journal`

It forwards the request to `https://public-api.thirdiron.com/public/v1/libraries/:library_id/articles/(doi|pmid)/:value` with your API key as an `Authorization: Bearer` header per Third Iron docs.

### Environment variables

Create local env files (do not commit secrets):

- `.env.development`
- `.env.production`

Copy from the provided examples and set your values:

```
LIBKEY_API_KEY=your-libkey-api-token-here
LIBKEY_LIBRARY_ID=your-library-id-here
```

Notes:

- Do NOT prefix these with `GATSBY_` (that would expose them to the client). The function reads them server-side only.
- Keep your API token secret; never post it publicly.

### Run locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create `.env.development` with the two variables above.
3. Start the dev server:
   ```bash
   npm run develop
   ```
4. Visit http://localhost:8000/libkey-test, enter a DOI or PMID, and submit.

You can also test via curl (assuming the dev server is running and env is set):

```bash
curl "http://localhost:8000/api/libkey-lookup?doi=10.1056/NEJMe1702728"
```

### Deployment notes

- Set `LIBKEY_API_KEY` and `LIBKEY_LIBRARY_ID` as environment variables in your hosting provider (e.g., Netlify) before building.
- Gatsby Functions will serve the API under `/api/libkey-lookup` during development. In production, your hosting platform may map this route differently. If using Netlify, Gatsby handles the mapping for you; ensure the environment variables are configured in the site settings.

### Security

- The LibKey API token is only sent server-to-server via the Gatsby Function and is not exposed to the browser.
- Avoid logging secrets. This function avoids echoing the key and only returns proxied response data and metadata.
