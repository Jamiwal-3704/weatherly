# Weather App

Small client-side Weather App using OpenWeatherMap. This fork prepares the project for safe deployment to Netlify with a server-side API proxy.

Getting started (local)

1. Copy `config.sample.js` to `config.js` and set your key:

```js
// config.js
const CONFIG = {
  OPENWEATHER_API_KEY: "your_key_here",
  USE_NETLIFY_FUNCTION: false,
};
```

2. Open `index.html` in a browser (or use a static server).

Netlify deploy (recommended)

1. In Netlify site settings add an environment variable `OPENWEATHER_API_KEY` with your key.
2. Optionally in `config.js` set `USE_NETLIFY_FUNCTION: true` or simply leave `config.js` absent — the site will call the function.
3. Build/deploy: connect the GitHub repo to Netlify or use the Netlify CLI.

Netlify function

The function is at `netlify/functions/weather.js` and proxies requests to OpenWeatherMap so the API key is not exposed client-side.

Security

- Do NOT commit `config.js` with the real key. `.gitignore` excludes it.
- Use Netlify environment variables for production.
