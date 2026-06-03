// Vercel serverless function: proxies requests to OpenWeatherMap
// Expects `OPENWEATHER_API_KEY` to be set in Vercel environment variables

const fetchImpl =
  typeof fetch === "function" ? fetch : global.fetch || require("node-fetch");

module.exports = async (req, res) => {
  try {
    const key = process.env.OPENWEATHER_API_KEY;
    if (!key) {
      res.status(500).json({ error: "Missing API key on server." });
      return;
    }

    const { city, lat, lon } = req.query || {};
    let url = "";
    if (city) {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${key}&units=metric`;
    } else if (lat && lon) {
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`;
    } else {
      res.status(400).json({ error: "Missing lat/lon or city parameter" });
      return;
    }

    const resp = await fetchImpl(url);
    const data = await resp.json();
    res.status(resp.status || 200).json(data);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
};
