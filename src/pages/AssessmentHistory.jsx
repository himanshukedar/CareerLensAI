import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import AnimatedPage from '../components/AnimatedPage';
import { FileText, ArrowLeft, X, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './AssessmentHistory.css';

export default function AssessmentHistory() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [selectedReport, setSelectedReport] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/auth/me');
                setProfile(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchProfile();
    }, []);

    if (!profile) return <div className="loader-container">Loading Reports...</div>;

    const assessments = profile.assessments?.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt)) || [];

    return (
        <AnimatedPage className="assessment-history-page container">
            <div className="history-header">
                <button className="back-link" onClick={() => navigate('/profile')}>
                    <ArrowLeft size={16} /> Back to Profile
                </button>
                <h2>Deep Assessment & Analytics</h2>
                <p style={{ color: 'var(--text-muted)' }}>Detailed breakdown of all your technical interviews and skill evaluations.</p>
            </div>

            {assessments.length === 0 ? (
                <div className="no-history glass-panel">
                    <FileText size={64} style={{ opacity: 0.5 }} />
                    <h3>No Assessment Data Found</h3>
                    <p>Complete a mock interview or skill evaluation to unlock your analytics report.</p>
                    <button className="neon-btn" onClick={() => navigate('/mock-interview')}>Take Mock Interview</button>
                </div>
            ) : (
                <div className="history-grid">
                    {assessments.map((asmt, idx) => (
                        <div key={idx} className="history-card glass-panel" onClick={() => setSelectedReport(asmt)}>
                            <div className="history-card-header">
                                <span className={`history-type ${asmt.type === 'skill_evaluation' ? 'skill-eval-type' : ''}`}>
                                    {asmt.type === 'mock_interview' ? 'INTERVIEW' : 'EVALUATION'}
                                </span>
                                <span className="history-date">{new Date(asmt.completedAt).toLocaleDateString()}</span>
                            </div>
                            <h3 className="history-title">{asmt.category.toUpperCase()} Session</h3>
                            
                            <div className="history-score-display">
                                <div className="score-box">
                                    <p>TECH SCORE</p>
                                    <h4>{asmt.aiInsights?.technicalScore || asmt.score}%</h4>
                                </div>
                                <div className="score-box">
                                    <p>CONFIDENCE</p>
                                    <h4>{asmt.metrics?.confidence || asmt.aiInsights?.softSkillsScore || 'N/A'}%</h4>
                                </div>
                            </div>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {asmt.aiInsights?.emotionalFeedback || 'Click to view full structured report...'}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {selectedReport && (
                <div className="report-modal-overlay" onClick={() => setSelectedReport(null)}>
                    <div className="report-modal" onClick={e => e.stopPropagation()}>
                        <div className="report-modal-head">
                            <h3>{selectedReport.category.toUpperCase()} - Final Assessment Report</h3>
                            <button className="report-modal-close" onClick={() => setSelectedReport(null)}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className="report-scores-summary" style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
                            <div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0 0 0.5rem 0' }}>Technical Proficiency</p>
                                <h2 style={{ margin: 0, color: 'var(--primary)', fontSize: '2.5rem' }}>{selectedReport.aiInsights?.technicalScore || selectedReport.score}%</h2>
                            </div>
                            <div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0 0 0.5rem 0' }}>Behavioral Profile</p>
                                <h2 style={{ margin: 0, color: 'var(--secondary)', fontSize: '2.5rem' }}>{selectedReport.aiInsights?.softSkillsScore || selectedReport.metrics?.confidence || 'N/A'}%</h2>
                            </div>
                        </div>

                        <div className="report-feedback-section">
                            <h4>Session Verdict</h4>
                            <p style={{ color: 'var(--text-main)', lineHeight: 1.6 }}>{selectedReport.aiInsights?.emotionalFeedback || 'Automated behavioral logging did not capture advanced emotional feedback for this run.'}</p>
                        </div>

                        <div className="feedback-lists">
                            <div className="feedback-box">
                                <h5><CheckCircle size={16} style={{ verticalAlign: 'text-bottom', marginRight: '5px' }} /> What You Did Well</h5>
                                {selectedReport.aiInsights?.strengths?.length > 0 ? (
                                    <ul>
                                        {selectedReport.aiInsights.strengths.map((str, i) => <li key={i}>{str}</li>)}
                                    </ul>
                                ) : (
                                    <p style={{ opacity: 0.5, fontSize: '0.9rem' }}>No key strengths flagged in this run.</p>
                                )}
                            </div>
                            <div className="feedback-box negative">
                                <h5><XCircle size={16} style={{ verticalAlign: 'text-bottom', marginRight: '5px' }} /> Areas for Improvement</h5>
                                {selectedReport.aiInsights?.weaknesses?.length > 0 ? (
                                    <ul>
                                        {selectedReport.aiInsights.weaknesses.map((wk, i) => <li key={i}>{wk}</li>)}
                                    </ul>
                                ) : (
                                    <p style={{ opacity: 0.5, fontSize: '0.9rem' }}>No major weaknesses flagged in this run.</p>
                                )}
                            </div>
                        </div>

                        {selectedReport.aiInsights?.nextRoadmapStep && (
                            <div className="next-steps-banner">
                                <h4>Recommended Next Step</h4>
                                <p>{selectedReport.aiInsights.nextRoadmapStep}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </AnimatedPage>
    );
}
