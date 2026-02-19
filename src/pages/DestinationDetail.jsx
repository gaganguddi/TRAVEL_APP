import { useParams, Link } from "react-router-dom";
import { MapPin, Star, Clock, Globe2, DollarSign, Languages, ArrowRight, Sparkles, ChevronLeft } from "lucide-react";
import { destinations } from "../data/destinations";
import WeatherWidget from "../components/WeatherWidget";
import AIChat from "../components/AIChat";

export default function DestinationDetail() {
    const { id } = useParams();
    const dest = destinations.find((d) => d.id === parseInt(id));

    if (!dest) {
        return (
            <div className="page-wrapper" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "80vh" }}>
                <div style={{ textAlign: "center" }}>
                    <h2>Destination not found</h2>
                    <Link to="/explore" className="btn btn-primary" style={{ marginTop: 16 }}>Browse Destinations</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="page-wrapper">
            {/* Hero Image */}
            <div className="detail-hero">
                <img src={dest.image} alt={dest.name} className="detail-hero__img" />
                <div className="detail-hero__overlay" />
                <div className="detail-hero__content container">
                    <Link to="/explore" className="detail-back btn btn-secondary">
                        <ChevronLeft size={16} /> Back to Explore
                    </Link>
                    <div className="detail-hero__info">
                        <div className="detail-hero__tags">
                            {dest.tags.map((t) => (
                                <span key={t} className="badge badge-accent">{t}</span>
                            ))}
                        </div>
                        <h1 className="detail-hero__name">{dest.name}</h1>
                        <p className="detail-hero__country"><MapPin size={16} /> {dest.country} · {dest.continent}</p>
                        <div className="detail-hero__rating">
                            <Star size={18} fill="currentColor" style={{ color: "#f59e0b" }} />
                            <span style={{ fontWeight: 700, fontSize: "1.2rem" }}>{dest.rating}</span>
                            <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem" }}>/ 5.0</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="container" style={{ paddingTop: 60, paddingBottom: 80 }}>
                <div className="detail-layout">
                    {/* Main Left */}
                    <div className="detail-main">
                        {/* About */}
                        <section className="glass-card" style={{ padding: 32, marginBottom: 24 }}>
                            <h2 style={{ fontFamily: "var(--font-display)", marginBottom: 16 }}>About {dest.name}</h2>
                            <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, fontSize: "1rem" }}>{dest.description}</p>

                            <div className="detail-facts">
                                {[
                                    { icon: Clock, label: "Best Season", value: dest.bestTime },
                                    { icon: DollarSign, label: "Currency", value: dest.currency },
                                    { icon: Languages, label: "Language", value: dest.language },
                                    { icon: Globe2, label: "Continent", value: dest.continent },
                                ].map(({ icon: Icon, label, value }) => (
                                    <div key={label} className="detail-fact">
                                        <Icon size={18} style={{ color: "var(--accent-primary)" }} />
                                        <div>
                                            <p className="detail-fact__label">{label}</p>
                                            <p className="detail-fact__value">{value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Highlights */}
                        <section className="glass-card" style={{ padding: 32, marginBottom: 24 }}>
                            <h2 style={{ fontFamily: "var(--font-display)", marginBottom: 20 }}>Top Highlights</h2>
                            <div className="detail-highlights">
                                {dest.highlights.map((h, i) => (
                                    <div key={i} className="detail-highlight">
                                        <div className="detail-highlight__num">{i + 1}</div>
                                        <p className="detail-highlight__name">{h}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Plan CTA */}
                        <div className="detail-plan-cta glass-card">
                            <div className="detail-plan-cta__glow" />
                            <Sparkles size={24} style={{ color: "var(--accent-secondary)" }} />
                            <div>
                                <h3 style={{ fontFamily: "var(--font-display)" }}>Ready to visit {dest.name}?</h3>
                                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: 4 }}>
                                    Let AI build your perfect {dest.name} itinerary in seconds.
                                </p>
                            </div>
                            <Link to={`/planner`} className="btn btn-primary" style={{ marginLeft: "auto", whiteSpace: "nowrap" }}>
                                Plan This Trip <ArrowRight size={15} />
                            </Link>
                        </div>

                        {/* AI Chat */}
                        <section style={{ marginTop: 24 }}>
                            <h2 style={{ fontFamily: "var(--font-display)", marginBottom: 20 }}>
                                Ask AI About <span className="gradient-text">{dest.name}</span>
                            </h2>
                            <AIChat destination={dest.name} country={dest.country} />
                        </section>
                    </div>

                    {/* Right Sidebar */}
                    <div className="detail-sidebar">
                        <h2 style={{ fontFamily: "var(--font-display)", marginBottom: 16 }}>
                            Live Weather in <span className="gradient-text">{dest.name}</span>
                        </h2>
                        <WeatherWidget city={dest.weatherCity} />

                        {/* Similar Destinations */}
                        <div style={{ marginTop: 32 }}>
                            <h3 style={{ fontFamily: "var(--font-display)", marginBottom: 16 }}>Similar Destinations</h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                {destinations
                                    .filter((d) => d.id !== dest.id && d.tags.some((t) => dest.tags.includes(t)))
                                    .slice(0, 3)
                                    .map((d) => (
                                        <Link key={d.id} to={`/destination/${d.id}`} className="similar-dest glass-card">
                                            <img src={d.image} alt={d.name} className="similar-dest__img" />
                                            <div>
                                                <p className="similar-dest__name">{d.name}</p>
                                                <p className="similar-dest__country"><MapPin size={11} /> {d.country}</p>
                                                <span className="similar-dest__rating"><Star size={11} fill="currentColor" /> {d.rating}</span>
                                            </div>
                                        </Link>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        .detail-hero { position: relative; height: 500px; overflow: hidden; }
        .detail-hero__img { width: 100%; height: 100%; object-fit: cover; }
        .detail-hero__overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(8,12,20,0.95) 0%, rgba(8,12,20,0.3) 60%, transparent 100%); }
        .detail-hero__content { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: space-between; padding-top: 90px; padding-bottom: 48px; }
        .detail-back { width: fit-content; }
        .detail-hero__info { display: flex; flex-direction: column; gap: 8px; }
        .detail-hero__tags { display: flex; gap: 8px; flex-wrap: wrap; }
        .detail-hero__name { font-family: var(--font-display); font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 900; color: white; }
        .detail-hero__country { display: flex; align-items: center; gap: 8px; color: rgba(255,255,255,0.7); font-size: 1rem; }
        .detail-hero__rating { display: flex; align-items: center; gap: 8px; color: #f59e0b; }
        .detail-layout { display: grid; grid-template-columns: 1fr 360px; gap: 32px; align-items: flex-start; }
        .detail-main { display: flex; flex-direction: column; }
        .detail-sidebar { position: sticky; top: 90px; }
        .detail-facts { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-top: 24px; }
        .detail-fact { display: flex; align-items: flex-start; gap: 12px; padding: 12px; background: rgba(255,255,255,0.03); border-radius: var(--radius-md); border: 1px solid var(--border-subtle); }
        .detail-fact__label { color: var(--text-muted); font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
        .detail-fact__value { color: var(--text-primary); font-weight: 600; font-size: 0.9rem; margin-top: 2px; }
        .detail-highlights { display: flex; flex-direction: column; gap: 0; }
        .detail-highlight { display: flex; align-items: center; gap: 16px; padding: 12px 0; border-bottom: 1px solid var(--border-subtle); }
        .detail-highlight:last-child { border-bottom: none; }
        .detail-highlight__num { width: 32px; height: 32px; border-radius: 50%; background: var(--gradient-primary); color: white; font-weight: 700; font-size: 0.85rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .detail-highlight__name { font-weight: 600; font-size: 0.95rem; }
        .detail-plan-cta { display: flex; align-items: center; gap: 16px; padding: 24px; position: relative; overflow: hidden; flex-wrap: wrap; }
        .detail-plan-cta__glow { position: absolute; inset: 0; background: radial-gradient(circle at left, rgba(99,102,241,0.15), transparent 70%); pointer-events: none; }
        .similar-dest { display: flex; gap: 12px; align-items: center; padding: 12px; text-decoration: none; border-radius: var(--radius-md) !important; }
        .similar-dest__img { width: 60px; height: 60px; border-radius: var(--radius-sm); object-fit: cover; flex-shrink: 0; }
        .similar-dest__name { font-weight: 700; font-size: 0.9rem; color: var(--text-primary); }
        .similar-dest__country { display: flex; align-items: center; gap: 4px; color: var(--text-muted); font-size: 0.75rem; margin-top: 2px; }
        .similar-dest__rating { display: flex; align-items: center; gap: 4px; color: var(--accent-gold); font-size: 0.78rem; font-weight: 700; margin-top: 4px; }
        @media (max-width: 1024px) { .detail-layout { grid-template-columns: 1fr; } .detail-sidebar { position: static; } }
        @media (max-width: 600px) { .detail-hero { height: 350px; } .detail-facts { grid-template-columns: 1fr; } }
      `}</style>
        </div>
    );
}
