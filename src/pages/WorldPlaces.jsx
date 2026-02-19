import { useState, useCallback } from "react";
import { Globe2, Landmark, Camera, TreePine, Sparkles, Search, Loader2, MapPin, Users, Clock, Star, ChevronRight, X, Calendar, DollarSign, Lightbulb, Info } from "lucide-react";
import { fetchWorldPlaces, getWorldPlaceDetails } from "../services/gemini";

const CATEGORIES = [
    { id: "Historical Sites", label: "Historical Sites", icon: Landmark, color: "#f59e0b", desc: "Ancient ruins, monuments & heritage" },
    { id: "Tourist Attractions", label: "Tourist Spots", icon: Camera, color: "#6366f1", desc: "World-famous must-see places" },
    { id: "Natural Wonders", label: "Natural Wonders", icon: TreePine, color: "#10b981", desc: "Breathtaking landscapes & nature" },
    { id: "UNESCO World Heritage Sites", label: "UNESCO Sites", icon: Globe2, color: "#38bdf8", desc: "Globally recognized heritage sites" },
];

const REGIONS = ["All", "Europe", "Asia", "North America", "South America", "Africa", "Oceania", "Middle East"];

// Unsplash search images based on place query
function getPlaceImage(query) {
    const encoded = encodeURIComponent(query);
    return `https://source.unsplash.com/600x400/?${encoded},landmark`;
}

// Pre-loaded famous places for instant display
const FEATURED_PLACES = [
    { name: "Great Wall of China", location: "Beijing, China", continent: "Asia", tagline: "The legendary 13,000-mile fortification built to protect ancient China", period: "7th century BC", rating: 4.9, visitors: "10 million+", tags: ["historical", "ancient"], category: "Historical Sites" },
    { name: "Colosseum", location: "Rome, Italy", continent: "Europe", tagline: "The iconic amphitheater of ancient Rome, center of gladiatorial combat", period: "70–80 AD", rating: 4.8, visitors: "7 million+", tags: ["historical", "roman"], category: "Historical Sites" },
    { name: "Taj Mahal", location: "Agra, India", continent: "Asia", tagline: "A breathtaking white marble mausoleum — the ultimate symbol of eternal love", period: "1632–1653 AD", rating: 4.9, visitors: "6 million+", tags: ["historical", "romantic"], category: "Historical Sites" },
    { name: "Machu Picchu", location: "Cusco, Peru", continent: "South America", tagline: "The mystical 15th-century Inca citadel set high in the Andes Mountains", period: "15th century", rating: 4.9, visitors: "1.5 million+", tags: ["historical", "ancient"], category: "Historical Sites" },
    { name: "Eiffel Tower", location: "Paris, France", continent: "Europe", tagline: "Paris's iron-lattice icon, towering over the city since 1889", period: "1889", rating: 4.7, visitors: "7 million+", tags: ["iconic", "modern"], category: "Tourist Attractions" },
    { name: "Great Barrier Reef", location: "Queensland, Australia", continent: "Oceania", tagline: "Earth's largest coral reef system, teeming with extraordinary marine life", period: "Modern", rating: 4.9, visitors: "2 million+", tags: ["nature", "diving"], category: "Natural Wonders" },
    { name: "Angkor Wat", location: "Siem Reap, Cambodia", continent: "Asia", tagline: "The world's largest religious monument, a crown jewel of Khmer architecture", period: "12th century", rating: 4.9, visitors: "2.6 million+", tags: ["historical", "temple"], category: "UNESCO World Heritage Sites" },
    { name: "Grand Canyon", location: "Arizona, USA", continent: "North America", tagline: "A mile-deep gorge carved by the Colorado River over 5–6 million years", period: "Natural", rating: 4.9, visitors: "6 million+", tags: ["nature", "scenic"], category: "Natural Wonders" },
    { name: "Petra", location: "Ma'an, Jordan", continent: "Asia", tagline: "The rose-red rock city of the Nabataeans, carved from sheer desert cliffs", period: "4th century BC", rating: 4.8, visitors: "1 million+", tags: ["historical", "ancient"], category: "Historical Sites" },
    { name: "Northern Lights", location: "Tromsø, Norway", continent: "Europe", tagline: "Nature's most dazzling light show, dancing across the Arctic sky", period: "Natural phenomenon", rating: 5.0, visitors: "500K+", tags: ["nature", "magical"], category: "Natural Wonders" },
    { name: "Acropolis of Athens", location: "Athens, Greece", continent: "Europe", tagline: "The birthplace of democracy, crowned by the legendary Parthenon temple", period: "5th century BC", rating: 4.8, visitors: "3 million+", tags: ["historical", "greek"], category: "Historical Sites" },
    { name: "Chichen Itza", location: "Yucatán, Mexico", continent: "North America", tagline: "The grand Mayan city crowned by the pyramid of El Castillo", period: "7th–13th century", rating: 4.8, visitors: "4 million+", tags: ["historical", "mayan"], category: "UNESCO World Heritage Sites" },
];

