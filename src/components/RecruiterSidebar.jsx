import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Search, MessageSquare, Settings, LogOut, Shield, Sun, Moon } from 'lucide-react';
import { motion as Motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import './RecruiterSidebar.css';

export default function RecruiterSidebar({ user, onLogout }) {
    const { theme, toggleTheme } = useTheme();

    return (
        <aside className="recruiter-sidebar glass-panel">
            <div className="sidebar-branding">
                <span className="branding-text">CareerLens</span>
                <span className="branding-sub">Recruiter Portal</span>
            </div>

            <nav className="sidebar-nav">
                <SidebarLink to="/recruiter-dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" />
                <SidebarLink to="/recruiter-jobs" icon={<Briefcase size={20} />} label="My Jobs" />
                <SidebarLink to="/recruiter-scan" icon={<Search size={20} />} label="Talent Scan" />
                <SidebarLink to="/recruiter-messages" icon={<MessageSquare size={20} />} label="Messages" />
            </nav>

            <div className="sidebar-control">
                <button onClick={toggleTheme} className="theme-toggle-btn">
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
            </div>

            <div className="sidebar-footer">
                <div className="user-info">
                    <div className="user-avatar">
                        <Shield size={20} />
                    </div>
                    <div className="user-details">
                        <span className="user-name">{user?.name}</span>
                        <span className="user-role">Recruiter</span>
                    </div>
                </div>
                <button onClick={onLogout} className="logout-btn-sidebar">
                    <LogOut size={18} />
                </button>
            </div>
        </aside>
    );
}

const SidebarLink = ({ to, icon, label }) => (
    <NavLink to={to} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        {icon}
        <span>{label}</span>
        <Motion.div
            className="active-indicator"
            layoutId="indicator"
            initial={false}
            animate={{ opacity: 1 }}
        />
    </NavLink>
);
