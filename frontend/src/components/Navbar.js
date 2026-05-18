import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const links = [
    { to: '/dashboard', label: '📊 Dashboard' },
    { to: '/employees', label: '👥 Employees' },
    { to: '/employees/add', label: '➕ Add Employee' },
    { to: '/ai/recommend', label: '🤖 AI Recommend' },
    { to: '/ai/rankings', label: '🏆 Rankings' },
  ];

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        <Link to="/dashboard" style={styles.brand}>
          ⚡ EmpAnalytics
        </Link>

        <button style={styles.menuBtn} onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>

        <div style={{ ...styles.links, ...(menuOpen ? styles.linksOpen : {}) }}>
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              style={{
                ...styles.link,
                ...(location.pathname === l.to ? styles.activeLink : {}),
              }}
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div style={styles.userArea}>
          <span style={styles.userName}>
            👤 {user?.name}
            <span style={styles.roleBadge}>{user?.role}</span>
          </span>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    background: '#1e1b4b',
    color: 'white',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
  },
  inner: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '0 1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    minHeight: 60,
    flexWrap: 'wrap',
  },
  brand: {
    color: 'white',
    textDecoration: 'none',
    fontWeight: 700,
    fontSize: '1.1rem',
    letterSpacing: '-0.02em',
    marginRight: '1rem',
  },
  links: {
    display: 'flex',
    gap: '0.25rem',
    flex: 1,
    flexWrap: 'wrap',
  },
  linksOpen: {},
  link: {
    color: 'rgba(255,255,255,0.75)',
    textDecoration: 'none',
    padding: '0.4rem 0.75rem',
    borderRadius: 6,
    fontSize: '0.85rem',
    transition: 'all 0.15s',
    whiteSpace: 'nowrap',
  },
  activeLink: {
    background: 'rgba(255,255,255,0.15)',
    color: 'white',
  },
  userArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginLeft: 'auto',
  },
  userName: {
    fontSize: '0.85rem',
    color: 'rgba(255,255,255,0.8)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
  },
  roleBadge: {
    background: '#4f46e5',
    padding: '0.1rem 0.5rem',
    borderRadius: 99,
    fontSize: '0.7rem',
    textTransform: 'uppercase',
  },
  logoutBtn: {
    background: 'rgba(255,255,255,0.1)',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.2)',
    padding: '0.35rem 0.9rem',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: '0.82rem',
    transition: 'all 0.15s',
  },
  menuBtn: {
    display: 'none',
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '1.25rem',
    cursor: 'pointer',
  },
};

export default Navbar;
