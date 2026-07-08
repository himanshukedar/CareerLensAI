import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Radar, RadarChart, BarChart, Bar, XAxis, YAxis, Tooltip, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Cell } from 'recharts';
import { ArrowLeft, Brain, Target, TrendingUp, AlertTriangle, Lightbulb, Award, BookOpen, Briefcase, Code, CheckCircle, XCircle, Zap, Star, Clock, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import toast from 'react-hot-toast';
import AnimatedPage from '../components/AnimatedPage';
import GlitchText from '../components/GlitchText';
import './profileanalysis.css';

export default function ProfileAnalysis() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        if (user) {
            setProfile(user);
            setLoading(false);
        }
    }, [user]);

    if (loading) return <div className="loader-container">Analyzing Your Career Profile...</div>;
    if (!profile) return <div className="loader-container">No profile data found. Please log in again.</div>;

    const analysis = analyzeProfile(profile);

    return (
        <AnimatedPage className="profile-analysis-container container">
            {/* Header */}
            <div className="analysis-header">
                <button onClick={() => navigate('/dashboard')} className="back-link">
                    <ArrowLeft size={16} /> Back to Dashboard
                </button>
                <GlitchText text="Career Intelligence Dashboard" />
                <p className="analysis-subtitle">AI-Powered Career Gap Analysis & Strategic Roadmap</p>
            </div>

            {/* Tab Navigation */}
            <div className="tab-navigation">
                <button
                    className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                >
                    <Brain size={18} /> Overview
                </button>
                <button
                    className={`tab-btn ${activeTab === 'skills' ? 'active' : ''}`}
                    onClick={() => setActiveTab('skills')}
                >
                    <Code size={18} /> Skills Analysis
                </button>
                <button
                    className={`tab-btn ${activeTab === 'roadmap' ? 'active' : ''}`}
                    onClick={() => setActiveTab('roadmap')}
                >
                    <Target size={18} /> Action Roadmap
                </button>
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                    <Motion.div
                        key="overview"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <OverviewTab analysis={analysis} profile={profile} />
                    </Motion.div>
                )}

                {activeTab === 'skills' && (
                    <Motion.div
                        key="skills"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <SkillsTab analysis={analysis} />
                    </Motion.div>
                )}

                {activeTab === 'roadmap' && (
                    <Motion.div
                        key="roadmap"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <RoadmapTab analysis={analysis} />
                    </Motion.div>
                )}
            </AnimatePresence>
        </AnimatedPage>
    );
}

