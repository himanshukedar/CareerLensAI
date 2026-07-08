import React, { useState } from 'react';
import api from '../api/api';
import { motion as Motion } from 'framer-motion';
import { Search, UserCheck, MessageSquare, Award, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import RecruiterSidebar from '../components/RecruiterSidebar';
import AnimatedPage from '../components/AnimatedPage';
import './RecruiterScan.css';

export default function RecruiterScan() {
    const { user, logout } = useAuth();
    const [skills, setSkills] = useState('');
    const [minScore, setMinScore] = useState(80);
    const [results, setResults] = useState([]);
    const [scanning, setScanning] = useState(false);

    const handleScan = async (e) => {
        e.preventDefault();
        setScanning(true);
        try {
            const res = await api.get(`/recruiter/scan?skills=${skills}&minScore=${minScore}`);
            setResults(res.data);
            setScanning(false);
        } catch (err) {
            console.error(err);
            setScanning(false);
        }
    };

    return (
        <div className="recruiter-layout">
            <RecruiterSidebar user={user} onLogout={logout} />

            <AnimatedPage className="recruiter-content">
                <header className="content-header">
                    <div>
                        <h1 className="welcome-text">Talent Scanner</h1>
                        <p className="welcome-sub">AI-powered deep search across all verified student profiles.</p>
                    </div>
                </header>

                <section className="glass-panel scan-controls">
                    <form onSubmit={handleScan} className="scan-form">
                        <div className="scan-input-group">
                            <label>Required Skills (comma separated)</label>
                            <input
                                type="text"
                                placeholder="e.g. React, Node.js, Python"
                                value={skills}
                                onChange={e => setSkills(e.target.value)}
                            />
                        </div>
                        <div className="scan-input-group">
                            <label>Min. AI Score ({minScore}%)</label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={minScore}
                                onChange={e => setMinScore(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="neon-btn h-full" disabled={scanning}>
                            {scanning ? 'Searching...' : 'Initiate Deep Scan'}
                        </button>
                    </form>
                </section>

                <div className="scan-results">
                    {results.length > 0 ? results.map(talent => (
                        <Motion.div
                            key={talent._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="glass-panel talent-card"
                        >
                            <div className="talent-info">
                                <div className="talent-main">
                                    <h3 className="talent-name">{talent.name}</h3>
                                    <p className="talent-headline">{talent.headline}</p>
                                </div>
                                <div className="talent-metrics">
                                    <div className="metric">
                                        <Award size={16} color="var(--primary)" />
                                        <span>Avg. Score: {Math.round(talent.assessments?.reduce((s, a) => s + a.score, 0) / (talent.assessments?.length || 1))}%</span>
                                    </div>
                                    <div className="metric">
                                        <Star size={16} color="#eab308" />
                                        <span>{talent.tokens?.length || 0} Badges Earned</span>
                                    </div>
                                </div>
                            </div>

                            <div className="talent-skills">
                                {talent.skills.slice(0, 5).map(s => (
                                    <span key={s} className="skill-tag">{s}</span>
                                ))}
                            </div>

                            <div className="talent-actions">
                                <button className="outline-btn-sm">View Full Profile</button>
                                <button className="neon-btn-sm">Message</button>
                            </div>
                        </Motion.div>
                    )) : !scanning && (
                        <div className="empty-scan">
                            <Search size={48} opacity={0.2} />
                            <p>Enter skills and initiate scan to find verified talent.</p>
                        </div>
                    )}
                </div>
            </AnimatedPage>
        </div>
    );
}
