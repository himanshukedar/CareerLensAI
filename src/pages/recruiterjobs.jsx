import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Plus, Briefcase, MapPin, Users, Trash2, X, Video, Loader2, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import RecruiterSidebar from '../components/RecruiterSidebar';
import AnimatedPage from '../components/AnimatedPage';
import toast from 'react-hot-toast';
import './RecruiterJobs.css';

export default function RecruiterJobs() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [startingCallFor, setStartingCallFor] = useState(null);
    const [newJob, setNewJob] = useState({
        title: '',
        description: '',
        requirements: '',
        location: 'Remote',
        salaryRange: ''
    });

    const fetchJobs = async () => {
        try {
            const res = await api.get('/recruiter/jobs');
            setJobs(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newJob.title.trim()) return toast.error('Job title is required.');
        if (!newJob.description.trim()) return toast.error('Job description is required.');
        if (!newJob.requirements.trim()) return toast.error('Requirements are required.');

        try {
            const reqArray = newJob.requirements.split(',').map(s => s.trim()).filter(Boolean);
            await api.post('/recruiter/jobs', { ...newJob, requirements: reqArray });
            setShowModal(false);
            setNewJob({ title: '', description: '', requirements: '', location: 'Remote', salaryRange: '' });
            toast.success('Job vacancy published successfully!');
            fetchJobs();
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.msg || 'Failed to create job. Please try again.';
            toast.error(msg);
        }
    };

    const handleStartInterview = async (job) => {
        setStartingCallFor(job._id);
        try {
            const res = await api.post('/videocall/generate-room');
            const { roomId } = res.data;
            toast.success(`Interview room created! Share the link with your candidate.`);
            navigate(`/video-call/${roomId}`);
        } catch (err) {
            console.error(err);
            toast.error('Failed to create interview room.');
        } finally {
            setStartingCallFor(null);
        }
    };

    const handleDelete = async (id) => {
        toast((t) => (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span>Delete this vacancy?</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        style={{ background: '#ef4444', border: 'none', color: '#fff', padding: '4px 12px', borderRadius: '6px', cursor: 'pointer' }}
                        onClick={async () => {
                            toast.dismiss(t.id);
                            try {
                                await api.delete(`/recruiter/jobs/${id}`);
                                toast.success('Vacancy deleted successfully.');
                                fetchJobs();
                            } catch (err) {
                                const msg = err.response?.data?.msg || 'Failed to delete job.';
                                toast.error(msg);
                                console.error(err);
                            }
                        }}
                    >
                        Yes, Delete
                    </button>
                    <button
                        style={{ background: 'transparent', border: '1px solid #555', color: '#ccc', padding: '4px 12px', borderRadius: '6px', cursor: 'pointer' }}
                        onClick={() => toast.dismiss(t.id)}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        ), { duration: 8000 });
    };

    const downloadExcel = (job) => {
        if (!job.applicants || job.applicants.length === 0) {
            return toast.error("No applicants to export for this job.");
        }

        const headers = ["Name", "Email", "Phone", "Headline", "Skills", "AI Skill Score", "Status", "Applied At"];
        const rows = job.applicants.map(app => {
            const user = app.userId || {};
            
            // Extract the highest AI Skill Evaluation Score
            let skillScore = 'N/A';
            if (user.assessments && user.assessments.length > 0) {
                const evalScores = user.assessments
                    .filter(a => a.type === 'skill_evaluation')
                    .map(a => a.score);
                if (evalScores.length > 0) {
                    skillScore = Math.max(...evalScores) + '%';
                }
            }

            return [
                `"${user.name || 'Unknown'}"`,
                `"${user.email || 'N/A'}"`,
                `"${user.phone || 'N/A'}"`,
                `"${user.headline || 'N/A'}"`,
                `"${(user.skills || []).join(', ')}"`,
                `"${skillScore}"`,
                `"${app.status}"`,
                `"${new Date(app.appliedAt).toLocaleDateString()}"`
            ].join(',');
        });

        const csvContent = [headers.join(','), ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', `${job.title.replace(/\s+/g, '_')}_Applicants.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Excel sheet downloaded!");
    };

    return (
        <div className="recruiter-layout">
            <RecruiterSidebar user={user} onLogout={logout} />

            <AnimatedPage className="recruiter-content">
                <header className="content-header">
                    <div>
                        <h1 className="welcome-text">My Vacancies</h1>
                        <p className="welcome-sub">Manage active job listings and review applicants.</p>
                    </div>
                    <button onClick={() => setShowModal(true)} className="neon-btn">
                        <Plus size={18} style={{ marginRight: '8px' }} /> Post New Job
                    </button>
                </header>

                <div className="jobs-list-grid">
                    {jobs.length > 0 ? jobs.map(job => (
                        <Motion.div
                            key={job._id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-panel job-manage-card"
                        >
                            <div className="card-top">
                                <div>
                                    <h3 className="job-title">{job.title}</h3>
                                    <div className="job-meta">
                                        <span><MapPin size={14} /> {job.location}</span>
                                        <span><Briefcase size={14} /> {job.salaryRange || 'N/A'}</span>
                                    </div>
                                </div>
                                <button onClick={() => handleDelete(job._id)} className="delete-btn-circ">
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <p className="job-desc-short">{job.description.substring(0, 100)}...</p>

                            <div className="card-footer-manage">
                                <div className="applicants-count">
                                    <Users size={16} color="var(--primary)" />
                                    <span>{job.applicants?.length || 0} Applicants</span>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button className="outline-btn-sm" onClick={() => downloadExcel(job)} title="Download Applicants Excel">
                                        <Download size={14} /> Export
                                    </button>
                                    <button
                                        className="start-interview-btn"
                                        onClick={() => handleStartInterview(job)}
                                        disabled={startingCallFor === job._id}
                                    >
                                        {startingCallFor === job._id
                                            ? <Loader2 size={14} className="btn-spinner" />
                                            : <Video size={14} />}
                                        {startingCallFor === job._id ? 'Creating...' : 'Start Interview'}
                                    </button>
                                </div>
                            </div>
                        </Motion.div>
                    )) : (
                        <div className="empty-state">
                            <Briefcase size={48} opacity={0.2} />
                            <p>No active vacancies found.</p>
                        </div>
                    )}
                </div>

                <AnimatePresence>
                    {showModal && (
                        <Motion.div
                            className="modal-backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <Motion.div
                                className="glass-panel job-modal"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                            >
                                <div className="modal-head">
                                    <h3>Create New Opening</h3>
                                    <button onClick={() => setShowModal(false)} className="close-btn"><X /></button>
                                </div>
                                <form onSubmit={handleSubmit} className="job-form">
                                    <input
                                        type="text"
                                        placeholder="Job Title (e.g. Senior React Developer)"
                                        value={newJob.title}
                                        onChange={e => setNewJob({ ...newJob, title: e.target.value })}
                                        required
                                    />
                                    <textarea
                                        placeholder="Full Job Description..."
                                        rows="4"
                                        value={newJob.description}
                                        onChange={e => setNewJob({ ...newJob, description: e.target.value })}
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Requirements (comma separated: React, Node.js, CSS)"
                                        value={newJob.requirements}
                                        onChange={e => setNewJob({ ...newJob, requirements: e.target.value })}
                                        required
                                    />
                                    <div className="form-row">
                                        <input
                                            type="text"
                                            placeholder="Location"
                                            value={newJob.location}
                                            onChange={e => setNewJob({ ...newJob, location: e.target.value })}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Salary Range"
                                            value={newJob.salaryRange}
                                            onChange={e => setNewJob({ ...newJob, salaryRange: e.target.value })}
                                        />
                                    </div>
                                    <button type="submit" className="neon-btn full-width">Publish Vacancy</button>
                                </form>
                            </Motion.div>
                        </Motion.div>
                    )}
                </AnimatePresence>
            </AnimatedPage>
        </div>
    );
}