// Overview Tab Component
const OverviewTab = ({ analysis, profile }) => (
    <div className="dashboard-grid">
        {/* Hero Stats */}
        <div className="hero-stats">
            <Motion.div
                className="stat-card glass-panel"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #40916C, #C89F65)' }}>
                    <Target size={24} />
                </div>
                <div className="stat-content">
                    <h3>{analysis.compatibilityScore}%</h3>
                    <p>Career Ready</p>
                </div>
            </Motion.div>

            <Motion.div
                className="stat-card glass-panel"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #2D6A4F, #E56B6F)' }}>
                    <CheckCircle size={24} />
                </div>
                <div className="stat-content">
                    <h3>{analysis.whatYouHave.length}</h3>
                    <p>Skills Acquired</p>
                </div>
            </Motion.div>

            <Motion.div
                className="stat-card glass-panel"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #E56B6F, #C89F65)' }}>
                    <AlertTriangle size={24} />
                </div>
                <div className="stat-content">
                    <h3>{analysis.whatsMissing.length}</h3>
                    <p>Skills to Learn</p>
                </div>
            </Motion.div>

            <Motion.div
                className="stat-card glass-panel"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #1B4332, #40916C)' }}>
                    <Award size={24} />
                </div>
                <div className="stat-content">
                    <h3>{profile.completedRoadmaps?.length || 0}</h3>
                    <p>Roadmaps Done</p>
                </div>
            </Motion.div>
        </div>

        {/* Main Radar Chart */}
        <Motion.div
            className="radar-card glass-panel"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
        >
            <h3><Brain size={20} /> Skill Radar Analysis</h3>
            <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={analysis.radarData}>
                    <PolarGrid stroke="rgba(99, 102, 241, 0.3)" />
                    <PolarAngleAxis dataKey="skill" tick={{ fill: 'var(--text-muted)', fontSize: 13 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: 'var(--text-muted)' }} />
                    <Radar name="Your Skills" dataKey="current" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.6} />
                    <Radar name="Industry Standard" dataKey="target" stroke="var(--secondary)" fill="var(--secondary)" fillOpacity={0.2} strokeDasharray="5 5" />
                </RadarChart>
            </ResponsiveContainer>
        </Motion.div>

        {/* AI Insight Card */}
        <Motion.div
            className="insight-card glass-panel"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
        >
            <div className="insight-header">
                <Lightbulb size={24} color="var(--accent)" />
                <h3>AI Career Insight</h3>
            </div>
            <p className="insight-main">{analysis.compatibilityInsight}</p>
            <div className="target-display">
                <Briefcase size={18} />
                <span>Target Role: <strong>{profile.aspiration || 'Not Set'}</strong></span>
            </div>
            <div className="progress-ring">
                <svg viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(99, 102, 241, 0.1)" strokeWidth="10" />
                    <Motion.circle
                        cx="60"
                        cy="60"
                        r="50"
                        fill="none"
                        stroke="url(#grad)"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 50}`}
                        initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 50 * (1 - analysis.compatibilityScore / 100) }}
                        transition={{ duration: 1.5 }}
                        transform="rotate(-90 60 60)"
                    />
                    <defs>
                        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="var(--primary)" />
                            <stop offset="100%" stopColor="var(--secondary)" />
                        </linearGradient>
                    </defs>
                    <text x="60" y="65" textAnchor="middle" fill="var(--text-main)" fontSize="24" fontWeight="700">
                        {analysis.compatibilityScore}%
                    </text>
                </svg>
            </div>
        </Motion.div>

        {/* Quick Actions */}
        <Motion.div
            className="quick-actions glass-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
        >
            <h3><Zap size={20} /> Quick Actions</h3>
            <div className="action-list">
                {analysis.recommendations.learningPath.slice(0, 3).map((action, idx) => (
                    <Motion.div
                        key={idx}
                        className="action-item"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + idx * 0.1 }}
                        whileHover={{ x: 5 }}
                    >
                        <ArrowRight size={16} color="var(--primary)" />
                        <span>{action}</span>
                    </Motion.div>
                ))}
            </div>
        </Motion.div>

        {/* AI Deep Analysis Section */}
        {profile.assessments?.some(a => a.aiInsights) && (
            <Motion.div
                className="ai-deep-analysis glass-panel full-width"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                style={{ marginTop: '1rem' }}
            >
                <h3 style={{ color: 'var(--primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Cpu size={24} /> AI Deep Analysis (Multi-Agent Engine)
                </h3>
                <div className="analysis-grid-internal" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    <div className="metrics-column">
                        <h4 style={{ color: '#fff', marginBottom: '1rem' }}>Technical vs Soft Skill Balance</h4>
                        {(() => {
                            const latestAi = [...profile.assessments].reverse().find(a => a.aiInsights)?.aiInsights;
                            return (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    <div className="ai-metric-item">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <span style={{ color: 'var(--text-muted)' }}>Technical Mastery</span>
                                            <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{latestAi.technicalScore}%</span>
                                        </div>
                                        <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                                            <Motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${latestAi.technicalScore}%` }}
                                                transition={{ duration: 1, delay: 1 }}
                                                style={{ height: '100%', background: 'var(--primary)', boxShadow: '0 0 15px var(--primary)' }}
                                            />
                                        </div>
                                    </div>
                                    <div className="ai-metric-item">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <span style={{ color: 'var(--text-muted)' }}>Communication Quality</span>
                                            <span style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>{latestAi.softSkillsScore}%</span>
                                        </div>
                                        <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                                            <Motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${latestAi.softSkillsScore}%` }}
                                                transition={{ duration: 1, delay: 1.2 }}
                                                style={{ height: '100%', background: 'var(--secondary)', boxShadow: '0 0 15px var(--secondary)' }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                    <div className="recommendation-column">
                        <h4 style={{ color: '#fff', marginBottom: '1rem' }}>Agent Recommendation</h4>
                        {(() => {
                            const latestAi = [...profile.assessments].reverse().find(a => a.aiInsights)?.aiInsights;
                            return (
                                <div style={{ background: 'rgba(99, 102, 241, 0.05)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                        <TrendingUp size={18} color="var(--primary)" />
                                        <span style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.9rem', textTransform: 'uppercase' }}>Strategic Next Step</span>
                                    </div>
                                    <p style={{ color: '#fff', fontSize: '1.1rem', lineHeight: '1.6' }}>{latestAi.nextRoadmapStep}</p>
                                    <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                        <Brain size={14} /> Driven by Analyst & Support Agents
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                </div>
            </Motion.div>
        )}
    </div>
);

// Skills Tab Component
const SkillsTab = ({ analysis }) => (
    <div className="skills-grid">
        {/* Skills Comparison */}
        <Motion.div
            className="skills-comparison glass-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <h3><TrendingUp size={20} /> Skills Breakdown</h3>
            <ResponsiveContainer width="100%" height={350}>
                <BarChart data={analysis.skillBarData} layout="vertical">
                    <XAxis type="number" domain={[0, 100]} stroke="var(--text-muted)" />
                    <YAxis type="category" dataKey="name" stroke="var(--text-muted)" width={150} />
                    <Tooltip
                        contentStyle={{ background: 'var(--bg-dark)', border: '1px solid var(--glass-border)' }}
                        cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }}
                    />
                    <Bar dataKey="value" radius={[0, 10, 10, 0]}>
                        {analysis.skillBarData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={`url(#barGrad${index})`} />
                        ))}
                    </Bar>
                    <defs>
                        {analysis.skillBarData.map((_, index) => (
                            <linearGradient key={index} id={`barGrad${index}`} x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="var(--primary)" />
                                <stop offset="100%" stopColor="var(--secondary)" />
                            </linearGradient>
                        ))}
                    </defs>
                </BarChart>
            </ResponsiveContainer>
        </Motion.div>

        {/* What You Have */}
        <Motion.div
            className="skill-badges-card glass-panel"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
        >
            <div className="card-header">
                <CheckCircle size={20} color="var(--matrix)" />
                <h3>Your Skills</h3>
            </div>
            <div className="badge-container">
                {analysis.whatYouHave.map((skill, idx) => (
                    <Motion.div
                        key={idx}
                        className="skill-badge acquired"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + idx * 0.05 }}
                        whileHover={{ scale: 1.1 }}
                    >
                        <Star size={14} fill="var(--matrix)" stroke="none" />
                        <span>{skill}</span>
                    </Motion.div>
                ))}
            </div>
        </Motion.div>

        {/* What's Missing */}
        <Motion.div
            className="skill-badges-card glass-panel"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
        >
            <div className="card-header">
                <AlertTriangle size={20} color="var(--accent)" />
                <h3>Skills to Acquire</h3>
            </div>
            <div className="badge-container">
                {analysis.whatsMissing.map((skill, idx) => (
                    <Motion.div
                        key={idx}
                        className="skill-badge missing"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + idx * 0.05 }}
                        whileHover={{ scale: 1.1 }}
                    >
                        <XCircle size={14} />
                        <span>{skill}</span>
                    </Motion.div>
                ))}
            </div>
        </Motion.div>

        {/* Project Impact */}
        {analysis.projectImpact && (
            <Motion.div
                className="project-metrics glass-panel full-width"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <h3><Code size={20} /> Project Quality Metrics</h3>
                <div className="metrics-grid">
                    <div className="metric-card">
                        <div className="metric-label">Complexity</div>
                        <div className="metric-visual">
                            <Motion.div
                                className="metric-bar-fill"
                                initial={{ width: 0 }}
                                animate={{ width: `${analysis.projectImpact.complexity}%` }}
                                transition={{ duration: 1, delay: 0.6 }}
                            />
                        </div>
                        <div className="metric-value">{analysis.projectImpact.complexity}%</div>
                    </div>
                    <div className="metric-card">
                        <div className="metric-label">Tech Stack</div>
                        <div className="metric-visual">
                            <Motion.div
                                className="metric-bar-fill"
                                initial={{ width: 0 }}
                                animate={{ width: `${analysis.projectImpact.techStack}%` }}
                                transition={{ duration: 1, delay: 0.7 }}
                            />
                        </div>
                        <div className="metric-value">{analysis.projectImpact.techStack}%</div>
                    </div>
                    <div className="metric-card">
                        <div className="metric-label">Best Practices</div>
                        <div className="metric-visual">
                            <Motion.div
                                className="metric-bar-fill"
                                initial={{ width: 0 }}
                                animate={{ width: `${analysis.projectImpact.bestPractices}%` }}
                                transition={{ duration: 1, delay: 0.8 }}
                            />
                        </div>
                        <div className="metric-value">{analysis.projectImpact.bestPractices}%</div>
                    </div>
                </div>
            </Motion.div>
        )}
    </div>
);

