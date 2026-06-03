// Netlify Function proxy for OpenWeatherMap
// Expects env var OPENWEATHER_API_KEY set in Netlify site settings

const fetch = global.fetch || require("node-fetch");

exports.handler = async function (event) {
  try {
    const key = process.env.OPENWEATHER_API_KEY;
    if (!key)
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Missing API key on server." }),
      };

    const params = event.queryStringParameters || {};
    let url = "";
    if (params.city) {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(params.city)}&appid=${key}&units=metric`;
    } else if (params.lat && params.lon) {
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${params.lat}&lon=${params.lon}&appid=${key}&units=metric`;
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing lat/lon or city parameter" }),
      };
    }

    const resp = await fetch(url);
    const data = await resp.json();
    // Return the upstream status so client can handle errors (e.g., 404 city not found)
    return { statusCode: resp.status || 200, body: JSON.stringify(data) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: String(err) }) };
  }
};
