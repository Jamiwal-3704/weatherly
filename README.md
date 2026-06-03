# Weatherly (Weather App)

A small, client-side weather app that displays local and searched weather using OpenWeatherMap. This repository includes a serverless proxy (for Netlify) so your API key can remain secret in production.

Project structure (simple)

- `index.html` — main app page
- `about.html` — developer / about page
- `css/styles.css` — styles
- `js/script.js` — main client JavaScript
- `assets/` — images and icons used by the UI
- `functions/weather.js` — serverless function (Netlify) proxying OpenWeather API
- `config.sample.js` — example local config (do NOT commit real keys)
- `.env.sample` — example environment variables
- `.gitignore` — files to ignore
- `netlify.toml` — Netlify configuration

Quick start (local)

1. Copy `config.sample.js` to `config.js` at the project root and set your key:

```js
// config.js
const CONFIG = {
  OPENWEATHER_API_KEY: "your_key_here",
  USE_NETLIFY_FUNCTION: false, // set to true when using serverless proxy
};
```

2. Open `index.html` in a browser, or serve the folder with a static server (e.g., `npx http-server .`).

Using Netlify functions (recommended for production)

1. Deploy the project to Netlify.
2. In Netlify site settings → Build & deploy → Environment, add `OPENWEATHER_API_KEY` with your API key.
3. Ensure `netlify.toml` is present (it points Netlify to the `functions/` folder).
4. On the client, either remove `config.js` or set `USE_NETLIFY_FUNCTION: true` in `config.js` so the app uses the serverless proxy.

Deploy with Netlify CLI (optional):

```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod --dir=.
```

Security notes

- Never commit `config.js` with your real API key. `.gitignore` already excludes it.
- Use the Netlify function and `OPENWEATHER_API_KEY` env var for production to keep the key secret.

If you'd like, I can push this cleaned repo to GitHub and connect it to Netlify for an automated deploy — tell me the GitHub repo name and whether it should be public or private.
