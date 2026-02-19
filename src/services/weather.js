import axios from "axios";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export async function fetchWeather(city) {
    const res = await axios.get(`${BASE_URL}/weather`, {
        params: { q: city, appid: API_KEY, units: "metric" },
    });
    const d = res.data;
    return {
        city: d.name,
        country: d.sys.country,
        temp: Math.round(d.main.temp),
        feelsLike: Math.round(d.main.feels_like),
        humidity: d.main.humidity,
        wind: Math.round(d.wind.speed * 10) / 10,
        windDeg: d.wind.deg,
        condition: d.weather[0].main,
        description: d.weather[0].description,
        icon: d.weather[0].icon,
        visibility: Math.round((d.visibility || 10000) / 1000),
        pressure: d.main.pressure,
        tempMin: Math.round(d.main.temp_min),
        tempMax: Math.round(d.main.temp_max),
        sunrise: d.sys.sunrise,
        sunset: d.sys.sunset,
        timezone: d.timezone,
    };
}

export async function fetchForecast(city) {
    const res = await axios.get(`${BASE_URL}/forecast`, {
        params: { q: city, appid: API_KEY, units: "metric", cnt: 40 },
    });

    // Build a map of date → best reading (prefer midday ~12:00)
    const dailyMap = {};

    res.data.list.forEach((item) => {
        const date = new Date(item.dt * 1000);
        // date key — use date only (YYYY-MM-DD) for reliable grouping
        const dateKey = date.toISOString().split("T")[0];
        const hour = date.getHours();

        if (!dailyMap[dateKey]) {
            dailyMap[dateKey] = { item, hour };
        } else {
            // Prefer the reading closest to noon
            const existingHour = dailyMap[dateKey].hour;
            if (Math.abs(hour - 12) < Math.abs(existingHour - 12)) {
                dailyMap[dateKey] = { item, hour };
            }
            // Track overall min/max across the day
            dailyMap[dateKey].allTemps = dailyMap[dateKey].allTemps || [dailyMap[dateKey].item.main.temp];
            dailyMap[dateKey].allTemps.push(item.main.temp);
        }
    });

    return Object.entries(dailyMap)
        .slice(0, 5)
        .map(([dateKey, { item, allTemps }]) => {
            const date = new Date(dateKey);
            const temps = allTemps || [item.main.temp];
            return {
                dateKey,
                day: date.toLocaleDateString("en-US", { weekday: "short" }),
                date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
                temp: Math.round(item.main.temp),
                tempMin: Math.round(Math.min(...temps)),
                tempMax: Math.round(Math.max(...temps)),
                condition: item.weather[0].main,
                description: item.weather[0].description,
                icon: item.weather[0].icon,
                humidity: item.main.humidity,
                wind: Math.round(item.wind.speed * 10) / 10,
                pop: Math.round((item.pop || 0) * 100), // probability of precipitation %
            };
        });
}

export function getWeatherIconUrl(icon) {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
}

export function getWeatherEmoji(condition) {
    const map = {
        Clear: "☀️",
        Clouds: "☁️",
        Rain: "🌧️",
        Drizzle: "🌦️",
        Thunderstorm: "⛈️",
        Snow: "❄️",
        Mist: "🌫️",
        Fog: "🌫️",
        Haze: "🌫️",
        Smoke: "🌫️",
        Dust: "🌪️",
        Sand: "🌪️",
        Tornado: "🌪️",
    };
    return map[condition] || "🌡️";
}

export function formatTime(unixTs, timezoneOffset) {
    const d = new Date((unixTs + timezoneOffset) * 1000);
    return d.toUTCString().slice(17, 22);
}

export function getWindDirection(deg) {
    const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    return dirs[Math.round(deg / 45) % 8];
}
