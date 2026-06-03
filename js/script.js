const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(
  ".grant-location-container",
);
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const errorPage = document.querySelector(".error-page");
//initially vairables need????

let oldTab = userTab;
// read API key from a local `config.js` (create from config.sample.js)
const API_KEY = window.CONFIG?.OPENWEATHER_API_KEY || "";
// If you deploy to Netlify and add the function, set USE_NETLIFY_FUNCTION to true in config.js
const USE_NETLIFY_FUNCTION = window.CONFIG?.USE_NETLIFY_FUNCTION || false;
if (!API_KEY && !USE_NETLIFY_FUNCTION)
  console.warn(
    "No OpenWeather API key found. Create config.js from config.sample.js and set OPENWEATHER_API_KEY or enable USE_NETLIFY_FUNCTION.",
  );
oldTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(newTab) {
  if (newTab != oldTab) {
    oldTab.classList.remove("current-tab");
    oldTab = newTab;
    oldTab.classList.add("current-tab");

    if (!searchForm.classList.contains("active")) {
      //kya search form wala container is invisible, if yes then make it visible
      userInfoContainer.classList.remove("active");
      grantAccessContainer.classList.remove("active");
      searchForm.classList.add("active");
    } else {
      //main pehle search wale tab pr tha, ab your weather tab visible karna h
      searchForm.classList.remove("active");
      userInfoContainer.classList.remove("active");
      //ab main your weather tab me aagya hu, toh weather bhi display karna poadega, so let's check local storage first
      //for coordinates, if we haved saved them there.
      getfromSessionStorage();
    }
  }
}

userTab.addEventListener("click", () => {
  //pass clicked tab as input paramter
  switchTab(userTab);
});

searchTab.addEventListener("click", () => {
  //pass clicked tab as input paramter
  switchTab(searchTab);
});

//check if cordinates are already present in session storage
function getfromSessionStorage() {
  const localCoordinates = sessionStorage.getItem("user-coordinates");
  if (!localCoordinates) {
    //agar local coordinates nahi mile
    grantAccessContainer.classList.add("active");
  } else {
    const coordinates = JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);
  }
}

async function fetchUserWeatherInfo(coordinates) {
  if (!API_KEY && !USE_NETLIFY_FUNCTION) {
    alert(
      "Missing OpenWeather API key. Create `config.js` from `config.sample.js` and add your key, or enable `USE_NETLIFY_FUNCTION`.",
    );
    return;
  }
  const { lat, lon } = coordinates;
  // make grantcontainer invisible
  grantAccessContainer.classList.remove("active");
  //make loader visible
  loadingScreen.classList.add("active");

  //API CALL
  try {
    // If a Netlify function is configured, call it (server holds the API key)
    const url = USE_NETLIFY_FUNCTION
      ? `/.netlify/functions/weather?lat=${lat}&lon=${lon}`
      : `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();

    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  } catch (err) {
    loadingScreen.classList.remove("active");
    errorPage.classList.add("active");
  }
}

function renderWeatherInfo(weatherInfo) {
  //fistly, we have to fethc the elements

  const cityName = document.querySelector("[data-cityName]");
  const countryIcon = document.querySelector("[data-countryIcon]");
  const desc = document.querySelector("[data-weatherDesc]");
  const weatherIcon = document.querySelector("[data-weatherIcon]");
  const temp = document.querySelector("[data-temp]");
  const windspeed = document.querySelector("[data-windspeed]");
  const humidity = document.querySelector("[data-humidity]");
  const cloudiness = document.querySelector("[data-cloudiness]");

  //fetch values from weatherINfo object and put it UI elements
  cityName.innerText = weatherInfo?.name;
  countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
  desc.innerText = weatherInfo?.weather?.[0]?.description;
  weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
  temp.innerText = `${weatherInfo?.main?.temp} °C`;
  windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
  humidity.innerText = `${weatherInfo?.main?.humidity} %`;
  cloudiness.innerText = `${weatherInfo?.clouds?.all} %`;

  // update background according to weather
  setWeatherBackground(weatherInfo);
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

function showPosition(position) {
  const userCoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  };

  sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
  fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let cityName = searchInput.value;

  if (cityName === "") return;
  else fetchSearchWeatherInfo(cityName);
});

async function fetchSearchWeatherInfo(city) {
  if (!API_KEY && !USE_NETLIFY_FUNCTION) {
    alert(
      "Missing OpenWeather API key. Create `config.js` from `config.sample.js` and add your key, or enable `USE_NETLIFY_FUNCTION`.",
    );
    return;
  }
  loadingScreen.classList.add("active");
  userInfoContainer.classList.remove("active");
  grantAccessContainer.classList.remove("active");

  try {
    const url = USE_NETLIFY_FUNCTION
      ? `/.netlify/functions/weather?city=${encodeURIComponent(city)}`
      : `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  } catch (err) {
    userInfoContainer.classList.remove("active");
    errorPage.classList.add("active");
  }
}

function setWeatherBackground(weatherInfo) {
  try {
    const wrapper = document.querySelector(".wrapper");
    if (!wrapper) return;
    // determine main weather
    const weatherMain = (weatherInfo?.weather?.[0]?.main || "").toLowerCase();
    // day/night detection
    const now = weatherInfo?.dt || Math.floor(Date.now() / 1000);
    const sunrise = weatherInfo?.sys?.sunrise || 0;
    const sunset = weatherInfo?.sys?.sunset || 0;
    const isDay = now >= sunrise && now <= sunset;

    // clear previous weather-* classes
    wrapper.className = wrapper.className
      .split(" ")
      .filter((c) => !c.startsWith("weather-"))
      .join(" ");

    let cls = "weather-default";
    if (weatherMain.includes("clear"))
      cls = isDay ? "weather-clear" : "weather-clear-night";
    else if (weatherMain.includes("cloud")) cls = "weather-clouds";
    else if (
      weatherMain.includes("rain") ||
      weatherMain.includes("drizzle") ||
      weatherMain.includes("thunderstorm")
    )
      cls = "weather-rain";
    else if (weatherMain.includes("snow")) cls = "weather-snow";
    else if (weatherMain.match(/mist|fog|haze|smoke/)) cls = "weather-mist";

    wrapper.classList.add(cls);
  } catch (e) {
    console.error(e);
  }
}