// Roadmap Tab Component
const RoadmapTab = ({ analysis }) => (
    <div className="roadmap-grid">
        {/* Timeline */}
        <Motion.div
            className="timeline-card glass-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <h3><Clock size={20} /> Learning Timeline</h3>
            <div className="timeline">
                {analysis.recommendations.learningPath.map((item, idx) => (
                    <Motion.div
                        key={idx}
                        className="timeline-item"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + idx * 0.1 }}
                    >
                        <div className="timeline-marker">{idx + 1}</div>
                        <div className="timeline-content">
                            <p>{item}</p>
                        </div>
                    </Motion.div>
                ))}
            </div>
        </Motion.div>

        {/* Project Ideas */}
        <Motion.div
            className="projects-card glass-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
        >
            <h3><Code size={20} /> Recommended Projects</h3>
            <div className="project-list">
                {analysis.recommendations.projectIdeas.map((project, idx) => (
                    <Motion.div
                        key={idx}
                        className="project-card"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 + idx * 0.1 }}
                        whileHover={{ scale: 1.02, borderColor: 'var(--primary)' }}
                    >
                        <div className="project-icon">
                            <Code size={20} />
                        </div>
                        <p>{project}</p>
                    </Motion.div>
                ))}
            </div>
        </Motion.div>

        {/* Job Matches */}
        <Motion.div
            className="jobs-card glass-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
        >
            <h3><Briefcase size={20} /> Career Opportunities</h3>
            <div className="job-list">
                {analysis.recommendations.jobMatches.map((job, idx) => (
                    <Motion.div
                        key={idx}
                        className="job-item"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + idx * 0.1 }}
                        whileHover={{ x: 5 }}
                    >
                        <Award size={18} color="var(--accent)" />
                        <span>{job}</span>
                    </Motion.div>
                ))}
            </div>
        </Motion.div>
    </div>
);

