import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Compass, Map, BookMarked, Home, Menu, X, Sparkles, Globe2, Landmark } from "lucide-react";

const navLinks = [
  { to: "/", label: "Home", icon: Home },
  { to: "/explore", label: "Explore", icon: Compass },
  { to: "/world", label: "World Wonders", icon: Landmark },
  { to: "/planner", label: "Trip Planner", icon: Map },
  { to: "/saved", label: "Saved Trips", icon: BookMarked },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

  return (
    <>
      <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
        <div className="container navbar__inner">
          {/* Logo */}
          <Link to="/" className="navbar__logo">
            <div className="navbar__logo-icon">
              <Sparkles size={18} />
            </div>
            <span className="navbar__logo-text">Wander<span className="gradient-text">AI</span></span>
          </Link>

          {/* Desktop Links */}
          <ul className="navbar__links">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <Link
                  to={to}
                  className={`navbar__link ${location.pathname === to ? "navbar__link--active" : ""}`}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className="navbar__cta">
            <Link to="/planner" className="btn btn-primary" style={{ padding: "10px 20px", fontSize: "0.85rem" }}>
              <Sparkles size={15} />
              Plan a Trip
            </Link>
          </div>

          {/* Mobile toggle */}
          <button className="navbar__hamburger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="mobile-menu">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`mobile-menu__link ${location.pathname === to ? "mobile-menu__link--active" : ""}`}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
          <Link to="/planner" className="btn btn-primary" style={{ alignSelf: "flex-start" }}>
            <Sparkles size={15} /> Plan a Trip
          </Link>
        </div>
      )}

      <style>{`
        .navbar {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          height: var(--nav-height);
          transition: var(--transition);
        }
        .navbar--scrolled {
          background: var(--bg-glass);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-bottom: 1px solid var(--border-subtle);
          box-shadow: 0 4px 24px rgba(0,0,0,0.3);
        }
        .navbar__inner {
          display: flex;
          align-items: center;
          height: 100%;
          gap: 24px;
        }
        .navbar__logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          flex-shrink: 0;
        }
        .navbar__logo-icon {
          width: 36px; height: 36px;
          border-radius: 10px;
          background: var(--gradient-primary);
          display: flex; align-items: center; justify-content: center;
          color: white;
        }
        .navbar__logo-text {
          font-family: var(--font-display);
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--text-primary);
        }
        .navbar__links {
          display: flex;
          list-style: none;
          gap: 2px;
          flex: 1;
          margin: 0;
        }
        .navbar__link {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: var(--radius-full);
          color: var(--text-secondary);
          font-size: 0.85rem;
          font-weight: 500;
          text-decoration: none;
          transition: var(--transition);
          white-space: nowrap;
        }
        .navbar__link:hover { color: var(--text-primary); background: var(--bg-card); }
        .navbar__link--active {
          color: var(--accent-secondary);
          background: rgba(99,102,241,0.1);
          border: 1px solid rgba(99,102,241,0.2);
        }
        .navbar__cta { margin-left: auto; flex-shrink: 0; }
        .navbar__hamburger {
          display: none;
          background: none;
          border: none;
          color: var(--text-primary);
          cursor: pointer;
          padding: 8px;
          margin-left: auto;
        }
        .mobile-menu {
          position: fixed;
          top: var(--nav-height);
          left: 0; right: 0;
          background: var(--bg-glass);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-bottom: 1px solid var(--border-subtle);
          padding: 20px 24px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          z-index: 99;
          animation: fadeInUp 0.3s ease;
        }
        .mobile-menu__link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          font-weight: 500;
          text-decoration: none;
          transition: var(--transition);
        }
        .mobile-menu__link:hover { color: var(--text-primary); background: var(--bg-card); }
        .mobile-menu__link--active { color: var(--accent-secondary); background: rgba(99,102,241,0.1); }

        @media (max-width: 1100px) {
          .navbar__links, .navbar__cta { display: none; }
          .navbar__hamburger { display: flex; }
        }
      `}</style>
    </>
  );
}
