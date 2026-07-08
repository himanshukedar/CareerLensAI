import React, { useState, useEffect } from 'react';
import { Shield, Users, Activity, MessageSquare, Trash2, UserPlus, Cpu, Zap, Radio, Database, Server, Key, LogOut, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AnimatedPage from '../components/AnimatedPage';
import api from '../api/api';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import './admindashboard.css';

export default function AdminDashboard() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState(null);
    const [students, setStudents] = useState([]);
    const [recruiters, setRecruiters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' });
    const [showAdminModal, setShowAdminModal] = useState(false);
    const [trainStatus, setTrainStatus] = useState({});

    useEffect(() => {
        fetchStats();
        fetchUsers();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await api.get('/admin/stats');
            setStats(res.data);
        } catch (err) {
            toast.error('Failed to fetch system stats');
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await api.get('/admin/users');
            setStudents(res.data.students);
            setRecruiters(res.data.recruiters);
            setLoading(false);
        } catch (err) {
            toast.error('Failed to fetch user data');
            setLoading(false);
        }
    };

    const deleteUser = async (id) => {
        if (!window.confirm('Are you sure? This action is irreversible.')) return;
        try {
            await api.delete(`/admin/user/${id}`);
            toast.success('User purged from biological records.');
            fetchUsers();
            fetchStats();
        } catch (err) {
            toast.error('Purge failed. External interference detected.');
        }
    };

    const downloadStudentReport = (student) => {
        const doc = new jsPDF();
        let y = 20;
        doc.setFontSize(22);
        doc.text(`Student Profile & Detailed Report`, 14, y);
        y += 15;
        
        doc.setFontSize(14);
        doc.text(`Personal Information`, 14, y);
        y += 8;
        doc.setFontSize(11);
        doc.text(`Name: ${student.name}    Email: ${student.email}`, 14, y);
        y += 6;
        if (student.phone) { doc.text(`Phone: ${student.phone}`, 14, y); y += 6; }
        if (student.headline) { doc.text(`Headline: ${student.headline}`, 14, y); y += 6; }
        if (student.aspiration) { doc.text(`Aspiration: ${student.aspiration}`, 14, y); y += 6; }
        doc.text(`Platform Ranking: ${student.ranking}%    Trust Score: ${student.trustScore}/100`, 14, y);
        y += 12;

        if (student.skills && student.skills.length > 0) {
            if (y > 260) { doc.addPage(); y = 20; }
            doc.setFontSize(14);
            doc.text(`Skills`, 14, y);
            y += 8;
            doc.setFontSize(11);
            const skillsText = doc.splitTextToSize(student.skills.join(', '), 180);
            doc.text(skillsText, 14, y);
            y += skillsText.length * 6 + 6;
        }

        if (student.assessments && student.assessments.length > 0) {
            if (y > 260) { doc.addPage(); y = 20; }
            doc.setFontSize(14);
            doc.text(`Assessments & Interviews`, 14, y);
            y += 8;
            doc.setFontSize(11);
            student.assessments.forEach(a => {
                if (y > 270) { doc.addPage(); y = 20; }
                doc.text(`- ${a.type.replace('_', ' ').toUpperCase()}: ${a.category || 'General'} | Score: ${a.score}/100`, 14, y);
                y += 6;
            });
            y += 6;
        }

        if (student.roadmapProgress && student.roadmapProgress.length > 0) {
            if (y > 260) { doc.addPage(); y = 20; }
            doc.setFontSize(14);
            doc.text(`Roadmap Progress`, 14, y);
            y += 8;
            doc.setFontSize(11);
            student.roadmapProgress.forEach(rp => {
                if (y > 270) { doc.addPage(); y = 20; }
                doc.text(`- Path: ${rp.roadmapId.toUpperCase()} | Finished: ${rp.isFinished ? 'Yes' : 'No'} | Nodes Completed: ${rp.completedNodes?.length || 0}`, 14, y);
                y += 6;
            });
            y += 6;
        }

        if (student.education && student.education.length > 0) {
            if (y > 260) { doc.addPage(); y = 20; }
            doc.setFontSize(14);
            doc.text(`Education`, 14, y);
            y += 8;
            doc.setFontSize(11);
            student.education.forEach(e => {
                if (y > 270) { doc.addPage(); y = 20; }
                doc.text(`- ${e.level || ''} in ${e.course || ''} from ${e.institution || ''} (${e.year || ''}) - ${e.percentage || ''}`, 14, y);
                y += 6;
            });
            y += 6;
        }
        
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text(`Note: This is an auto-generated system report by CareerLens AI.`, 14, 280);
        doc.save(`Student_Report_${student.name.replace(/\s+/g, '_')}.pdf`);
        toast.success("Student PDF Report Generated");
    };

    const downloadRecruiterReport = (recruiter) => {
        const doc = new jsPDF();
        let y = 20;
        doc.setFontSize(22);
        doc.text(`Recruiter Profile & Activity Report`, 14, y);
        y += 15;
        
        doc.setFontSize(14);
        doc.text(`Organization Details`, 14, y);
        y += 8;
        doc.setFontSize(11);
        doc.text(`Name: ${recruiter.name}    Email: ${recruiter.email}`, 14, y);
        y += 6;
        doc.text(`Company: ${recruiter.companyName || 'Not Specified'}`, 14, y);
        y += 6;
        if (recruiter.companyWebsite) { doc.text(`Website: ${recruiter.companyWebsite}`, 14, y); y += 6; }
        if (recruiter.phone) { doc.text(`Phone: ${recruiter.phone}`, 14, y); y += 6; }
        
        doc.text(`Market Index: ${recruiter.ranking} pts    Integrity: ${recruiter.integrity}%`, 14, y);
        y += 12;

        if (recruiter.jobs && recruiter.jobs.length > 0) {
            if (y > 260) { doc.addPage(); y = 20; }
            doc.setFontSize(14);
            doc.text(`Active Job Postings (${recruiter.jobs.length})`, 14, y);
            y += 8;
            doc.setFontSize(11);
            
            recruiter.jobs.forEach(job => {
                if (y > 250) { doc.addPage(); y = 20; }
                doc.setFont(undefined, 'bold');
                doc.text(`- ${job.title} (${job.location || 'Remote'})`, 14, y);
                y += 6;
                doc.setFont(undefined, 'normal');
                doc.text(`  Salary: ${job.salaryRange || 'N/A'} | Applicants: ${job.applicants?.length || 0}`, 14, y);
                y += 6;
                if (job.requirements && job.requirements.length > 0) {
                    const reqText = doc.splitTextToSize(`  Requirements: ${job.requirements.join(', ')}`, 180);
                    doc.text(reqText, 14, y);
                    y += reqText.length * 6;
                }
                y += 4;
            });
        } else {
            doc.text(`No active job postings found for this recruiter.`, 14, y);
        }
        
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text(`Note: This is an auto-generated system report by CareerLens AI.`, 14, 280);
        doc.save(`Recruiter_Report_${recruiter.name.replace(/\s+/g, '_')}.pdf`);
        toast.success("Recruiter PDF Report Generated");
    };

    const handleAddAdmin = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/register', newAdmin);
            toast.success('New operator added to the network.');
            setShowAdminModal(false);
            setNewAdmin({ name: '', email: '', password: '' });
            fetchStats();
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Registration failed.');
        }
    };

    const triggerTraining = async (agent) => {
        setTrainStatus({ ...trainStatus, [agent]: 'Initializing...' });
        try {
            await api.post('/admin/train', { agent });
            toast.success(`${agent} optimization sequences started.`);
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.floor(Math.random() * 20);
                if (progress >= 100) {
                    progress = 100;
                    setTrainStatus({ ...trainStatus, [agent]: '100% - Optimized' });
                    clearInterval(interval);
                } else {
                    setTrainStatus({ ...trainStatus, [agent]: `${progress}% - Syncing...` });
                }
            }, 500);
        } catch (err) {
            setTrainStatus({ ...trainStatus, [agent]: 'FAILED' });
            toast.error('Neural link severed.');
        }
    };

    return (
        <AnimatedPage className="admin-dashboard">
            <div className="admin-header">
                <div>
                    <div className="admin-title">SYSTEM CONTROL DECK</div>
                    <p style={{ opacity: 0.5, fontSize: '0.8rem' }}>Welcome, Operator [{user?.name || 'Admin'}]</p>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button className="glow-btn" onClick={() => setShowAdminModal(true)}><UserPlus size={16} /> Deploy Admin</button>
                    <button className="glow-btn" style={{ borderColor: '#ff4444', color: '#ff4444' }} onClick={() => { localStorage.removeItem('token'); window.location.href = '/'; }}><LogOut size={16} /> Terminate Session</button>
                </div>
            </div>

            <div className="admin-tabs">
                <button className={`admin-tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}><Activity size={18} /> Overview</button>
                <button className={`admin-tab ${activeTab === 'students' ? 'active' : ''}`} onClick={() => setActiveTab('students')}><Users size={18} /> Students</button>
                <button className={`admin-tab ${activeTab === 'recruiters' ? 'active' : ''}`} onClick={() => setActiveTab('recruiters')}><Zap size={18} /> Recruiters</button>
                <button className={`admin-tab ${activeTab === 'ai' ? 'active' : ''}`} onClick={() => setActiveTab('ai')}><Cpu size={18} /> AI Training</button>
                <button className={`admin-tab ${activeTab === 'system' ? 'active' : ''}`} onClick={() => setActiveTab('system')}><Server size={18} /> System</button>
            </div>

            {activeTab === 'overview' && stats && (
                <div>
                    <div className="stats-grid">
                        <StatCard label="Total Specimens" value={stats.userCount} icon={<Users />} />
                        <StatCard label="Corporate Entities" value={stats.recruiterCount} icon={<Zap />} />
                        <StatCard label="Active Nodes (Jobs)" value={stats.jobCount} icon={<Database />} />
                        <StatCard label="Level 1 Operators" value={stats.adminCount} icon={<Shield />} />
                    </div>
                    <div className="stats-grid">
                        <StatCard label="System Health" value={stats.systemHealth} icon={<Activity />} />
                        <StatCard label="Uptime" value={stats.uptime} icon={<Radio />} />
                        <StatCard label="Active AI Agents" value={stats.activeAgents} icon={<Cpu />} />
                    </div>
                </div>
            )}

            {activeTab === 'students' && (
                <div className="data-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Specimen Name</th>
                                <th>Email Address</th>
                                <th>Rank</th>
                                <th>Trust Score</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map(s => (
                                <tr key={s._id}>
                                    <td>{s.name}</td>
                                    <td style={{ opacity: 0.6 }}>{s.email}</td>
                                    <td><span className={`ranking-badge ${s.ranking > 70 ? 'ranking-high' : 'ranking-mid'}`}>{s.ranking}%</span></td>
                                    <td>{s.trustScore}/100</td>
                                    <td style={{ display: 'flex', gap: '5px' }}>
                                        <button className="glow-btn" style={{ padding: '5px', borderColor: 'var(--primary)', color: 'var(--primary)' }} onClick={() => downloadStudentReport(s)} title="Download Report"><Download size={14} /></button>
                                        <button className="glow-btn" style={{ padding: '5px', borderColor: '#ff4444' }} onClick={() => deleteUser(s._id)} title="Delete Specimen"><Trash2 size={14} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'recruiters' && (
                <div className="data-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Organization</th>
                                <th>Representative</th>
                                <th>Market Index</th>
                                <th>Integrity</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recruiters.map(r => (
                                <tr key={r._id}>
                                    <td>{r.companyName || 'N/A'}</td>
                                    <td>{r.name}</td>
                                    <td><span className={`ranking-badge ${r.ranking > 50 ? 'ranking-high' : 'ranking-mid'}`}>{r.ranking} pts</span></td>
                                    <td>{r.integrity}%</td>
                                    <td style={{ display: 'flex', gap: '5px' }}>
                                        <button className="glow-btn" style={{ padding: '5px', borderColor: 'var(--primary)', color: 'var(--primary)' }} onClick={() => downloadRecruiterReport(r)} title="Download Report"><Download size={14} /></button>
                                        <button className="glow-btn" style={{ padding: '5px', borderColor: '#ff4444' }} onClick={() => deleteUser(r._id)} title="Terminate Account"><Trash2 size={14} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'ai' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                    <div className="training-agent-card">
                        <h3><Cpu size={20} color="var(--primary)" /> Roadmap Oracle</h3>
                        <p style={{ fontSize: '0.85rem', opacity: 0.7, margin: '10px 0' }}>Neural network responsible for generating career paths and learning trajectories.</p>
                        <div className="progress-bar-bg">
                            <div className="progress-bar-fill" style={{ width: trainStatus['Roadmap']?.includes('100') ? '100%' : trainStatus['Roadmap'] ? '40%' : '0%' }}></div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.8rem' }}>{trainStatus['Roadmap'] || 'Standby'}</span>
                            <button className="glow-btn" onClick={() => triggerTraining('Roadmap')}>Optimize</button>
                        </div>
                    </div>

                    <div className="training-agent-card">
                        <h3><Cpu size={20} color="var(--secondary)" /> Interview Phantom</h3>
                        <p style={{ fontSize: '0.85rem', opacity: 0.7, margin: '10px 0' }}>Voice-enabled interviewer agent specializing in behavioral and technical analysis.</p>
                        <div className="progress-bar-bg">
                            <div className="progress-bar-fill" style={{ width: trainStatus['Interview']?.includes('100') ? '100%' : trainStatus['Interview'] ? '40%' : '0%' }}></div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.8rem' }}>{trainStatus['Interview'] || 'Standby'}</span>
                            <button className="glow-btn" onClick={() => triggerTraining('Interview')}>Optimize</button>
                        </div>
                    </div>

                    <div className="training-agent-card">
                        <Database size={24} color="var(--accent)" />
                        <h3>Feed Data Core</h3>
                        <p style={{ fontSize: '0.85rem', opacity: 0.7, margin: '10px 0' }}>Select dataset to injection into the main neural hive.</p>
                        <input type="file" style={{ display: 'none' }} id="feed-data" />
                        <button className="glow-btn" style={{ width: '100%', borderColor: 'var(--accent)', color: 'var(--accent)' }} onClick={() => document.getElementById('feed-data').click()}>Upload Dataset (.json)</button>
                    </div>
                </div>
            )}

            {activeTab === 'system' && (
                <div style={{ maxWidth: '600px' }}>
                    <div className="training-agent-card">
                        <h3><Shield size={20} /> Force Maintenance Mode</h3>
                        <p style={{ opacity: 0.6, fontSize: '0.9rem', marginBottom: '15px' }}>Sever all external connections and place the system in a locked state for kernel updates.</p>
                        <button className="glow-btn" style={{ width: '100%', borderColor: '#ff4444', color: '#ff4444' }}>Initiate Kill Switch</button>
                    </div>
                    <div className="training-agent-card">
                        <h3><Key size={20} /> Auth Override</h3>
                        <p style={{ opacity: 0.6, fontSize: '0.9rem', marginBottom: '15px' }}>Enter a specimen ID to bypass authentication and view the ecosystem through their lens.</p>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input className="input-futuristic" placeholder="Node ID..." style={{ marginBottom: 0 }} />
                            <button className="glow-btn">Engage</button>
                        </div>
                    </div>
                </div>
            )}

            {showAdminModal && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal">
                        <h2 style={{ marginBottom: '20px' }}>DEPLOY NEW OPERATOR</h2>
                        <form onSubmit={handleAddAdmin}>
                            <input className="input-futuristic" placeholder="Full Name" value={newAdmin.name} onChange={e => setNewAdmin({ ...newAdmin, name: e.target.value })} required />
                            <input className="input-futuristic" placeholder="Email Address" type="email" value={newAdmin.email} onChange={e => setNewAdmin({ ...newAdmin, email: e.target.value })} required />
                            <input className="input-futuristic" placeholder="Access Cipher" type="password" value={newAdmin.password} onChange={e => setNewAdmin({ ...newAdmin, password: e.target.value })} required />
                            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                <button type="button" className="glow-btn" style={{ flex: 1, borderColor: '#666', color: '#666' }} onClick={() => setShowAdminModal(false)}>Abort</button>
                                <button type="submit" className="glow-btn" style={{ flex: 1 }}>Confirm Deployment</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AnimatedPage>
    );
}

const StatCard = ({ label, value, icon }) => (
    <div className="stat-card">
        <div style={{ color: 'var(--primary)', marginBottom: '10px' }}>{icon}</div>
        <span className="stat-value">{value}</span>
        <span className="stat-label">{label}</span>
    </div>
);
