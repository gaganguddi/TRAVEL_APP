import { useState, useEffect, useCallback } from "react";
import { fetchWeather, fetchForecast } from "../services/weather";

export function useWeather(city) {
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadWeather = useCallback(async (cityName) => {
        if (!cityName) return;
        setLoading(true);
        setError(null);
        try {
            const [w, f] = await Promise.all([fetchWeather(cityName), fetchForecast(cityName)]);
            setWeather(w);
            setForecast(f);
        } catch (err) {
            setError(err.response?.data?.message || "Could not fetch weather data.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (city) loadWeather(city);
    }, [city, loadWeather]);

    // Auto-refresh every 10 minutes
    useEffect(() => {
        if (!city) return;
        const interval = setInterval(() => loadWeather(city), 10 * 60 * 1000);
        return () => clearInterval(interval);
    }, [city, loadWeather]);

    return { weather, forecast, loading, error, refresh: () => loadWeather(city) };
}
