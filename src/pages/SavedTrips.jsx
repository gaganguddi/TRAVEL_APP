import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BookMarked, Sparkles, MapPin, Calendar, Trash2, Eye, Clock } from "lucide-react";

export default function SavedTrips() {
    const [trips, setTrips] = useState([]);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [expandedDay, setExpandedDay] = useState(0);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("wanderai_trips") || "[]");
        setTrips(saved);
    }, []);

    const deleteTrip = (id) => {
        const updated = trips.filter((t) => t.id !== id);
        setTrips(updated);
        localStorage.setItem("wanderai_trips", JSON.stringify(updated));
        if (selectedTrip?.id === id) setSelectedTrip(null);
    };

    const formatDate = (iso) => {
        return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    };

    if (trips.length === 0) {
        return (
            <div className="page-wrapper">
                <div className="container" style={{ paddingTop: 80, paddingBottom: 80 }}>
                    <div className="saved-empty">
                        <div className="saved-empty__icon"><BookMarked size={32} /></div>
                        <h2>No Saved Trips Yet</h2>
                        <p>Generate an AI itinerary and save it here to revisit anytime.</p>
                        <Link to="/planner" className="btn btn-primary">
                            <Sparkles size={16} /> Plan Your First Trip
                        </Link>
                    </div>
                </div>
                <style>{`
          .saved-empty { text-align: center; padding: 80px 24px; display: flex; flex-direction: column; align-items: center; gap: 16px; }
          .saved-empty__icon { width: 80px; height: 80px; border-radius: var(--radius-xl); background: var(--gradient-primary); display: flex; align-items: center; justify-content: center; color: white; }
          .saved-empty h2 { font-size: 1.8rem; }
          .saved-empty p { color: var(--text-secondary); max-width: 400px; }
        `}</style>
            </div>
        );
    }

    if (selectedTrip) {
        return (
            <div className="page-wrapper">
                <div className="container" style={{ paddingTop: 48, paddingBottom: 80 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
                        <button className="btn btn-secondary" onClick={() => setSelectedTrip(null)}>← Back to Saved Trips</button>
                        <button className="btn btn-ghost" style={{ color: "var(--accent-red)" }} onClick={() => { deleteTrip(selectedTrip.id); setSelectedTrip(null); }}>
                            <Trash2 size={15} /> Delete Trip
                        </button>
                    </div>

                    {selectedTrip.image && <img src={selectedTrip.image} alt={selectedTrip.destination} style={{ width: "100%", height: 280, objectFit: "cover", borderRadius: "var(--radius-lg)", marginBottom: 32 }} />}

                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
                        <span className="badge badge-accent"><Sparkles size={12} /> AI Generated</span>
                        <span className="badge badge-blue"><Calendar size={12} /> {selectedTrip.days} Days</span>
                        <span className="badge badge-green"><MapPin size={12} /> {selectedTrip.destination}</span>
                    </div>

                    <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem, 3vw, 2.2rem)", marginBottom: 16 }}>
                        {selectedTrip.days}-Day Trip to <span className="gradient-text">{selectedTrip.destination}</span>
                    </h1>
                    <p style={{ color: "var(--text-secondary)", marginBottom: 36, lineHeight: 1.7 }}>{selectedTrip.overview}</p>

                    {selectedTrip.itinerary?.map((day, i) => (
                        <div key={i} className="glass-card" style={{ marginBottom: 16, overflow: "hidden" }}>
                            <button
                                className="itin-day-header"
                                onClick={() => setExpandedDay(expandedDay === i ? -1 : i)}
                                style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", background: "none", border: "none", cursor: "pointer", color: "var(--text-primary)" }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                    <span className="orb" style={{ width: 36, height: 36, fontSize: "0.85rem" }}>D{day.day}</span>
                                    <div style={{ textAlign: "left" }}>
                                        <p style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>{day.theme}</p>
                                        <p style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>{day.activities?.length} activities</p>
                                    </div>
                                </div>
                                <span style={{ color: "var(--text-muted)" }}>{expandedDay === i ? "▲" : "▼"}</span>
                            </button>
                            {expandedDay === i && (
                                <div style={{ padding: "0 24px 24px" }}>
                                    {day.activities?.map((act, j) => (
                                        <div key={j} style={{ display: "flex", gap: 16, padding: "12px 0", borderBottom: "1px solid var(--border-subtle)" }}>
                                            <span style={{ color: "var(--text-muted)", fontSize: "0.78rem", minWidth: 70, textAlign: "right", paddingTop: 4 }}>{act.time}</span>
                                            <div>
                                                <p style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: 4 }}>{act.activity}</p>
                                                <p style={{ color: "var(--text-secondary)", fontSize: "0.82rem", lineHeight: 1.5 }}>{act.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {day.meals && (
                                        <div style={{ marginTop: 16, padding: 16, background: "rgba(255,255,255,0.03)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
                                            <p style={{ fontWeight: 700, color: "var(--accent-gold)", marginBottom: 8, fontSize: "0.85rem" }}>🍽️ Meals</p>
                                            {Object.entries(day.meals).map(([meal, suggestion]) => (
                                                <p key={meal} style={{ fontSize: "0.82rem", marginBottom: 4 }}><strong style={{ textTransform: "capitalize", color: "var(--text-secondary)" }}>{meal}:</strong> {suggestion}</p>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}

                    {selectedTrip.tips?.length > 0 && (
                        <div className="glass-card" style={{ padding: 24, marginTop: 24 }}>
                            <h3 style={{ fontFamily: "var(--font-display)", marginBottom: 16 }}>✨ Travel Tips</h3>
                            {selectedTrip.tips.map((tip, i) => (
                                <p key={i} style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: 8, paddingLeft: 16, borderLeft: "2px solid var(--accent-primary)" }}>
                                    {tip}
                                </p>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="page-wrapper">
            <div className="container" style={{ paddingTop: 48, paddingBottom: 80 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40, flexWrap: "wrap", gap: 16 }}>
                    <div>
                        <p className="section-label">Your Collection</p>
                        <h1 className="section-title">Saved <span className="gradient-text">Trips</span></h1>
                        <p style={{ color: "var(--text-secondary)", marginTop: 8 }}>{trips.length} saved itinerar{trips.length !== 1 ? "ies" : "y"}</p>
                    </div>
                    <Link to="/planner" className="btn btn-primary"><Sparkles size={15} /> Plan New Trip</Link>
                </div>

                <div className="saved-grid">
                    {trips.map((trip) => (
                        <div key={trip.id} className="saved-card glass-card">
                            {trip.image && <img src={trip.image} alt={trip.destination} className="saved-card__img" />}
                            <div className="saved-card__body">
                                <div className="saved-card__header">
                                    <div>
                                        <h3 className="saved-card__title">{trip.destination}, {trip.country}</h3>
                                        <p className="saved-card__date"><Clock size={12} /> Saved {formatDate(trip.savedAt)}</p>
                                    </div>
                                    <button className="saved-card__delete" onClick={() => deleteTrip(trip.id)} title="Delete">
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                                <p className="saved-card__overview">{trip.overview}</p>
                                <div className="saved-card__meta">
                                    <span className="badge badge-blue"><Calendar size={11} /> {trip.days} Days</span>
                                    <span className="badge badge-accent">{trip.travelStyle}</span>
                                </div>
                                <button className="btn btn-primary saved-card__view" onClick={() => { setSelectedTrip(trip); setExpandedDay(0); }}>
                                    <Eye size={15} /> View Itinerary
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
        .saved-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        @media (max-width: 1024px) { .saved-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px) { .saved-grid { grid-template-columns: 1fr; } }
        .saved-card { overflow: hidden; display: flex; flex-direction: column; }
        .saved-card__img { width: 100%; height: 180px; object-fit: cover; }
        .saved-card__body { padding: 20px; display: flex; flex-direction: column; gap: 12px; flex: 1; }
        .saved-card__header { display: flex; justify-content: space-between; align-items: flex-start; }
        .saved-card__title { font-family: var(--font-display); font-size: 1.1rem; font-weight: 700; }
        .saved-card__date { display: flex; align-items: center; gap: 4px; color: var(--text-muted); font-size: 0.78rem; margin-top: 4px; }
        .saved-card__delete { background: none; border: none; color: var(--text-muted); cursor: pointer; padding: 6px; border-radius: var(--radius-sm); transition: var(--transition); }
        .saved-card__delete:hover { color: #ef4444; background: rgba(239,68,68,0.1); }
        .saved-card__overview { color: var(--text-secondary); font-size: 0.82rem; line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .saved-card__meta { display: flex; gap: 8px; flex-wrap: wrap; }
        .saved-card__view { width: 100%; justify-content: center; margin-top: auto; }
      `}</style>
        </div>
    );
}
