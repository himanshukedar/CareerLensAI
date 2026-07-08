    import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Zap, User, Briefcase, MessageSquare, LayoutDashboard, Target, Sun, Moon, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import './Header.css';

export default function Header() {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    
    // Derived state instead of effect


    if (!user) return null;

    return (
        <>

            
            <header className="main-header glass-panel">
                <div className="header-logo">
                    <Link to={user.role === 'student' ? '/dashboard' : '/recruiter-dashboard'} style={{textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '0.8rem'}}>
                        <img src="/logo.jpeg" alt="Logo" style={{ width: '38px', height: '38px', borderRadius: '50%', border: '2px solid rgba(0, 243, 255, 0.3)' }} />
                        <span className="logo-text">CareerLens<span className="ai-highlight">AI</span></span>
                    </Link>
                </div>
                
                <nav className="header-nav">
                    {user.role === 'student' && (
                        <>
                            <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}><LayoutDashboard size={18}/> Dashboard</Link>
                            <Link to="/roadmap" className={`nav-link ${location.pathname.startsWith('/roadmap') ? 'active' : ''}`}><Target size={18}/> Roadmaps</Link>
                            <Link to="/jobs" className={`nav-link ${location.pathname === '/jobs' ? 'active' : ''}`}><Briefcase size={18}/> Jobs</Link>
                            <Link to="/messages" className={`nav-link ${location.pathname === '/messages' ? 'active' : ''}`}><MessageSquare size={18}/> Messages</Link>
                            <Link to="/profile" className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}><User size={18}/> Profile</Link>
                        </>
                    )}
                    {user.role === 'recruiter' && (
                        <>
                            <Link to="/recruiter-dashboard" className={`nav-link ${location.pathname === '/recruiter-dashboard' ? 'active' : ''}`}><LayoutDashboard size={18}/> Overview</Link>
                            <Link to="/recruiter-jobs" className={`nav-link ${location.pathname === '/recruiter-jobs' ? 'active' : ''}`}><Briefcase size={18}/> Manage Jobs</Link>
                            <Link to="/recruiter-scan" className={`nav-link ${location.pathname === '/recruiter-scan' ? 'active' : ''}`}><Target size={18}/> AI Scan</Link>
                            <Link to="/recruiter-messages" className={`nav-link ${location.pathname === '/recruiter-messages' ? 'active' : ''}`}><MessageSquare size={18}/> Messages</Link>
                        </>
                    )}
                </nav>

                <div className="header-actions" style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
                    <button onClick={() => window.location.href = '/profile'} className="user-name-display" title="View Profile">
                        {user.role === 'admin' ? <Shield size={16} /> : <User size={16} />}
                        <span>{user.name || 'User'}</span>
                    </button>
                    <button onClick={toggleTheme} className="theme-toggle-btn" title="Toggle Theme">
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <button className="neon-btn small" onClick={logout}>Logout</button>
                </div>
            </header>
        </>
    );
}
