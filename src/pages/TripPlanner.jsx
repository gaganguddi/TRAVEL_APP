import { useState } from "react";
import { Sparkles, MapPin, Calendar, User, Heart, Loader2, Save, Download, ChevronDown, ChevronUp, Sun, Coffee, Utensils, Moon } from "lucide-react";
import { destinations } from "../data/destinations";
import { generateItinerary } from "../services/gemini";

const travelStyles = ["Adventurous", "Relaxing", "Cultural", "Luxury", "Budget", "Family-Friendly", "Romantic", "Solo"];
const interestOptions = ["History & Culture", "Food & Cuisine", "Outdoor Activities", "Art & Museums", "Nightlife", "Shopping", "Nature & Wildlife", "Photography", "Spiritual & Wellness"];

export default function TripPlanner() {
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({ destination: "", days: 5, travelStyle: "Cultural", interests: [] });
    const [itinerary, setItinerary] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [expandedDay, setExpandedDay] = useState(0);
    const [saved, setSaved] = useState(false);

    const selectedDest = destinations.find((d) => d.name === form.destination);

    const toggleInterest = (interest) => {
        setForm((prev) => ({
            ...prev,
            interests: prev.interests.includes(interest)
                ? prev.interests.filter((i) => i !== interest)
                : [...prev.interests, interest],
        }));
    };

    const generate = async () => {
        if (!form.destination) return;
        setLoading(true);
        setError(null);
        try {
            const data = await generateItinerary({
                destination: form.destination,
                country: selectedDest?.country || "",
                days: form.days,
                travelStyle: form.travelStyle,
                interests: form.interests.length ? form.interests : ["General Sightseeing"],
            });
            setItinerary(data);
            setStep(2);
        } catch (err) {
            setError("Failed to generate itinerary. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const saveTrip = () => {
        const saved = JSON.parse(localStorage.getItem("wanderai_trips") || "[]");
        const trip = { ...itinerary, id: Date.now(), savedAt: new Date().toISOString(), image: selectedDest?.image };
        localStorage.setItem("wanderai_trips", JSON.stringify([trip, ...saved]));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const activityIcon = (type) => {
        const map = { food: Coffee, attraction: Sun, culture: Heart, relaxation: Heart, adventure: MapPin, shopping: MapPin };
        const Icon = map[type] || Sun;
        return <Icon size={14} />;
    };

    const typeColor = (type) => {
        const map = { attraction: "#6366f1", food: "#f59e0b", adventure: "#ef4444", culture: "#a78bfa", relaxation: "#10b981", shopping: "#38bdf8" };
        return map[type] || "#6366f1";
    };

    if (step === 2 && itinerary) {
        return (
            <div className="page-wrapper">
                <div className="container" style={{ paddingTop: 48, paddingBottom: 80 }}>

                    {/* Itinerary Header */}
                    <div className="itin-header">
                        {selectedDest && <img src={selectedDest.image} alt={itinerary.destination} className="itin-hero-img" />}
                        <div className="itin-header-content">
                            <span className="badge badge-accent"><Sparkles size={12} /> AI Generated</span>
                            <h1 className="itin-title">{itinerary.days}-Day {itinerary.travelStyle} Trip to <span className="gradient-text">{itinerary.destination}</span></h1>
                            <p className="itin-overview">{itinerary.overview}</p>
                            <div className="itin-meta">
                                <span className="badge badge-blue"><Calendar size={12} /> {itinerary.days} Days</span>
                                <span className="badge badge-gold"><Heart size={12} /> {itinerary.travelStyle}</span>
                                <span className="badge badge-green"><MapPin size={12} /> {itinerary.destination}, {itinerary.country}</span>
                            </div>
                            <div className="itin-actions">
                                <button className="btn btn-primary" onClick={saveTrip}>
                                    {saved ? "✓ Saved!" : <><Save size={15} /> Save Trip</>}
                                </button>
                                <button className="btn btn-secondary" onClick={() => { setStep(1); setItinerary(null); }}>
                                    ← Plan Another
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="itin-body">
                        {/* Day-by-day */}
                        <div className="itin-days">
                            <h2 style={{ marginBottom: 24, fontFamily: "var(--font-display)" }}>Your Itinerary</h2>
                            {itinerary.itinerary?.map((day, i) => (
                                <div key={i} className="itin-day glass-card" style={{ marginBottom: 16 }}>
                                    <button className="itin-day-header" onClick={() => setExpandedDay(expandedDay === i ? -1 : i)}>
                                        <div className="itin-day-left">
                                            <span className="orb" style={{ width: 36, height: 36, fontSize: "0.85rem" }}>D{day.day}</span>
                                            <div>
                                                <p className="itin-day-title">{day.theme}</p>
                                                <p className="itin-day-count">{day.activities?.length} activities</p>
                                            </div>
                                        </div>
                                        {expandedDay === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                    </button>

                                    {expandedDay === i && (
                                        <div className="itin-day-body">
                                            {day.activities?.map((act, j) => (
                                                <div key={j} className="activity">
                                                    <div className="activity__time">{act.time}</div>
                                                    <div className="activity__dot" style={{ background: typeColor(act.type) }} />
                                                    <div className="activity__content">
                                                        <div className="activity__header">
                                                            <span className="activity__type" style={{ color: typeColor(act.type) }}>
                                                                {activityIcon(act.type)} {act.type}
                                                            </span>
                                                            <span className="activity__dur">{act.duration}</span>
                                                        </div>
                                                        <p className="activity__name">{act.activity}</p>
                                                        <p className="activity__desc">{act.description}</p>
                                                    </div>
                                                </div>
                                            ))}

                                            {/* Meals */}
                                            {day.meals && (
                                                <div className="day-meals">
                                                    <p className="day-meals__title"><Utensils size={14} /> Daily Meals</p>
                                                    <div className="day-meals__grid">
                                                        {Object.entries(day.meals).map(([meal, suggestion]) => (
                                                            <div key={meal} className="day-meal">
                                                                <span className="day-meal__label">{meal}</span>
                                                                <span className="day-meal__val">{suggestion}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {day.accommodation && (
                                                <p className="day-accommodation"><Moon size={13} /> <strong>Stay:</strong> {day.accommodation}</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Tips Sidebar */}
                        {itinerary.tips?.length > 0 && (
                            <div className="itin-sidebar">
                                <div className="glass-card" style={{ padding: 24 }}>
                                    <h3 style={{ marginBottom: 16, fontFamily: "var(--font-display)" }}>✨ AI Tips</h3>
                                    <ul className="itin-tips">
                                        {itinerary.tips.map((tip, i) => (
                                            <li key={i} className="itin-tip">
                                                <span className="itin-tip__num">{i + 1}</span>
                                                <span>{tip}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <style>{`
          .itin-header {
            display: grid; grid-template-columns: 340px 1fr; gap: 40px;
            margin-bottom: 48px; align-items: center;
          }
          .itin-hero-img {
            width: 100%; height: 260px; object-fit: cover;
            border-radius: var(--radius-lg);
          }
          .itin-header-content { display: flex; flex-direction: column; gap: 16px; }
          .itin-title { font-size: clamp(1.6rem, 3vw, 2.5rem); line-height: 1.2; }
          .itin-overview { color: var(--text-secondary); line-height: 1.7; font-size: 0.95rem; }
          .itin-meta { display: flex; gap: 8px; flex-wrap: wrap; }
          .itin-actions { display: flex; gap: 12px; flex-wrap: wrap; }
          .itin-body { display: grid; grid-template-columns: 1fr 300px; gap: 32px; align-items: flex-start; }
          .itin-days {}
          .itin-day { overflow: hidden; }
          .itin-day-header {
            width: 100%; display: flex; justify-content: space-between; align-items: center;
            padding: 20px 24px; background: none; border: none; cursor: pointer;
            color: var(--text-primary); transition: var(--transition);
          }
          .itin-day-header:hover { background: rgba(255,255,255,0.03); }
          .itin-day-left { display: flex; align-items: center; gap: 16px; }
          .itin-day-title { font-family: var(--font-display); font-weight: 700; font-size: 1rem; text-align: left; }
          .itin-day-count { color: var(--text-muted); font-size: 0.78rem; text-align: left; }
          .itin-day-body { padding: 0 24px 24px; display: flex; flex-direction: column; gap: 0; }
          .activity { display: grid; grid-template-columns: 80px 12px 1fr; gap: 16px; align-items: flex-start; padding: 12px 0; position: relative; }
          .activity__time { color: var(--text-muted); font-size: 0.78rem; font-weight: 600; text-align: right; padding-top: 4px; }
          .activity__dot { width: 10px; height: 10px; border-radius: 50%; margin-top: 6px; flex-shrink: 0; box-shadow: 0 0 8px currentColor; }
          .activity__content {}
          .activity__header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
          .activity__type { display: flex; align-items: center; gap: 4px; font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
          .activity__dur { color: var(--text-muted); font-size: 0.72rem; }
          .activity__name { font-weight: 700; font-size: 0.95rem; color: var(--text-primary); margin-bottom: 4px; }
          .activity__desc { color: var(--text-secondary); font-size: 0.83rem; line-height: 1.5; }
          .day-meals { margin-top: 16px; padding: 16px; background: rgba(255,255,255,0.03); border-radius: var(--radius-md); border: 1px solid var(--border-subtle); }
          .day-meals__title { display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 0.85rem; color: var(--accent-gold); margin-bottom: 12px; }
          .day-meals__grid { display: flex; flex-direction: column; gap: 8px; }
          .day-meal { display: flex; gap: 12px; font-size: 0.83rem; }
          .day-meal__label { min-width: 70px; font-weight: 700; color: var(--text-secondary); text-transform: capitalize; }
          .day-meal__val { color: var(--text-primary); }
          .day-accommodation { margin-top: 12px; color: var(--text-secondary); font-size: 0.83rem; display: flex; align-items: center; gap: 8px; }
          .itin-sidebar { position: sticky; top: 90px; }
          .itin-tips { list-style: none; display: flex; flex-direction: column; gap: 12px; }
          .itin-tip { display: flex; gap: 12px; font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6; align-items: flex-start; }
          .itin-tip__num {
            width: 22px; height: 22px; border-radius: 50%; background: rgba(99,102,241,0.2);
            color: var(--accent-secondary); font-size: 0.75rem; font-weight: 700;
            display: flex; align-items: center; justify-content: center; flex-shrink: 0;
          }
          @media (max-width: 1024px) { .itin-body { grid-template-columns: 1fr; } .itin-sidebar { position: static; } }
          @media (max-width: 768px) { .itin-header { grid-template-columns: 1fr; } .itin-hero-img { height: 200px; } }
        `}</style>
            </div>
        );
    }

    return (
        <div className="page-wrapper">
            <div className="container" style={{ paddingTop: 48, paddingBottom: 80 }}>
                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: 56 }}>
                    <span className="badge badge-accent" style={{ margin: "0 auto 16px" }}><Sparkles size={13} /> AI-Powered</span>
                    <h1 className="section-title">Build Your <span className="gradient-text">Dream Itinerary</span></h1>
                    <p className="section-subtitle" style={{ margin: "0 auto" }}>
                        Tell Gemini your preferences and get a personalized day-by-day travel plan in seconds.
                    </p>
                </div>

                <div className="planner-layout">
                    <div className="planner-form glass-card">
                        {/* Destination */}
                        <div className="form-group">
                            <label className="form-label"><MapPin size={15} /> Choose Destination</label>
                            <select
                                className="input"
                                value={form.destination}
                                onChange={(e) => setForm({ ...form, destination: e.target.value })}
                            >
                                <option value="">Select a destination...</option>
                                {destinations.map((d) => (
                                    <option key={d.id} value={d.name}>{d.name}, {d.country}</option>
                                ))}
                            </select>
                        </div>

                        {/* Days */}
                        <div className="form-group">
                            <label className="form-label"><Calendar size={15} /> Trip Duration: <span className="gradient-text">{form.days} days</span></label>
                            <input
                                type="range" min={2} max={14}
                                value={form.days}
                                onChange={(e) => setForm({ ...form, days: parseInt(e.target.value) })}
                                className="range-slider"
                            />
                            <div className="range-labels"><span>2 days</span><span>14 days</span></div>
                        </div>

                        {/* Travel Style */}
                        <div className="form-group">
                            <label className="form-label"><User size={15} /> Travel Style</label>
                            <div className="style-grid">
                                {travelStyles.map((s) => (
                                    <button
                                        key={s}
                                        className={`style-btn ${form.travelStyle === s ? "style-btn--active" : ""}`}
                                        onClick={() => setForm({ ...form, travelStyle: s })}
                                    >{s}</button>
                                ))}
                            </div>
                        </div>

                        {/* Interests */}
                        <div className="form-group">
                            <label className="form-label"><Heart size={15} /> Interests <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>(optional)</span></label>
                            <div className="style-grid">
                                {interestOptions.map((i) => (
                                    <button
                                        key={i}
                                        className={`style-btn ${form.interests.includes(i) ? "style-btn--active" : ""}`}
                                        onClick={() => toggleInterest(i)}
                                    >{i}</button>
                                ))}
                            </div>
                        </div>

                        {error && <p className="planner-error">⚠️ {error}</p>}

                        <button
                            className="btn btn-primary planner-generate"
                            onClick={generate}
                            disabled={!form.destination || loading}
                        >
                            {loading ? (
                                <><Loader2 size={18} className="spin-icon" /> Generating your itinerary...</>
                            ) : (
                                <><Sparkles size={18} /> Generate with AI</>
                            )}
                        </button>

                        {loading && (
                            <p className="planner-loading-note">
                                ✨ Gemini AI is crafting your personalized {form.days}-day itinerary for {form.destination}...
                            </p>
                        )}
                    </div>

                    {/* Preview */}
                    <div className="planner-preview">
                        {selectedDest ? (
                            <div className="dest-preview glass-card">
                                <img src={selectedDest.image} alt={selectedDest.name} className="dest-preview__img" />
                                <div className="dest-preview__body">
                                    <h3 className="dest-preview__name">{selectedDest.name}</h3>
                                    <p className="dest-preview__country"><MapPin size={13} /> {selectedDest.country}</p>
                                    <p className="dest-preview__desc">{selectedDest.description}</p>
                                    <div className="dest-preview__meta">
                                        <span className="badge badge-gold">⭐ {selectedDest.rating}</span>
                                        <span className="badge badge-blue">🗓 {selectedDest.bestTime}</span>
                                        <span className="badge badge-green">💰 {selectedDest.currency}</span>
                                    </div>
                                    <div className="dest-preview__highlights">
                                        <p className="dest-preview__hl-title">Top Highlights</p>
                                        {selectedDest.highlights.map((h) => (
                                            <span key={h} className="dest-preview__hl">📍 {h}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="planner-placeholder glass-card">
                                <div className="planner-placeholder__icon"><Sparkles size={32} /></div>
                                <h3>Select a Destination</h3>
                                <p>Choose a destination to see a preview and then generate your AI itinerary.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
        .planner-layout { display: grid; grid-template-columns: 1fr 380px; gap: 32px; align-items: flex-start; }
        .planner-form { padding: 36px; display: flex; flex-direction: column; gap: 32px; }
        .form-group { display: flex; flex-direction: column; gap: 12px; }
        .form-label { font-family: var(--font-display); font-size: 0.9rem; font-weight: 700; color: var(--text-primary); display: flex; align-items: center; gap: 8px; }
        .range-slider { -webkit-appearance: none; height: 4px; border-radius: 2px; background: var(--border-normal); outline: none; width: 100%; cursor: pointer; }
        .range-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; border-radius: 50%; background: var(--gradient-primary); cursor: pointer; box-shadow: 0 0 8px rgba(99,102,241,0.5); }
        .range-labels { display: flex; justify-content: space-between; color: var(--text-muted); font-size: 0.78rem; }
        .style-grid { display: flex; flex-wrap: wrap; gap: 8px; }
        .style-btn { padding: 8px 16px; border-radius: var(--radius-full); background: var(--bg-card); border: 1px solid var(--border-subtle); color: var(--text-secondary); font-size: 0.82rem; cursor: pointer; transition: var(--transition); font-family: var(--font-body); }
        .style-btn:hover { border-color: var(--border-accent); color: var(--accent-secondary); }
        .style-btn--active { background: rgba(99,102,241,0.15); border-color: var(--border-accent); color: var(--accent-secondary); font-weight: 600; }
        .planner-error { color: #ef4444; font-size: 0.85rem; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); padding: 12px 16px; border-radius: var(--radius-md); }
        .planner-generate { width: 100%; justify-content: center; padding: 16px; font-size: 1rem; }
        .spin-icon { animation: spin 1s linear infinite; }
        .planner-loading-note { text-align: center; color: var(--text-secondary); font-size: 0.82rem; animation: fadeIn 0.5s ease; }

        .planner-preview { position: sticky; top: 90px; }
        .dest-preview { overflow: hidden; }
        .dest-preview__img { width: 100%; height: 200px; object-fit: cover; }
        .dest-preview__body { padding: 20px; display: flex; flex-direction: column; gap: 12px; }
        .dest-preview__name { font-family: var(--font-display); font-size: 1.3rem; font-weight: 800; }
        .dest-preview__country { display: flex; align-items: center; gap: 4px; color: var(--text-muted); font-size: 0.82rem; }
        .dest-preview__desc { color: var(--text-secondary); font-size: 0.85rem; line-height: 1.6; }
        .dest-preview__meta { display: flex; flex-wrap: wrap; gap: 8px; }
        .dest-preview__highlights { display: flex; flex-direction: column; gap: 6px; margin-top: 4px; }
        .dest-preview__hl-title { font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
        .dest-preview__hl { font-size: 0.82rem; color: var(--text-secondary); }

        .planner-placeholder { padding: 48px 24px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 12px; }
        .planner-placeholder__icon { width: 64px; height: 64px; border-radius: var(--radius-lg); background: var(--gradient-primary); display: flex; align-items: center; justify-content: center; color: white; }
        .planner-placeholder h3 { font-family: var(--font-display); }
        .planner-placeholder p { color: var(--text-secondary); font-size: 0.85rem; line-height: 1.6; }

        @media (max-width: 1024px) { .planner-layout { grid-template-columns: 1fr; } .planner-preview { position: static; } }
      `}</style>
        </div>
    );
}