// Analysis functions (Refactored to be achievement-based)
function analyzeProfile(profile) {
    const roadmapProgress = profile.roadmapProgress || [];
    const completedRoadmaps = profile.completedRoadmaps || [];
    const assessments = profile.assessments || [];
    const strengths = profile.swot?.strengths || [];
    const aspiration = profile.aspiration || '';

    // 1. Extract REAL skills from completed nodes and assessments
    const technicalSkills = extractTechnicalSkills(roadmapProgress, assessments);
    const softSkills = extractSoftSkills(strengths, assessments);

    // 2. Calculate Radar Data based on actual progress/scores
    const radarData = calculateRadarData(technicalSkills, softSkills, roadmapProgress, assessments, profile);

    // 3. Calculate Compatibility Score
    const compatibilityScore = calculateCompatibilityScore(profile, technicalSkills, softSkills, roadmapProgress, assessments);

    // 4. Generate Insight
    const compatibilityInsight = generateCompatibilityInsight(compatibilityScore, aspiration, technicalSkills, assessments);

    // 5. Identify Skills (What You Have)
    const whatYouHave = identifySkills(technicalSkills, strengths, completedRoadmaps, assessments);

    // 6. Identify Missing Skills (Next logic steps in roadmaps + aspiration gaps)
    const whatsMissing = identifyMissingSkills(aspiration, roadmapProgress, assessments);

    // 7. Calculate Project Impact (Only if roadmaps started)
    const projectImpact = calculateProjectImpact(roadmapProgress, technicalSkills, assessments);

    // 8. Generate Recommendations (Next nodes in active roadmaps)
    const recommendations = generateRecommendations(aspiration, roadmapProgress, whatsMissing);

    // Create bar chart data
    const skillBarData = radarData.map(item => ({
        name: item.skill,
        value: item.current
    }));

    return {
        radarData,
        skillBarData,
        compatibilityScore,
        compatibilityInsight,
        whatYouHave,
        whatsMissing,
        projectImpact,
        recommendations
    };
}

