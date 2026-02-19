import { useState } from "react";
import { useWeather } from "../hooks/useWeather";
import { getWeatherEmoji, getWeatherIconUrl, formatTime, getWindDirection } from "../services/weather";
import { Wind, Droplets, Eye, RefreshCw, Thermometer, Gauge, Sunrise, Sunset, Umbrella } from "lucide-react";

export default function WeatherWidget({ city }) {
  const { weather, forecast, loading, error, refresh } = useWeather(city);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setTimeout(() => setRefreshing(false), 800);
  };

  if (loading) return <WeatherSkeleton />;
  if (error) return (
    <div className="ww-error">
      <span>⚠️</span>
      <p>{error}</p>
    </div>
  );
  if (!weather) return null;

  const sunriseTime = weather.sunrise ? formatTime(weather.sunrise, weather.timezone) : "—";
  const sunsetTime = weather.sunset ? formatTime(weather.sunset, weather.timezone) : "—";

  return (
    <div className="ww">
      {/* Header */}
      <div className="ww-header">
        <div>
          <p className="ww-city">{weather.city}, {weather.country}</p>
          <p className="ww-desc">{weather.description}</p>
        </div>
        <button
          className={`ww-refresh ${refreshing ? "spinning" : ""}`}
          onClick={handleRefresh}
          title="Refresh"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      {/* Main Temperature */}
      <div className="ww-main">
        <div className="ww-temp-row">
          <img src={getWeatherIconUrl(weather.icon)} alt={weather.condition} className="ww-icon" />
          <div className="ww-temp">{weather.temp}<span className="ww-unit">°C</span></div>
          <div className="ww-emoji">{getWeatherEmoji(weather.condition)}</div>
        </div>
        <div className="ww-range">
          <Thermometer size={13} />
          <span>H:{weather.tempMax}° L:{weather.tempMin}°</span>
          <span className="ww-dot">·</span>
          <span>Feels {weather.feelsLike}°</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="ww-stats">
        {[
          { Icon: Droplets, label: "Humidity", value: `${weather.humidity}%`, color: "#38bdf8" },
          { Icon: Wind, label: "Wind", value: `${weather.wind} m/s ${getWindDirection(weather.windDeg || 0)}`, color: "#a78bfa" },
          { Icon: Eye, label: "Visibility", value: `${weather.visibility} km`, color: "#10b981" },
          { Icon: Gauge, label: "Pressure", value: `${weather.pressure} hPa`, color: "#f59e0b" },
        ].map(({ Icon, label, value, color }) => (
          <div key={label} className="ww-stat">
            <Icon size={15} style={{ color }} />
            <span className="ww-stat-val">{value}</span>
            <small className="ww-stat-label">{label}</small>
          </div>
        ))}
      </div>

      {/* Sunrise / Sunset */}
      <div className="ww-sun">
        <div className="ww-sun-item">
          <Sunrise size={16} style={{ color: "#f59e0b" }} />
          <div>
            <small>Sunrise</small>
            <p>{sunriseTime}</p>
          </div>
        </div>
        <div className="ww-sun-divider" />
        <div className="ww-sun-item">
          <Sunset size={16} style={{ color: "#f97316" }} />
          <div>
            <small>Sunset</small>
            <p>{sunsetTime}</p>
          </div>
        </div>
      </div>

      {/* 5-Day Forecast */}
      {forecast.length > 0 && (
        <div className="ww-forecast">
          <p className="ww-forecast-title">5-Day Forecast</p>
          <div className="ww-forecast-grid">
            {forecast.map((day, i) => (
              <div key={i} className={`ww-fday ${i === 0 ? "ww-fday--today" : ""}`}>
                <p className="ww-fday-name">{i === 0 ? "Today" : day.day}</p>
                <p className="ww-fday-date">{day.date}</p>
                <img
                  src={getWeatherIconUrl(day.icon)}
                  alt={day.condition}
                  className="ww-fday-icon"
                />
                <p className="ww-fday-cond">{day.condition}</p>
                <div className="ww-fday-temps">
                  <span className="ww-fday-max">{day.tempMax}°</span>
                  <span className="ww-fday-min">{day.tempMin}°</span>
                </div>
                {day.pop > 0 && (
                  <div className="ww-fday-pop">
                    <Umbrella size={10} />
                    <span>{day.pop}%</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .ww {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 0;
          overflow: hidden;
        }
        .ww-error {
          padding: 24px; text-align: center; color: var(--text-secondary);
          display: flex; flex-direction: column; align-items: center; gap: 8px;
          border: 1px solid var(--border-subtle); border-radius: var(--radius-lg);
        }
        .ww-error span { font-size: 2rem; }

        .ww-header {
          display: flex; justify-content: space-between; align-items: flex-start;
          padding: 20px 24px 0;
        }
        .ww-city {
          font-family: var(--font-display); font-weight: 700; font-size: 1.05rem;
          color: var(--text-primary);
        }
        .ww-desc { color: var(--text-secondary); font-size: 0.8rem; text-transform: capitalize; margin-top: 2px; }
        .ww-refresh {
          width: 28px; height: 28px; border-radius: 50%;
          background: var(--bg-card); border: 1px solid var(--border-subtle);
          color: var(--text-secondary); cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: var(--transition); flex-shrink: 0;
        }
        .ww-refresh:hover { color: var(--accent-primary); border-color: var(--border-accent); }
        .ww-refresh.spinning svg { animation: spin 0.8s linear infinite; }

        .ww-main { padding: 12px 24px 16px; }
        .ww-temp-row { display: flex; align-items: center; gap: 4px; }
        .ww-icon { width: 64px; height: 64px; flex-shrink: 0; }
        .ww-temp {
          font-family: var(--font-display); font-size: 3.8rem; font-weight: 900;
          line-height: 1; color: var(--text-primary); letter-spacing: -2px;
        }
        .ww-unit { font-size: 1.4rem; color: var(--text-muted); vertical-align: top; margin-top: 10px; display: inline-block; margin-left: 4px; }
        .ww-emoji { font-size: 2.4rem; margin-left: auto; }
        .ww-range {
          display: flex; align-items: center; gap: 6px;
          color: var(--text-secondary); font-size: 0.82rem; margin-top: 4px;
        }
        .ww-dot { opacity: 0.4; }

        .ww-stats {
          display: grid; grid-template-columns: repeat(4, 1fr);
          border-top: 1px solid var(--border-subtle);
          border-bottom: 1px solid var(--border-subtle);
        }
        .ww-stat {
          display: flex; flex-direction: column; align-items: center;
          gap: 4px; padding: 14px 8px;
          border-right: 1px solid var(--border-subtle);
        }
        .ww-stat:last-child { border-right: none; }
        .ww-stat-val { font-weight: 700; font-size: 0.82rem; color: var(--text-primary); text-align: center; }
        .ww-stat-label { color: var(--text-muted); font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.04em; }

        .ww-sun {
          display: flex; align-items: center; padding: 14px 24px;
          border-bottom: 1px solid var(--border-subtle);
          gap: 0;
        }
        .ww-sun-item { flex: 1; display: flex; align-items: center; gap: 10px; }
        .ww-sun-item small { color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.04em; display: block; }
        .ww-sun-item p { font-weight: 700; font-size: 0.9rem; color: var(--text-primary); margin-top: 1px; }
        .ww-sun-divider { width: 1px; height: 36px; background: var(--border-subtle); margin: 0 16px; }

        .ww-forecast { padding: 16px 20px 20px; }
        .ww-forecast-title {
          font-family: var(--font-display); font-weight: 700; font-size: 0.82rem;
          color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em;
          margin-bottom: 12px;
        }
        .ww-forecast-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; }
        .ww-fday {
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 10px 6px;
          text-align: center;
          display: flex; flex-direction: column; align-items: center; gap: 3px;
          transition: var(--transition);
        }
        .ww-fday:hover { background: var(--bg-card-hover); border-color: var(--border-accent); }
        .ww-fday--today {
          background: rgba(99,102,241,0.08);
          border-color: rgba(99,102,241,0.3);
        }
        .ww-fday-name { font-weight: 800; font-size: 0.78rem; color: var(--text-primary); }
        .ww-fday-date { color: var(--text-muted); font-size: 0.65rem; }
        .ww-fday-icon { width: 36px; height: 36px; }
        .ww-fday-cond { color: var(--text-secondary); font-size: 0.65rem; text-align: center; }
        .ww-fday-temps { display: flex; gap: 4px; align-items: center; margin-top: 2px; }
        .ww-fday-max { font-weight: 700; font-size: 0.82rem; color: var(--text-primary); }
        .ww-fday-min { font-size: 0.75rem; color: var(--text-muted); }
        .ww-fday-pop {
          display: flex; align-items: center; gap: 2px;
          color: #38bdf8; font-size: 0.65rem; font-weight: 700;
        }
      `}</style>
    </div>
  );
}

function WeatherSkeleton() {
  return (
    <div style={{ border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
      <div style={{ padding: "20px 24px" }}>
        <div className="skeleton" style={{ height: 18, width: "55%", marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 13, width: "35%", marginBottom: 16 }} />
        <div className="skeleton" style={{ height: 64, width: "50%", marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 12, width: "70%", marginBottom: 20 }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", borderTop: "1px solid var(--border-subtle)" }}>
        {[1, 2, 3, 4].map(i => <div key={i} className="skeleton" style={{ height: 60, margin: 8, borderRadius: 8 }} />)}
      </div>
      <div style={{ padding: "16px 20px" }}>
        <div className="skeleton" style={{ height: 14, width: "30%", marginBottom: 12 }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 6 }}>
          {[1, 2, 3, 4, 5].map(i => <div key={i} className="skeleton" style={{ height: 90, borderRadius: 12 }} />)}
        </div>
      </div>
    </div>
  );
}
