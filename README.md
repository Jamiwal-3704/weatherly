# Weatherly — Lightweight Weather App

A small, modern weather app that shows current weather for your location or any searched city. It uses OpenWeatherMap for weather data and includes a tiny serverless proxy so your API key can stay secret in production.

Highlights

- Clean, responsive UI with weather-driven backgrounds.
- Search by city or use geolocation for instant local weather.
- Serverless proxy (Netlify) to keep API keys off the client in production.

Preview

Open `index.html` in a browser or run a static server and try searching for a city. The UI adapts to the current weather (clear, rain, snow, clouds, mist).

Project layout

- [index.html](index.html) — main app UI
- [about.html](about.html) — developer / credits page
- css/styles.css — styling and weather themes
- js/script.js — app logic and API calls
- assets/ — icons and images
- functions/weather.js — serverless proxy for OpenWeather (Netlify)
- config.sample.js — local-only config template (gitignored)
- .env.sample — example environment variables

Quick start — Local development

1. Copy the sample config and add your OpenWeather key (for local testing only):

```js
// config.js (DO NOT commit this file)
const CONFIG = {
  OPENWEATHER_API_KEY: "your_openweather_api_key_here",
  USE_NETLIFY_FUNCTION: false, // set true when running with the serverless proxy
};
```

2. Serve the folder (recommended) so fetch requests work properly:

```bash
# Using a tiny static server
npx http-server .  # or 'python -m http.server 8000'
```

3. Open the served URL (e.g., `http://localhost:8080`) and test the app.

Using the serverless proxy (recommended for production)

In production you should never expose the API key client-side. This project ships with a small serverless function at `functions/weather.js` that proxies requests to OpenWeather.

Netlify (preferred flow)

1. Create a Netlify site from this repository.
2. In Netlify → Site settings → Build & deploy → Environment, add:

```
OPENWEATHER_API_KEY=your_openweather_api_key_here
```

3. Ensure `netlify.toml` exists (it points to `functions/`), then deploy.
4. Either remove local `config.js` or set `USE_NETLIFY_FUNCTION: true` so the client calls `/.netlify/functions/weather`.

Vercel (alternative)

Vercel expects serverless functions in an `api/` folder. To deploy here:

- Move or copy `functions/weather.js` → `api/weather.js` and adapt the handler if needed.
- Set an environment variable `OPENWEATHER_API_KEY` in the Vercel dashboard for your project.
- Deploy with the Vercel CLI or through the dashboard.

Commands to create a GitHub repo and push (one-liners)

```bash
# Using GitHub CLI
gh repo create YOUR_USERNAME/weatherly --public --source=. --remote=origin --push

# OR with git only
git remote add origin https://github.com/YOUR_USERNAME/weatherly.git
git push -u origin main
```

Security & best practices

- Never commit `config.js` or any file containing real secrets. `config.sample.js` and `.env.sample` are provided to document variables.
- Keep the production API key in environment variables on your host (Netlify/Vercel) and use the serverless proxy to fetch data.
- Rotate your API key if it was accidentally exposed.

Troubleshooting

- If weather doesn't load, check the browser console for network errors and verify `OPENWEATHER_API_KEY` (local or env).
- If you're using the serverless proxy on Netlify, confirm `USE_NETLIFY_FUNCTION` is `true` in local `config.js` while testing.

Contributing

Feedback and improvements welcome — open an issue or send a PR. Small improvements that help: better error handling, more weather conditions, or caching results.

Credits

- Built and styled by Sahil Ittan
- Uses OpenWeatherMap API

License

This project is open; add your preferred license file if publishing.

---

If you want, I can:

- push this repository to GitHub for you, or
- create a Vercel/Netlify deployment and wire the `OPENWEATHER_API_KEY` env var.

Tell me which action you'd like next.