function extractTechnicalSkills(roadmapProgress, assessments = []) {
    const skills = new Set();

    // Only add skills that the user has actually checked off in roadmaps
    roadmapProgress.forEach(progress => {
        if (progress.completedNodes) {
            progress.completedNodes.forEach(node => skills.add(node));
        }
    });

    // Add high-scoring assessment categories
    assessments.forEach(ass => {
        if (ass.type === 'skill_evaluation' && ass.score >= 60) {
            skills.add(ass.category.toUpperCase());
        }
    });

    return Array.from(skills);
}

function extractSoftSkills(strengths = [], assessments = []) {
    const skills = new Set(strengths);

    // Add soft skills from mock interviews
    const successfulInterviews = assessments.filter(a => a.type === 'mock_interview' && a.score >= 70);
    if (successfulInterviews.length > 0) {
        skills.add('Professional Communication');
        skills.add('Interview Confidence');
    }

    return Array.from(skills);
}

function calculateRadarData(technicalSkills, softSkills, roadmapProgress, assessments, profile) {
    // Technical Skills: Based on nodes completed relative to started roadmaps
    const totalPossibleNodes = roadmapProgress.length * 20 || 1; // Approx 20 nodes per roadmap
    const totalCompletedNodes = roadmapProgress.reduce((acc, p) => acc + (p.completedNodes?.length || 0), 0);
    const techScore = Math.min(100, Math.round((totalCompletedNodes / totalPossibleNodes) * 100));

    // Tools & Frameworks: Based on Skill Evaluations
    const skillEvals = assessments.filter(a => a.type === 'skill_evaluation');
    const avgSkillScore = skillEvals.length > 0
        ? Math.round(skillEvals.reduce((acc, a) => acc + a.score, 0) / skillEvals.length)
        : 0;

    // Soft Skills & Problem Solving
    const softScore = Math.min(100, softSkills.length * 15);
    const problemSolving = Math.min(100, (profile.swot?.strengths?.length || 0) * 10 + (skillEvals.filter(a => a.score > 80).length * 20));

    // Experience: Based on finished roadmaps
    const experienceScore = Math.min(100, (roadmapProgress.filter(p => p.isFinished).length * 25));

    // Industry Knowledge: Profile completeness + Resume
    let industryScore = 0;
    if (profile.resume) industryScore += 40;
    if (profile.education?.length > 0) industryScore += 30;
    if (profile.certifications?.length > 0) industryScore += 30;

    return [
        { skill: 'Technical Skills', current: techScore, target: 85 },
        { skill: 'Soft Skills', current: softScore, target: 75 },
        { skill: 'Problem Solving', current: problemSolving, target: 80 },
        { skill: 'Experience', current: experienceScore, target: 70 },
        { skill: 'Tools & Frameworks', current: avgSkillScore, target: 75 },
        { skill: 'Industry Knowledge', current: industryScore, target: 65 }
    ];
}

function calculateCompatibilityScore(profile, technicalSkills, softSkills, roadmapProgress, assessments) {
    if (roadmapProgress.length === 0 && assessments.length === 0) return 0;

    let score = 0;

    // Roadmap Completion (40%) - Actual nodes completed
    const totalCompletedNodes = roadmapProgress.reduce((acc, p) => acc + (p.completedNodes?.length || 0), 0);
    score += Math.min(40, totalCompletedNodes * 2);

    // Profile Completeness (20%)
    if (profile.resume) score += 5;
    if (profile.aspiration) score += 5;
    if (profile.swot?.strengths?.length > 0) score += 5;
    if (profile.education?.length > 0) score += 5;

    // Assessments (40%)
    const highScores = assessments.filter(a => a.score >= 70).length;
    score += Math.min(40, highScores * 10 + assessments.length * 5);

    return Math.min(100, Math.round(score));
}

function generateCompatibilityInsight(score, aspiration, skills, assessments = []) {
    if (score === 0) return "Start your journey by choosing a roadmap or taking a skill evaluation.";

    const role = aspiration || 'your chosen path';
    if (score >= 80) return `You demonstrate high readiness (${score}%) for ${role}. Your achievements are solid.`;
    if (score >= 50) return `You are making steady progress (${score}%). Continue completing your active roadmap sections.`;
    return `You've started your journey to ${role}. Focus on completing more nodes to build your foundation.`;
}

