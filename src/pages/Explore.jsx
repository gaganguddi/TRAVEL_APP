import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, X, Globe2 } from "lucide-react";
import { destinations, continents, tagsList } from "../data/destinations";
import DestinationCard from "../components/DestinationCard";

export default function Explore() {
    const [query, setQuery] = useState("");
    const [continent, setContinent] = useState("All");
    const [tag, setTag] = useState("All");
    const [showFilters, setShowFilters] = useState(false);

    const filtered = useMemo(() => {
        return destinations.filter((d) => {
            const q = query.toLowerCase();
            const matchQ = !q || d.name.toLowerCase().includes(q) || d.country.toLowerCase().includes(q);
            const matchC = continent === "All" || d.continent === continent;
            const matchT = tag === "All" || d.tags.includes(tag);
            return matchQ && matchC && matchT;
        });
    }, [query, continent, tag]);

    const clearFilters = () => { setQuery(""); setContinent("All"); setTag("All"); };
    const hasFilters = query || continent !== "All" || tag !== "All";

    return (
        <div className="page-wrapper">
            <div className="container" style={{ paddingTop: 48, paddingBottom: 80 }}>
                {/* Header */}
                <div className="explore-header">
                    <div>
                        <p className="section-label">Discover</p>
                        <h1 className="section-title">Explore <span className="gradient-text">Destinations</span></h1>
                        <p className="section-subtitle">Find your perfect destination from our curated collection.</p>
                    </div>
                    <div className="explore-meta">
                        <Globe2 size={18} style={{ color: "var(--accent-secondary)" }} />
                        <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                            {filtered.length} destination{filtered.length !== 1 ? "s" : ""}
                        </span>
                    </div>
                </div>

                {/* Search & Filter Bar */}
                <div className="explore-bar">
                    <div className="explore-search">
                        <Search size={16} className="explore-search__icon" />
                        <input
                            type="text"
                            placeholder="Search destinations or countries..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="explore-search__input"
                        />
                        {query && (
                            <button className="explore-search__clear" onClick={() => setQuery("")}>
                                <X size={14} />
                            </button>
                        )}
                    </div>
                    <button
                        className={`btn btn-secondary ${showFilters ? "active-filter" : ""}`}
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <SlidersHorizontal size={16} /> Filters
                    </button>
                    {hasFilters && (
                        <button className="btn btn-ghost" onClick={clearFilters}>
                            <X size={14} /> Clear
                        </button>
                    )}
                </div>

                {/* Filters Panel */}
                {showFilters && (
                    <div className="explore-filters glass-card" style={{ padding: "24px", marginBottom: 32, marginTop: 8 }}>
                        <div className="explore-filter-group">
                            <p className="explore-filter-label">Continent</p>
                            <div className="explore-filter-pills">
                                {continents.map((c) => (
                                    <button
                                        key={c}
                                        className={`tag-pill ${continent === c ? "active" : ""}`}
                                        onClick={() => setContinent(c)}
                                    >{c}</button>
                                ))}
                            </div>
                        </div>
                        <div className="explore-filter-group">
                            <p className="explore-filter-label">Travel Style</p>
                            <div className="explore-filter-pills">
                                {tagsList.map((t) => (
                                    <button
                                        key={t}
                                        className={`tag-pill ${tag === t ? "active" : ""}`}
                                        onClick={() => setTag(t)}
                                    >{t}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Active filters display */}
                {hasFilters && (
                    <div className="explore-active-filters">
                        {continent !== "All" && <span className="badge badge-accent">{continent} <button onClick={() => setContinent("All")}>×</button></span>}
                        {tag !== "All" && <span className="badge badge-accent">{tag} <button onClick={() => setTag("All")}>×</button></span>}
                        {query && <span className="badge badge-accent">"{query}" <button onClick={() => setQuery("")}>×</button></span>}
                    </div>
                )}

                {/* Grid */}
                {filtered.length > 0 ? (
                    <div className="explore-grid">
                        {filtered.map((d) => (
                            <DestinationCard key={d.id} destination={d} />
                        ))}
                    </div>
                ) : (
                    <div className="explore-empty">
                        <Globe2 size={48} style={{ color: "var(--text-muted)", margin: "0 auto 16px", display: "block" }} />
                        <h3>No destinations found</h3>
                        <p>Try adjusting your search or filters.</p>
                        <button className="btn btn-primary" onClick={clearFilters} style={{ marginTop: 16 }}>Clear Filters</button>
                    </div>
                )}
            </div>

            <style>{`
        .explore-header {
          display: flex; justify-content: space-between; align-items: flex-end;
          margin-bottom: 40px; flex-wrap: wrap; gap: 20px;
        }
        .explore-meta { display: flex; align-items: center; gap: 8px; }
        .explore-bar {
          display: flex; gap: 12px; margin-bottom: 24px; flex-wrap: wrap;
        }
        .explore-search {
          flex: 1; position: relative; min-width: 240px;
        }
        .explore-search__icon {
          position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
          color: var(--text-muted); pointer-events: none;
        }
        .explore-search__input {
          width: 100%;
          padding: 12px 40px 12px 42px;
          background: var(--bg-card); border: 1px solid var(--border-normal);
          border-radius: var(--radius-md); color: var(--text-primary);
          font-family: var(--font-body); font-size: 0.9rem; outline: none;
          transition: var(--transition);
        }
        .explore-search__input:focus { border-color: var(--accent-primary); box-shadow: 0 0 0 3px rgba(99,102,241,0.15); }
        .explore-search__input::placeholder { color: var(--text-muted); }
        .explore-search__clear {
          position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
          background: none; border: none; color: var(--text-muted); cursor: pointer; padding: 4px;
        }
        .active-filter { border-color: var(--border-accent); color: var(--accent-secondary); }
        .explore-filters { animation: fadeInUp 0.3s ease; }
        .explore-filter-group { margin-bottom: 16px; }
        .explore-filter-group:last-child { margin-bottom: 0; }
        .explore-filter-label { font-size: 0.8rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 10px; }
        .explore-filter-pills { display: flex; flex-wrap: wrap; gap: 8px; }
        .explore-active-filters { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; }
        .explore-active-filters button { background: none; border: none; color: inherit; cursor: pointer; margin-left: 4px; }
        .explore-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
        @media (max-width: 1200px) { .explore-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 900px) { .explore-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) { .explore-grid { grid-template-columns: 1fr; } }
        .explore-empty { text-align: center; padding: 80px 24px; color: var(--text-secondary); }
        .explore-empty h3 { font-size: 1.4rem; margin-bottom: 8px; color: var(--text-primary); }
      `}</style>
        </div>
    );
}
