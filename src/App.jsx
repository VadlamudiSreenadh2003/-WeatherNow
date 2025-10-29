import React, { useState, useEffect } from "react";
import "./styles.css";

// SearchBar: unchanged
function SearchBar({ onSearch }) {
  const [city, setCity] = useState("");
  return (
    <form
      className="search"
      onSubmit={(e) => {
        e.preventDefault();
        if (city.trim()) onSearch(city.trim());
      }}
    >
      <input
        type="text"
        placeholder="Enter city name"
        value={city}
        onChange={e => setCity(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  );
}

// Weather mapping: unchanged
function getWeatherIcon(code) {
  if ([0].includes(code)) return "☀️";
  if ([1, 2, 3, 45, 48].includes(code)) return "⛅";
  if ([51, 53, 55, 61, 63, 65, 80, 81].includes(code)) return "🌦";
  if ([71, 73, 75, 85, 86].includes(code)) return "🌨";
  if ([95, 96, 99].includes(code)) return "⛈";
  return "🌡";
}

// WeatherCard: unchanged
function WeatherCard({ data }) {
  return (
    <div className="weather-card">
      <div className="weather-title">
        {data.city}, <span className="weather-meta">{data.country}</span>
      </div>
      <div className="weather-meta">
        Weather Reading Time:&nbsp;
        {new Date(data.time).toLocaleString()}
      </div>
      <div className="weather-data">
        <div>
          <div className="weather-data-val">{data.temperature}°C</div>
          <div className="weather-data-label">Temperature</div>
        </div>
        <div>
          <div className="weather-data-val">{data.windspeed} km/h</div>
          <div className="weather-data-label">Wind Speed</div>
        </div>
      </div>
      <div className="weather-code">{getWeatherIcon(data.weathercode)}</div>
    </div>
  );
}

// Fix: useEffect/init pattern for LiveClock (and works after HMR/refresh)
function LiveClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="live-clock">
      Local Time: {now.toLocaleString()}
    </div>
  );
}

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = async (city) => {
    try {
      setLoading(true);
      setError("");
      setWeatherData(null);

      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
      );
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        setError("City not found");
        setLoading(false);
        return;
      }

      const { latitude, longitude, name, country } = geoData.results[0];

      // const weatherRes = await fetch(
      //   `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      // );

      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=Asia%2FKolkata`
      );

      const weather = await weatherRes.json();

      setWeatherData({
        city: name,
        country,
        temperature: weather.current_weather.temperature,
        windspeed: weather.current_weather.windspeed,
        weathercode: weather.current_weather.weathercode,
        time: weather.current_weather.time,
      });
    } catch (err) {
      setError("Error fetching weather data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-root">
      <header className="header">
        <h1>🌦 Weather Now</h1>
        <LiveClock />
        <p className="subtitle">Fast weather forecast for any city</p>
      </header>
      <main className="container">
        <SearchBar onSearch={fetchWeather} />
        {loading && <div className="info">Loading...</div>}
        {error && <div className="error">{error}</div>}
        {weatherData && <WeatherCard data={weatherData} />}
      </main>
      <footer className="footer">
        &copy; {new Date().getFullYear()} Weather Now &bull; Powered by Open-Meteo
      </footer>
    </div>
  );
}

export default App;
