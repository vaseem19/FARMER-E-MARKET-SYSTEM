import axios from "axios";
import { useState } from "react";
import WeatherMap from "../components/WeatherMap";
import "./weather.css";

function Weather() {
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [data, setData] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [bg, setBg] = useState("sunny");

  const [coords, setCoords] = useState({
    lat: null,
    lon: null,
  });

  /* ================= CITY AUTOCOMPLETE ================= */
  const getCitySuggestions = async (value) => {
    setCity(value);

    if (value.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await axios.get(
        `https://api.teleport.org/api/cities/?search=${value}&limit=6`
      );

      const cities =
        res.data._embedded["city:search-results"].map((item) => ({
          name: item.matching_full_name,
        })) || [];

      setSuggestions(cities);
    } catch (error) {
      console.error("Autocomplete error:", error);
    }
  };

  /* ================= WEATHER ================= */
  const getWeather = async () => {
    if (!city) {
      alert("Please enter city");
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:5000/api/weather/${city}`
      );

      setData(res.data);

      const condition = res.data.weather[0].main;

      if (condition === "Rain") setBg("rainy");
      else if (condition === "Clouds") setBg("cloudy");
      else setBg("sunny");

      setSuggestions([]);
      setCoords({ lat: null, lon: null });

    } catch (err) {
      console.error(err);
    }
  };

  /* ================= LOCATION WEATHER ================= */
  const getLocationWeather = () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        setCoords({ lat, lon });

        try {
          const res = await axios.get(
            `http://localhost:5000/api/weather/coords?lat=${lat}&lon=${lon}`
          );

          setData(res.data);

          const condition = res.data.weather[0].main;

          if (condition === "Rain") setBg("rainy");
          else if (condition === "Clouds") setBg("cloudy");
          else setBg("sunny");

        } catch (err) {
          console.error(err);
        }
      }
    );
  };

  /* ================= FORECAST ================= */
  const getForecast = async () => {
    if (!city) return;

    try {
      const res = await axios.get(
        `http://localhost:5000/api/weather/forecast/${city}`
      );

      setForecast(res.data.list.slice(0, 5));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={`min-h-screen p-6 weather-${bg}`}>

      <h2 className="text-3xl font-bold text-center mb-6 text-black">
        🌦 Weather Dashboard
      </h2>

      {/* SEARCH CARD */}
      <div className="max-w-xl mx-auto bg-white/80 backdrop-blur-md p-5 rounded-2xl shadow-lg">

        <div className="relative">

          <input
            type="text"
            placeholder="Search any city in world..."
            value={city}
            onChange={(e) => getCitySuggestions(e.target.value)}
            className="w-full border rounded-xl px-4 py-3 outline-none text-black"
          />

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 w-full bg-white rounded-xl shadow-lg mt-2 z-50 max-h-64 overflow-y-auto">

              {suggestions.map((item, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setCity(item.name);
                    setSuggestions([]);
                  }}
                  className="px-4 py-3 hover:bg-blue-100 cursor-pointer text-black border-b"
                >
                  {item.name}
                </div>
              ))}

            </div>
          )}
        </div>

        {/* BUTTONS */}
        <div className="grid grid-cols-3 gap-3 mt-4">

          <button
            onClick={getWeather}
            className="bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700"
          >
            🌆 Weather
          </button>

          <button
            onClick={getLocationWeather}
            className="bg-green-600 text-white py-2 rounded-xl hover:bg-green-700"
          >
            📍 Location
          </button>

          <button
            onClick={getForecast}
            className="bg-purple-600 text-white py-2 rounded-xl hover:bg-purple-700"
          >
            🌧 Forecast
          </button>

        </div>
      </div>

      {/* WEATHER DATA */}
      {data && (
        <div className="max-w-5xl mx-auto mt-8">

          <h3 className="text-2xl font-bold text-center text-black mb-5">
            📍 {data.name}
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            <div className="bg-white/80 p-4 rounded-xl text-center shadow">
              <p className="text-gray-500">🌡 Temp</p>
              <h2 className="text-xl font-bold text-black">
                {data.main.temp}°C
              </h2>
            </div>

            <div className="bg-white/80 p-4 rounded-xl text-center shadow">
              <p className="text-gray-500">💧 Humidity</p>
              <h2 className="text-xl font-bold text-black">
                {data.main.humidity}%
              </h2>
            </div>

            <div className="bg-white/80 p-4 rounded-xl text-center shadow">
              <p className="text-gray-500">🌬 Wind</p>
              <h2 className="text-xl font-bold text-black">
                {data.wind.speed} km/h
              </h2>
            </div>

            <div className="bg-white/80 p-4 rounded-xl text-center shadow">
              <p className="text-gray-500">🌦 Condition</p>
              <h2 className="text-sm font-bold text-black">
                {data.weather[0].description}
              </h2>
            </div>

          </div>
        </div>
      )}

      {/* MAP */}
      {coords.lat && coords.lon && (
        <div className="max-w-5xl mx-auto mt-8 bg-white/80 p-5 rounded-2xl shadow-lg">
          <h3 className="font-bold text-black mb-3">🗺 Your Location</h3>
          <WeatherMap lat={coords.lat} lon={coords.lon} />
        </div>
      )}

      {/* FORECAST */}
      {forecast.length > 0 && (
        <div className="max-w-5xl mx-auto mt-8">

          <h3 className="text-xl font-bold text-black mb-4">
            🌧 Forecast
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">

            {forecast.map((item, index) => (
              <div
                key={index}
                className="bg-white/80 p-4 rounded-xl shadow text-center"
              >
                <p className="text-xs text-gray-500">
                  {item.dt_txt}
                </p>

                <p className="font-bold text-black">
                  🌡 {item.main.temp}°C
                </p>

                <p className="text-sm text-black">
                  🌥 {item.weather[0].description}
                </p>
              </div>
            ))}

          </div>
        </div>
      )}

    </div>
  );
}

export default Weather;