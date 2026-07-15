const WEATHER_CODES = {
  0: { icon: "☀️", label: "Klarer Himmel" },
  1: { icon: "🌤️", label: "Überwiegend klar" },
  2: { icon: "⛅", label: "Teilweise bewölkt" },
  3: { icon: "☁️", label: "Bedeckt" },
  45: { icon: "🌫️", label: "Nebel" },
  48: { icon: "🌫️", label: "Reifnebel" },
  51: { icon: "🌦️", label: "Leichter Nieselregen" },
  53: { icon: "🌦️", label: "Nieselregen" },
  55: { icon: "🌧️", label: "Starker Nieselregen" },
  61: { icon: "🌧️", label: "Leichter Regen" },
  63: { icon: "🌧️", label: "Regen" },
  65: { icon: "🌧️", label: "Starker Regen" },
  71: { icon: "🌨️", label: "Leichter Schneefall" },
  73: { icon: "🌨️", label: "Schneefall" },
  75: { icon: "❄️", label: "Starker Schneefall" },
  80: { icon: "🌦️", label: "Regenschauer" },
  81: { icon: "🌧️", label: "Regenschauer" },
  82: { icon: "⛈️", label: "Heftige Regenschauer" },
  95: { icon: "⛈️", label: "Gewitter" },
  96: { icon: "⛈️", label: "Gewitter mit Hagel" },
  99: { icon: "⛈️", label: "Starkes Gewitter" },
};

function weatherInfo(code) {
  return WEATHER_CODES[code] || { icon: "🌡️", label: "Unbekannt" };
}

const form = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");
const statusText = document.getElementById("statusText");
const currentCard = document.getElementById("currentCard");
const currentIcon = document.getElementById("currentIcon");
const currentTemp = document.getElementById("currentTemp");
const currentCity = document.getElementById("currentCity");
const currentDesc = document.getElementById("currentDesc");
const currentMeta = document.getElementById("currentMeta");
const forecastSection = document.getElementById("forecast");
const forecastChart = document.getElementById("forecastChart");

const DAY_NAMES = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

function setStatus(text, isError = false) {
  statusText.textContent = text;
  statusText.classList.toggle("error", isError);
}

async function geocodeCity(name) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1&language=de&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Geocoding fehlgeschlagen");
  const data = await res.json();
  if (!data.results || data.results.length === 0) throw new Error("Stadt nicht gefunden");
  return data.results[0];
}

async function fetchWeather(lat, lon, timezone) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weathercode&current_weather=true&timezone=${encodeURIComponent(timezone)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Wetterdaten konnten nicht geladen werden");
  return res.json();
}

function renderCurrent(place, weather) {
  const info = weatherInfo(weather.current_weather.weathercode);
  currentIcon.textContent = info.icon;
  currentTemp.textContent = `${Math.round(weather.current_weather.temperature)}°`;
  currentCity.textContent = `${place.name}${place.country ? ", " + place.country : ""}`;
  currentDesc.textContent = info.label;
  currentMeta.textContent = `Wind: ${Math.round(weather.current_weather.windspeed)} km/h`;
  currentCard.hidden = false;
}

function renderForecast(weather) {
  const { time, temperature_2m_max, temperature_2m_min, weathercode } = weather.daily;
  const allMax = Math.max(...temperature_2m_max);
  const allMin = Math.min(...temperature_2m_min);
  const range = Math.max(allMax - allMin, 1);

  forecastChart.innerHTML = "";
  time.forEach((dateStr, i) => {
    const max = temperature_2m_max[i];
    const min = temperature_2m_min[i];
    const info = weatherInfo(weathercode[i]);
    const barHeight = 30 + ((max - allMin) / range) * 80;
    const date = new Date(dateStr);
    const label = i === 0 ? "Heute" : DAY_NAMES[date.getDay()];

    const col = document.createElement("div");
    col.className = "day-col";
    col.innerHTML = `
      <span class="day-max">${Math.round(max)}°</span>
      <div class="day-bar" style="height:${barHeight}px"></div>
      <span class="day-icon">${info.icon}</span>
      <span class="day-min">${Math.round(min)}°</span>
      <span class="day-label">${label}</span>
    `;
    forecastChart.appendChild(col);
  });
  forecastSection.hidden = false;
}

async function loadWeatherFor(city) {
  setStatus("Suche läuft …");
  currentCard.hidden = true;
  forecastSection.hidden = true;
  try {
    const place = await geocodeCity(city);
    const weather = await fetchWeather(place.latitude, place.longitude, place.timezone || "auto");
    renderCurrent(place, weather);
    renderForecast(weather);
    setStatus("");
  } catch (err) {
    setStatus(err.message || "Etwas ist schiefgelaufen.", true);
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (city) loadWeatherFor(city);
});

loadWeatherFor("Berlin");
