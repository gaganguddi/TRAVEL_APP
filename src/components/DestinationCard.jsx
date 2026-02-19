import { Link } from "react-router-dom";
import { Star, MapPin, Clock, ArrowRight, Heart } from "lucide-react";
import { useState } from "react";

export default function DestinationCard({ destination, compact = false }) {
    const { id, name, country, continent, description, tags, image, rating, bestTime } = destination;
    const [liked, setLiked] = useState(false);

    return (
        <div className="dest-card">
            {/* Image */}
            <div className="dest-card__img-wrap">
                <img src={image} alt={name} className="dest-card__img" loading="lazy" />
                <div className="dest-card__overlay" />
                <button
                    className={`dest-card__heart ${liked ? "liked" : ""}`}
                    onClick={(e) => { e.preventDefault(); setLiked(!liked); }}
                    aria-label="Favorite"
                >
                    <Heart size={16} fill={liked ? "currentColor" : "none"} />
                </button>
                <div className="dest-card__continent badge badge-accent">{continent}</div>
            </div>

            {/* Content */}
            <div className="dest-card__body">
                <div className="dest-card__header">
                    <div>
                        <h3 className="dest-card__name">{name}</h3>
                        <p className="dest-card__location">
                            <MapPin size={13} /> {country}
                        </p>
                    </div>
                    <div className="dest-card__rating">
                        <Star size={13} fill="currentColor" />
                        <span>{rating}</span>
                    </div>
                </div>

                {!compact && <p className="dest-card__desc">{description}</p>}

                <div className="dest-card__meta">
                    <span className="dest-card__best-time">
                        <Clock size={12} /> {bestTime}
                    </span>
                    <div className="dest-card__tags">
                        {tags.slice(0, 2).map((t) => (
                            <span key={t} className="tag-pill">{t}</span>
                        ))}
                    </div>
                </div>

                <Link to={`/destination/${id}`} className="btn btn-primary dest-card__cta">
                    Explore <ArrowRight size={15} />
                </Link>
            </div>

            <style>{`
        .dest-card {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          overflow: hidden;
          transition: var(--transition);
          display: flex;
          flex-direction: column;
        }
        .dest-card:hover {
          border-color: var(--border-accent);
          box-shadow: var(--shadow-glow);
          transform: translateY(-6px);
        }
        .dest-card__img-wrap {
          position: relative;
          height: 200px;
          overflow: hidden;
        }
        .dest-card__img {
          width: 100%; height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .dest-card:hover .dest-card__img { transform: scale(1.08); }
        .dest-card__overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to bottom, transparent 40%, rgba(8,12,20,0.8));
        }
        .dest-card__heart {
          position: absolute; top: 12px; right: 12px;
          width: 32px; height: 32px;
          border-radius: 50%;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.15);
          color: white; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: var(--transition);
        }
        .dest-card__heart.liked { color: #ef4444; border-color: #ef4444; background: rgba(239,68,68,0.2); }
        .dest-card__heart:hover { transform: scale(1.15); }
        .dest-card__continent {
          position: absolute; bottom: 12px; left: 12px;
          font-size: 0.7rem;
        }
        .dest-card__body {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          flex: 1;
        }
        .dest-card__header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .dest-card__name {
          font-family: var(--font-display);
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 4px;
        }
        .dest-card__location {
          display: flex; align-items: center; gap: 4px;
          color: var(--text-muted); font-size: 0.82rem;
        }
        .dest-card__rating {
          display: flex; align-items: center; gap: 4px;
          color: var(--accent-gold);
          font-weight: 700; font-size: 0.9rem;
          flex-shrink: 0;
        }
        .dest-card__desc {
          color: var(--text-secondary);
          font-size: 0.85rem;
          line-height: 1.6;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .dest-card__meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
        }
        .dest-card__best-time {
          display: flex; align-items: center; gap: 4px;
          font-size: 0.78rem; color: var(--text-muted);
        }
        .dest-card__tags { display: flex; gap: 6px; }
        .dest-card__cta {
          width: 100%;
          justify-content: center;
          margin-top: auto;
          padding: 10px;
          font-size: 0.85rem;
        }
      `}</style>
        </div>
    );
}
