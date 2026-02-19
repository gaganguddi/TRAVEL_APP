import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowRight, Sparkles, MapPin, Cloud, Star, Zap, Globe2, Shield } from "lucide-react";
import { destinations } from "../data/destinations";
import DestinationCard from "../components/DestinationCard";
import WeatherWidget from "../components/WeatherWidget";

export default function Home() {
    const [weatherCity, setWeatherCity] = useState("Mumbai");
    const [searchInput, setSearchInput] = useState("");
    const [searching, setSearching] = useState(false);
    const featured = destinations.slice(0, 8);

    const handleWeatherSearch = (e) => {
        e.preventDefault();
        if (searchInput.trim()) { setWeatherCity(searchInput.trim()); setSearching(false); }
    };

    const popularCities = ["Paris", "Tokyo", "Dubai", "New York", "Bali", "London"];

    return (
        <div className="page-wrapper">
            {/* HERO */}
            <section className="hero">
                <div className="hero__bg">
                    <div className="hero__orb hero__orb--1" />
                    <div className="hero__orb hero__orb--2" />
                    <div className="hero__orb hero__orb--3" />
                </div>

                <div className="container hero__content">
                    <div className="hero__badge badge badge-accent">
                        <Sparkles size={13} /> AI-Powered Travel Planning
                    </div>

                    <h1 className="hero__title">
                        Discover Your Next<br />
                        <span className="gradient-text">Dream Destination</span>
                    </h1>

                    <p className="hero__subtitle">
                        Let AI craft your perfect itinerary. Explore 100+ destinations,
                        get live weather updates, and plan unforgettable journeys in seconds.
                    </p>

                    <div className="hero__actions">
                        <Link to="/planner" className="btn btn-primary hero__btn-main">
                            <Sparkles size={18} />
                            Start Planning with AI
                        </Link>
                        <Link to="/explore" className="btn btn-secondary hero__btn-secondary">
                            <Globe2 size={18} />
                            Explore Destinations
                        </Link>
                    </div>

                    <div className="hero__stats">
                        {[
                            { value: "100+", label: "Destinations" },
                            { value: "AI", label: "Powered Planning" },
                            { value: "Live", label: "Weather Data" },
                        ].map((s) => (
                            <div key={s.label} className="hero__stat">
                                <span className="hero__stat-value gradient-text">{s.value}</span>
                                <span className="hero__stat-label">{s.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Floating cards */}
                <div className="hero__float-cards">
                    {destinations.slice(0, 3).map((d, i) => (
                        <div key={d.id} className="hero__float-card" style={{ animationDelay: `${i * 0.5}s` }}>
                            <img src={d.image} alt={d.name} />
                            <div className="hero__float-card-body">
                                <p className="hero__float-card-name">{d.name}</p>
                                <p className="hero__float-card-loc"><MapPin size={10} /> {d.country}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="section how-it-works">
                <div className="container">
                    <p className="section-label">Simple Process</p>
                    <h2 className="section-title">Travel Planning in <span className="gradient-text">3 Easy Steps</span></h2>
                    <div className="how-steps">
                        {[
                            { icon: MapPin, title: "Choose Destination", desc: "Pick from 100+ stunning destinations across every continent.", color: "#6366f1" },
                            { icon: Sparkles, title: "AI Builds Itinerary", desc: "Gemini AI crafts a personalized day-by-day plan around your style.", color: "#a78bfa" },
                            { icon: Cloud, title: "Check Live Weather", desc: "Get real-time weather forecasts before and during your trip.", color: "#38bdf8" },
                        ].map((step, i) => (
                            <div key={i} className="how-step glass-card">
                                <div className="how-step__orb orb">
                                    <step.icon size={20} />
                                </div>
                                <div className="how-step__num">{String(i + 1).padStart(2, "0")}</div>
                                <h3 className="how-step__title">{step.title}</h3>
                                <p className="how-step__desc">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* POPULAR DESTINATIONS */}
            <section className="section">
                <div className="container">
                    <div className="section-header-row">
                        <div>
                            <p className="section-label">Top Picks</p>
                            <h2 className="section-title">Popular <span className="gradient-text">Destinations</span></h2>
                        </div>
                        <Link to="/explore" className="btn btn-secondary">View All <ArrowRight size={15} /></Link>
                    </div>
                    <div className="dest-grid">
                        {featured.map((d) => (
                            <DestinationCard key={d.id} destination={d} />
                        ))}
                    </div>
                </div>
            </section>

            {/* LIVE WEATHER */}
            <section className="section weather-section">
                <div className="container">
                    <div className="weather-section__inner">
                        <div className="weather-section__left">
                            <p className="section-label">Real-Time Data</p>
                            <h2 className="section-title">Check Live <span className="gradient-text">Weather</span></h2>
                            <p className="section-subtitle">
                                Plan smarter with live weather data for any destination.
                                Updated every 10 minutes.
                            </p>
                            <form className="weather-search" onSubmit={handleWeatherSearch}>
                                <div className="weather-search__input-wrap">
                                    <Search size={16} className="weather-search__icon" />
                                    <input
                                        type="text"
                                        placeholder="Search any city..."
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
                                        className="weather-search__input"
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary">Check Weather</button>
                            </form>
                            <div className="popular-cities">
                                <p className="popular-cities__label">Quick access:</p>
                                <div className="popular-cities__list">
                                    {popularCities.map((city) => (
                                        <button
                                            key={city}
                                            className={`tag-pill ${weatherCity === city ? "active" : ""}`}
                                            onClick={() => { setWeatherCity(city); setSearchInput(""); }}
                                        >
                                            {city}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="weather-section__right">
                            <WeatherWidget city={weatherCity} />
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA BANNER */}
            <section className="section">
                <div className="container">
                    <div className="cta-banner">
                        <div className="cta-banner__glow" />
                        <Zap size={28} className="cta-banner__icon" />
                        <h2 className="cta-banner__title">Ready to Plan Your Perfect Trip?</h2>
                        <p className="cta-banner__sub">Join thousands who have used WanderAI to plan unforgettable journeys.</p>
                        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
                            <Link to="/planner" className="btn btn-primary">
                                <Sparkles size={18} /> Start Planning Free
                            </Link>
                            <Link to="/explore" className="btn btn-secondary">
                                <Globe2 size={18} /> Browse Destinations
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <style>{`
        /* HERO */
        .hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
          padding: 80px 0 60px;
        }
        .hero__bg { position: absolute; inset: 0; pointer-events: none; }
        .hero__orb {
          position: absolute; border-radius: 50%;
          filter: blur(80px); opacity: 0.15;
        }
        .hero__orb--1 { width: 600px; height: 600px; background: #6366f1; top: -200px; right: -100px; }
        .hero__orb--2 { width: 400px; height: 400px; background: #a78bfa; bottom: -100px; left: -100px; }
        .hero__orb--3 { width: 300px; height: 300px; background: #38bdf8; top: 40%; left: 40%; }
        .hero__content {
          position: relative; z-index: 1;
          display: flex; flex-direction: column;
          align-items: flex-start;
          max-width: 650px;
          animation: fadeInUp 0.8s ease;
        }
        .hero__badge { margin-bottom: 24px; }
        .hero__title {
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 900;
          line-height: 1.1;
          margin-bottom: 20px;
          letter-spacing: -0.02em;
        }
        .hero__subtitle {
          color: var(--text-secondary);
          font-size: 1.15rem;
          line-height: 1.7;
          margin-bottom: 36px;
          max-width: 520px;
        }
        .hero__actions { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 48px; }
        .hero__btn-main { padding: 16px 32px; font-size: 1rem; }
        .hero__btn-secondary { padding: 16px 28px; font-size: 1rem; }
        .hero__stats { display: flex; gap: 40px; }
        .hero__stat { display: flex; flex-direction: column; gap: 2px; }
        .hero__stat-value { font-family: var(--font-display); font-size: 2rem; font-weight: 900; }
        .hero__stat-label { color: var(--text-muted); font-size: 0.82rem; }

        .hero__float-cards {
          position: absolute; right: 5%; top: 50%;
          transform: translateY(-50%);
          display: flex; flex-direction: column; gap: 16px;
        }
        .hero__float-card {
          width: 180px;
          border-radius: var(--radius-md);
          overflow: hidden;
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          animation: float 4s ease-in-out infinite;
          transition: var(--transition);
        }
        .hero__float-card:hover { transform: scale(1.05); }
        .hero__float-card img { width: 100%; height: 100px; object-fit: cover; }
        .hero__float-card-body { padding: 10px 12px; }
        .hero__float-card-name { font-family: var(--font-display); font-weight: 700; font-size: 0.9rem; }
        .hero__float-card-loc { display: flex; align-items: center; gap: 4px; color: var(--text-muted); font-size: 0.75rem; margin-top: 2px; }
        @media (max-width: 1024px) { .hero__float-cards { display: none; } }

        /* HOW IT WORKS */
        .how-steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 48px; }
        .how-step { padding: 32px 28px; position: relative; overflow: hidden; }
        .how-step__orb { margin-bottom: 20px; }
        .how-step__num {
          position: absolute; top: 20px; right: 24px;
          font-family: var(--font-display); font-size: 3rem; font-weight: 900;
          color: rgba(99,102,241,0.08); line-height: 1;
        }
        .how-step__title { font-size: 1.15rem; margin-bottom: 10px; }
        .how-step__desc { color: var(--text-secondary); font-size: 0.9rem; line-height: 1.6; }
        @media (max-width: 768px) { .how-steps { grid-template-columns: 1fr; } }

        /* DESTINATIONS */
        .section-header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; flex-wrap: wrap; gap: 16px; }
        .dest-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
        @media (max-width: 1200px) { .dest-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 900px) { .dest-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) { .dest-grid { grid-template-columns: 1fr; } }

        /* WEATHER SECTION */
        .weather-section { background: rgba(255,255,255,0.01); border-top: 1px solid var(--border-subtle); border-bottom: 1px solid var(--border-subtle); }
        .weather-section__inner { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
        .weather-section__left { display: flex; flex-direction: column; gap: 24px; }
        .weather-search { display: flex; gap: 12px; }
        .weather-search__input-wrap { position: relative; flex: 1; }
        .weather-search__icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-muted); }
        .weather-search__input {
          width: 100%; padding: 12px 16px 12px 42px;
          background: var(--bg-card); border: 1px solid var(--border-normal);
          border-radius: var(--radius-md); color: var(--text-primary);
          font-family: var(--font-body); font-size: 0.9rem; outline: none;
          transition: var(--transition);
        }
        .weather-search__input:focus { border-color: var(--accent-primary); box-shadow: 0 0 0 3px rgba(99,102,241,0.15); }
        .weather-search__input::placeholder { color: var(--text-muted); }
        .popular-cities { display: flex; flex-direction: column; gap: 10px; }
        .popular-cities__label { font-size: 0.8rem; color: var(--text-muted); }
        .popular-cities__list { display: flex; flex-wrap: wrap; gap: 8px; }
        @media (max-width: 768px) { .weather-section__inner { grid-template-columns: 1fr; } }

        /* CTA BANNER */
        .cta-banner {
          position: relative;
          text-align: center;
          padding: 80px 40px;
          border-radius: var(--radius-xl);
          background: var(--gradient-card);
          border: 1px solid var(--border-accent);
          overflow: hidden;
        }
        .cta-banner__glow {
          position: absolute; inset: 0;
          background: radial-gradient(circle at center, rgba(99,102,241,0.2) 0%, transparent 70%);
          pointer-events: none;
        }
        .cta-banner__icon { color: var(--accent-secondary); margin: 0 auto 20px; display: block; }
        .cta-banner__title { font-size: clamp(1.5rem, 3vw, 2.2rem); margin-bottom: 16px; }
        .cta-banner__sub { color: var(--text-secondary); margin-bottom: 32px; font-size: 1.05rem; }
      `}</style>
        </div>
    );
}