export default function WorldPlaces() {
    const [activeCategory, setActiveCategory] = useState("Historical Sites");
    const [activeRegion, setActiveRegion] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [places, setPlaces] = useState(FEATURED_PLACES);
    const [loading, setLoading] = useState(false);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [placeDetails, setPlaceDetails] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [aiLoaded, setAiLoaded] = useState(false);

    const loadAIPlaces = useCallback(async () => {
        setLoading(true);
        setAiLoaded(false);
        try {
            const data = await fetchWorldPlaces(activeCategory, activeRegion);
            if (Array.isArray(data) && data.length > 0) {
                setPlaces(data.map(p => ({ ...p, category: activeCategory })));
                setAiLoaded(true);
            }
        } catch (err) {
            console.error("Failed to load AI places:", err);
        } finally {
            setLoading(false);
        }
    }, [activeCategory, activeRegion]);

    const openPlaceDetail = async (place) => {
        setSelectedPlace(place);
        setPlaceDetails(null);
        setDetailLoading(true);
        try {
            const details = await getWorldPlaceDetails(place.name, place.category || activeCategory);
            setPlaceDetails(details);
        } catch (err) {
            console.error("Failed to load place details:", err);
        } finally {
            setDetailLoading(false);
        }
    };

    const filteredPlaces = places.filter(p => {
        const q = searchQuery.toLowerCase();
        const matchQ = !q || p.name?.toLowerCase().includes(q) || p.location?.toLowerCase().includes(q);
        return matchQ;
    });

    const catColor = CATEGORIES.find(c => c.id === activeCategory)?.color || "#6366f1";

    return (
        <div className="page-wrapper">
            <div className="container" style={{ paddingTop: 48, paddingBottom: 80 }}>

                {/* Hero Header */}
                <div className="wp-hero">
                    <div className="wp-hero__left">
                        <span className="badge badge-accent"><Globe2 size={13} /> World Explorer</span>
                        <h1 className="wp-hero__title">
                            Discover the World's<br />
                            <span className="gradient-text">Greatest Places</span>
                        </h1>
                        <p className="wp-hero__sub">
                            Explore historical wonders, iconic tourist attractions, and breathtaking natural sites.
                            Get detailed AI-powered information about every place on Earth.
                        </p>
                    </div>
                    <div className="wp-hero__stats">
                        {[
                            { value: "195", label: "Countries" },
                            { value: "1,000+", label: "Places" },
                            { value: "AI", label: "Powered Info" },
                        ].map((s) => (
                            <div key={s.label} className="wp-stat">
                                <span className="wp-stat__val gradient-text">{s.value}</span>
                                <span className="wp-stat__label">{s.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Category Tabs */}
                <div className="wp-categories">
                    {CATEGORIES.map(({ id, label, icon: Icon, color, desc }) => (
                        <button
                            key={id}
                            className={`wp-cat ${activeCategory === id ? "wp-cat--active" : ""}`}
                            onClick={() => { setActiveCategory(id); setAiLoaded(false); }}
                            style={{ "--cat-color": color }}
                        >
                            <Icon size={20} style={{ color: activeCategory === id ? color : "var(--text-muted)" }} />
                            <div>
                                <p className="wp-cat__label">{label}</p>
                                <p className="wp-cat__desc">{desc}</p>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Filters & Search Row */}
                <div className="wp-filters">
                    <div className="wp-search">
                        <Search size={15} style={{ color: "var(--text-muted)", position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                        <input
                            type="text"
                            placeholder="Search places, cities, countries..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="wp-search__input"
                        />
                    </div>
                    <div className="wp-regions scroll-row" style={{ flex: 1, minWidth: 0 }}>
                        {REGIONS.map(r => (
                            <button
                                key={r}
                                className={`tag-pill ${activeRegion === r ? "active" : ""}`}
                                style={{ flexShrink: 0 }}
                                onClick={() => { setActiveRegion(r); setAiLoaded(false); }}
                            >{r}</button>
                        ))}
                    </div>
                    <button
                        className={`btn btn-primary wp-ai-btn`}
                        onClick={loadAIPlaces}
                        disabled={loading}
                        title="Let AI fetch fresh places for this category & region"
                    >
                        {loading ? (
                            <><Loader2 size={15} className="spin-icon" /> Loading...</>
                        ) : (
                            <><Sparkles size={15} /> Fetch with AI</>
                        )}
                    </button>
                </div>

                {aiLoaded && (
                    <div className="wp-ai-badge">
                        <Sparkles size={13} /> AI-fetched: {filteredPlaces.length} {activeCategory} {activeRegion !== "All" ? `in ${activeRegion}` : "worldwide"}
                    </div>
                )}

                {/* Places Grid */}
                {loading ? (
                    <div className="wp-loading">
                        <Loader2 size={32} className="spin-icon" style={{ color: "var(--accent-primary)" }} />
                        <p>AI is fetching the best {activeCategory.toLowerCase()} for you...</p>
                    </div>
                ) : (
                    <div className="wp-grid">
                        {filteredPlaces.map((place, i) => (
                            <button key={i} className="wp-card" onClick={() => openPlaceDetail(place)}>
                                <div className="wp-card__img-wrap">
                                    <img
                                        src={`https://source.unsplash.com/600x400/?${encodeURIComponent(place.name + ' landmark')}`}
                                        alt={place.name}
                                        className="wp-card__img"
                                        onError={(e) => { e.target.src = `https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=600&q=80`; }}
                                    />
                                    <div className="wp-card__overlay" />
                                    <div className="wp-card__period">{place.period || "Historical"}</div>
                                    <div className="wp-card__rating"><Star size={12} fill="currentColor" /> {place.rating}</div>
                                </div>
                                <div className="wp-card__body">
                                    <h3 className="wp-card__name">{place.name}</h3>
                                    <p className="wp-card__loc"><MapPin size={12} /> {place.location}</p>
                                    <p className="wp-card__tagline">{place.tagline}</p>
                                    <div className="wp-card__footer">
                                        <span className="wp-card__visitors"><Users size={11} /> {place.visitors || "Millions"}</span>
                                        <span className="wp-card__more">Details <ChevronRight size={13} /></span>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {filteredPlaces.length === 0 && !loading && (
                    <div className="wp-empty">
                        <Globe2 size={48} style={{ color: "var(--text-muted)" }} />
                        <h3>No places found</h3>
                        <p>Try a different search or click "Fetch with AI" to load places.</p>
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {selectedPlace && (
                <div className="overlay" onClick={() => setSelectedPlace(null)}>
                    <div className="wp-modal" onClick={(e) => e.stopPropagation()}>
                        {/* Modal Header Image */}
                        <div className="wp-modal__hero">
                            <img
                                src={`https://source.unsplash.com/800x400/?${encodeURIComponent(selectedPlace.name + ' landmark')}`}
                                alt={selectedPlace.name}
                                className="wp-modal__hero-img"
                                onError={(e) => { e.target.src = `https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&q=80`; }}
                            />
                            <div className="wp-modal__hero-overlay" />
                            <button className="wp-modal__close" onClick={() => setSelectedPlace(null)}><X size={18} /></button>
                            <div className="wp-modal__hero-info">
                                <span className="badge badge-accent">{selectedPlace.category || activeCategory}</span>
                                <h2 className="wp-modal__name">{selectedPlace.name}</h2>
                                <p className="wp-modal__loc"><MapPin size={14} /> {selectedPlace.location || placeDetails?.location}</p>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="wp-modal__body">
                            {detailLoading ? (
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "40px", gap: 16 }}>
                                    <Loader2 size={28} className="spin-icon" style={{ color: "var(--accent-primary)" }} />
                                    <p style={{ color: "var(--text-secondary)" }}>AI is fetching detailed information...</p>
                                </div>
                            ) : placeDetails ? (
                                <>
                                    <p className="wp-modal__desc">{placeDetails.description}</p>

                                    {/* Quick Facts */}
                                    <div className="wp-modal__facts">
                                        {[
                                            { icon: Clock, label: "Best Time", val: placeDetails.bestTime },
                                            { icon: DollarSign, label: "Entry Fee", val: placeDetails.entryFee },
                                            { icon: Calendar, label: "Visit Duration", val: placeDetails.duration },
                                            { icon: Globe2, label: "Continent", val: placeDetails.continent },
                                        ].map(({ icon: Icon, label, val }) => val && (
                                            <div key={label} className="wp-modal__fact">
                                                <Icon size={15} style={{ color: catColor }} />
                                                <div>
                                                    <small>{label}</small>
                                                    <p>{val}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* History */}
                                    {placeDetails.history && (
                                        <div className="wp-modal__section">
                                            <h4><Info size={15} /> History</h4>
                                            <p>{placeDetails.history}</p>
                                        </div>
                                    )}

                                    {/* Highlights */}
                                    {placeDetails.highlights?.length > 0 && (
                                        <div className="wp-modal__section">
                                            <h4><Star size={15} /> Highlights</h4>
                                            <div className="wp-modal__tags">
                                                {placeDetails.highlights.map((h, i) => (
                                                    <span key={i} className="badge badge-accent">{h}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Tips */}
                                    {placeDetails.tips?.length > 0 && (
                                        <div className="wp-modal__section">
                                            <h4><Lightbulb size={15} /> Visitor Tips</h4>
                                            <ul className="wp-modal__tips">
                                                {placeDetails.tips.map((tip, i) => (
                                                    <li key={i}>{tip}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Fun Fact */}
                                    {placeDetails.funFact && (
                                        <div className="wp-modal__funfact">
                                            <span>💡</span>
                                            <p><strong>Fun Fact:</strong> {placeDetails.funFact}</p>
                                        </div>
                                    )}

                                    {/* Nearby */}
                                    {placeDetails.nearbyAttractions?.length > 0 && (
                                        <div className="wp-modal__section">
                                            <h4><MapPin size={15} /> Nearby Attractions</h4>
                                            <div className="wp-modal__tags">
                                                {placeDetails.nearbyAttractions.map((a, i) => (
                                                    <span key={i} className="badge badge-blue">{a}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <p style={{ color: "var(--text-secondary)", padding: "20px 0" }}>
                                    {selectedPlace.tagline}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <style>{`
        .wp-hero {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 48px; gap: 40px; flex-wrap: wrap;
        }
        .wp-hero__left { display: flex; flex-direction: column; gap: 16px; max-width: 600px; }
        .wp-hero__title { font-size: clamp(1.8rem, 4vw, 3rem); line-height: 1.15; }
        .wp-hero__sub { color: var(--text-secondary); font-size: 1rem; line-height: 1.7; }
        .wp-hero__stats { display: flex; gap: 32px; flex-shrink: 0; }
        .wp-stat { display: flex; flex-direction: column; align-items: center; gap: 2px; }
        .wp-stat__val { font-family: var(--font-display); font-size: 2rem; font-weight: 900; }
        .wp-stat__label { color: var(--text-muted); font-size: 0.78rem; text-align: center; }

        .wp-categories {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;
          margin-bottom: 32px;
        }
        .wp-cat {
          display: flex; align-items: center; gap: 12px;
          padding: 16px 20px;
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          cursor: pointer;
          transition: var(--transition);
          text-align: left;
        }
        .wp-cat:hover { border-color: var(--cat-color, var(--border-accent)); background: var(--bg-card-hover); }
        .wp-cat--active {
          background: rgba(99,102,241,0.08);
          border-color: var(--cat-color, var(--border-accent));
          box-shadow: 0 0 20px rgba(99,102,241,0.1);
        }
        .wp-cat__label { font-family: var(--font-display); font-weight: 700; font-size: 0.88rem; color: var(--text-primary); }
        .wp-cat__desc { color: var(--text-muted); font-size: 0.72rem; margin-top: 2px; }

        .wp-filters {
          display: flex; gap: 12px; align-items: center; margin-bottom: 20px; flex-wrap: nowrap;
        }
        .wp-search { position: relative; min-width: 240px; }
        .wp-search__input {
          width: 100%;
          padding: 10px 14px 10px 40px;
          background: var(--bg-card); border: 1px solid var(--border-normal);
          border-radius: var(--radius-md); color: var(--text-primary);
          font-family: var(--font-body); font-size: 0.88rem; outline: none;
          transition: var(--transition);
        }
        .wp-search__input:focus { border-color: var(--accent-primary); box-shadow: 0 0 0 3px rgba(99,102,241,0.15); }
        .wp-search__input::placeholder { color: var(--text-muted); }
        .wp-ai-btn { flex-shrink: 0; white-space: nowrap; }
        .wp-regions { display: flex; gap: 8px; overflow-x: auto; flex: 1; padding: 4px 0; scrollbar-width: none; }
        .wp-regions::-webkit-scrollbar { display: none; }

        .wp-ai-badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 8px 16px; border-radius: var(--radius-full);
          background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.3);
          color: var(--accent-secondary); font-size: 0.78rem; font-weight: 600;
          margin-bottom: 24px;
        }

        .wp-loading {
          display: flex; flex-direction: column; align-items: center; gap: 16px;
          padding: 80px 0; color: var(--text-secondary); font-size: 0.9rem;
        }
        .spin-icon { animation: spin 1s linear infinite; }

        .wp-grid {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px;
        }
        .wp-card {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          overflow: hidden;
          cursor: pointer;
          transition: var(--transition);
          text-align: left;
          display: flex; flex-direction: column;
        }
        .wp-card:hover {
          border-color: var(--border-accent);
          box-shadow: var(--shadow-glow);
          transform: translateY(-5px);
        }
        .wp-card__img-wrap { position: relative; height: 180px; overflow: hidden; }
        .wp-card__img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
        .wp-card:hover .wp-card__img { transform: scale(1.08); }
        .wp-card__overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, transparent 30%, rgba(8,12,20,0.85)); }
        .wp-card__period {
          position: absolute; bottom: 10px; left: 12px;
          font-size: 0.68rem; font-weight: 700; color: rgba(255,255,255,0.8);
          background: rgba(0,0,0,0.5); padding: 3px 8px; border-radius: var(--radius-full);
          backdrop-filter: blur(8px);
        }
        .wp-card__rating {
          position: absolute; top: 10px; right: 10px;
          display: flex; align-items: center; gap: 4px;
          font-size: 0.78rem; font-weight: 800; color: #f59e0b;
          background: rgba(0,0,0,0.5); padding: 3px 8px; border-radius: var(--radius-full);
          backdrop-filter: blur(8px);
        }
        .wp-card__body { padding: 16px; display: flex; flex-direction: column; gap: 8px; flex: 1; }
        .wp-card__name { font-family: var(--font-display); font-size: 1rem; font-weight: 800; color: var(--text-primary); }
        .wp-card__loc { display: flex; align-items: center; gap: 4px; color: var(--text-muted); font-size: 0.75rem; }
        .wp-card__tagline { color: var(--text-secondary); font-size: 0.8rem; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; flex: 1; }
        .wp-card__footer { display: flex; justify-content: space-between; align-items: center; margin-top: 4px; }
        .wp-card__visitors { display: flex; align-items: center; gap: 4px; color: var(--text-muted); font-size: 0.72rem; }
        .wp-card__more { display: flex; align-items: center; gap: 2px; color: var(--accent-secondary); font-size: 0.75rem; font-weight: 700; }

        .wp-empty { text-align: center; padding: 80px 24px; display: flex; flex-direction: column; align-items: center; gap: 12px; color: var(--text-secondary); }
        .wp-empty h3 { font-size: 1.4rem; color: var(--text-primary); }

        /* Modal */
        .wp-modal {
          background: var(--bg-secondary);
          border: 1px solid var(--border-normal);
          border-radius: var(--radius-xl);
          width: 90%; max-width: 720px;
          max-height: 90vh;
          overflow-y: auto;
          animation: fadeInUp 0.3s ease;
          scrollbar-width: thin;
        }
        .wp-modal__hero { position: relative; height: 260px; overflow: hidden; border-radius: var(--radius-xl) var(--radius-xl) 0 0; }
        .wp-modal__hero-img { width: 100%; height: 100%; object-fit: cover; }
        .wp-modal__hero-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(8,12,20,0.95) 0%, rgba(8,12,20,0.2) 60%, transparent 100%); }
        .wp-modal__close {
          position: absolute; top: 16px; right: 16px;
          width: 34px; height: 34px; border-radius: 50%;
          background: rgba(0,0,0,0.5); backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.15);
          color: white; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: var(--transition);
        }
        .wp-modal__close:hover { background: rgba(239,68,68,0.5); }
        .wp-modal__hero-info {
          position: absolute; bottom: 20px; left: 24px;
          display: flex; flex-direction: column; gap: 6px;
        }
        .wp-modal__name { font-family: var(--font-display); font-size: 1.8rem; font-weight: 900; color: white; }
        .wp-modal__loc { display: flex; align-items: center; gap: 6px; color: rgba(255,255,255,0.7); font-size: 0.88rem; }
        .wp-modal__body { padding: 24px; display: flex; flex-direction: column; gap: 20px; }
        .wp-modal__desc { color: var(--text-secondary); line-height: 1.8; font-size: 0.95rem; }
        .wp-modal__facts { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
        .wp-modal__fact { display: flex; align-items: flex-start; gap: 10px; padding: 12px; background: var(--bg-card); border-radius: var(--radius-md); border: 1px solid var(--border-subtle); }
        .wp-modal__fact small { color: var(--text-muted); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; display: block; }
        .wp-modal__fact p { font-weight: 600; font-size: 0.85rem; color: var(--text-primary); margin-top: 2px; }
        .wp-modal__section { display: flex; flex-direction: column; gap: 12px; }
        .wp-modal__section h4 { display: flex; align-items: center; gap: 8px; font-family: var(--font-display); font-size: 0.9rem; color: var(--text-primary); }
        .wp-modal__section p { color: var(--text-secondary); font-size: 0.88rem; line-height: 1.7; }
        .wp-modal__tags { display: flex; flex-wrap: wrap; gap: 8px; }
        .wp-modal__tips { list-style: none; display: flex; flex-direction: column; gap: 8px; }
        .wp-modal__tips li { color: var(--text-secondary); font-size: 0.85rem; padding-left: 16px; border-left: 2px solid var(--accent-primary); line-height: 1.6; }
        .wp-modal__funfact {
          display: flex; gap: 12px; align-items: flex-start;
          padding: 16px; border-radius: var(--radius-md);
          background: rgba(245,158,11,0.08); border: 1px solid rgba(245,158,11,0.2);
        }
        .wp-modal__funfact span { font-size: 1.2rem; flex-shrink: 0; }
        .wp-modal__funfact p { color: var(--text-secondary); font-size: 0.85rem; line-height: 1.6; }
        .wp-modal__funfact strong { color: var(--accent-gold); }

        @media (max-width: 1200px) { .wp-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 900px) { .wp-grid { grid-template-columns: repeat(2, 1fr); } .wp-categories { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px) { .wp-grid { grid-template-columns: 1fr; } .wp-categories { grid-template-columns: 1fr; } .wp-modal { width: 95%; } .wp-modal__facts { grid-template-columns: 1fr; } }
      `}</style>
        </div>
    );
}