function identifySkills(technicalSkills, strengths, completedRoadmaps, assessments = []) {
    // Only return things that actually exist
    const skills = [...technicalSkills];
    completedRoadmaps.forEach(r => skills.push(`${r.roadmapId.toUpperCase()} GRADUATE`));

    return Array.from(new Set(skills)).slice(0, 15);
}

function identifyMissingSkills(aspiration, roadmapProgress, assessments = []) {
    // 1. Gaps in active roadmaps
    const missing = new Set();
    roadmapProgress.forEach(progress => {
        if (!progress.isFinished) {
            missing.add(`Continue ${progress.roadmapId.toUpperCase()}`);
        }
    });

    // 2. Role-specific requirements based on aspiration (Strictly as "Gaps to Fill")
    const roleRequirements = {
        'frontend': ['TypeScript', 'Next.js', 'Testing', 'Webpack', 'Performance'],
        'backend': ['Microservices', 'Docker', 'Redis', 'Message Queues', 'System Design'],
        'fullstack': ['TypeScript', 'Docker', 'Testing', 'CI/CD', 'Cloud'],
        'devops': ['Kubernetes', 'Terraform', 'Monitoring', 'Security'],
        'ai': ['TensorFlow', 'PyTorch', 'MLOps', 'Model Deployment'],
    };

    const aspLower = (aspiration || '').toLowerCase();
    let reqs = [];
    if (aspLower.includes('frontend')) reqs = roleRequirements.frontend;
    else if (aspLower.includes('backend')) reqs = roleRequirements.backend;
    else if (aspLower.includes('fullstack')) reqs = roleRequirements.fullstack;
    else if (aspLower.includes('devops')) reqs = roleRequirements.devops;
    else if (aspLower.includes('ai') || aspLower.includes('ml')) reqs = roleRequirements.ai;
    else reqs = ['System Design', 'Testing', 'Git', 'Best Practices'];

    // Only add if not already validated by assessment or completed in a roadmap node
    reqs.forEach(req => {
        const alreadyHas = assessments.some(a => a.category.toLowerCase().includes(req.toLowerCase()) && a.score >= 50);
        if (!alreadyHas) missing.add(req);
    });

    if (missing.size === 0 && roadmapProgress.length === 0) {
        return ["Start a Roadmap", "Select Target Role"];
    }

    return Array.from(missing).slice(0, 8);
}

function calculateProjectImpact(roadmapProgress, skills, assessments = []) {
    if (roadmapProgress.length === 0 && assessments.length === 0) return null;

    const completedNodes = roadmapProgress.reduce((acc, p) => acc + (p.completedNodes?.length || 0), 0);

    return {
        complexity: Math.min(100, completedNodes * 3 + 10),
        techStack: Math.min(100, skills.length * 8 + 15),
        bestPractices: Math.min(100, (assessments.filter(a => a.score > 75).length * 20) + (completedNodes * 1) + 5)
    };
}

function generateRecommendations(aspiration, roadmapProgress, missingSkills) {
    const learningPath = [];

    // Prioritize active roadmaps
    roadmapProgress.forEach(p => {
        if (!p.isFinished) {
            learningPath.push(`Complete next phase of ${p.roadmapId.toUpperCase()}`);
        }
    });

    // Add specific skill mastery from missing skills
    missingSkills.slice(0, 3).forEach(skill => {
        if (!skill.includes('Continue')) {
            learningPath.push(`Master ${skill} (Requirement for ${aspiration || 'Target Role'})`);
        }
    });

    if (learningPath.length < 3) {
        learningPath.push("Take a Mock Interview to test your communication");
        learningPath.push("Complete a Skill Evaluation for validation");
    }

    const projectIdeas = roadmapProgress.length > 0
        ? [`Build a ${aspiration || ''} project using ${roadmapProgress[0].roadmapId} skills`, "Enhance your portfolio with current progress"]
        : ["Start your first project once you begin a roadmap"];

    const jobMatches = roadmapProgress.some(p => p.isFinished)
        ? ["Junior Developer Roles", "Internships"]
        : ["Focus on completing roadmaps to unlock job matches"];

    return { learningPath, projectIdeas, jobMatches };
}
