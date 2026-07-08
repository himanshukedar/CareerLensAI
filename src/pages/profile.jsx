import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import GlitchText from '../components/GlitchText';
import AnimatedPage from '../components/AnimatedPage';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { User, FileText, Target, Award, Edit2, Save, X, Zap, ShieldAlert, Phone, GraduationCap, Plus, Trash2, CheckCircle, Mail, Download, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import './profile.css';

export default function Profile() {
    const { user, setUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [tokens, setTokens] = useState([]); // Restored state
    const [isEditing, setIsEditing] = useState(false);
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otpCode, setOtpCode] = useState('');
    const [tempPhone, setTempPhone] = useState('');

    const [formData, setFormData] = useState({
        headline: '',
        aspiration: '',
        phone: '',
        resume: '',
        strengths: '',
        weaknesses: '',
        opportunities: '',
        threats: '',
        education: [],
        certifications: []
    });

    useEffect(() => {
        fetchProfile();
        fetchTokens(); // Restored call
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/auth/me');
            setProfile(res.data);
            setFormData({
                headline: res.data.headline || '',
                aspiration: res.data.aspiration || '',
                phone: res.data.phone || '',
                resume: res.data.resume || '',
                strengths: res.data.swot?.strengths?.join(', ') || '',
                weaknesses: res.data.swot?.weaknesses?.join(', ') || '',
                opportunities: res.data.swot?.opportunities?.join(', ') || '',
                threats: res.data.swot?.threats?.join(', ') || '',
                education: res.data.education || [],
                certifications: res.data.certifications || []
            });
        } catch (err) {
            console.error(err);
        }
    };

    const fetchTokens = async () => {
        try {
            const res = await api.get('/auth/tokens');
            setTokens(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSave = async () => {
        try {
            const swot = {
                strengths: formData.strengths.split(',').map(s => s.trim()).filter(Boolean),
                weaknesses: formData.weaknesses.split(',').map(s => s.trim()).filter(Boolean),
                opportunities: formData.opportunities.split(',').map(s => s.trim()).filter(Boolean),
                threats: formData.threats.split(',').map(s => s.trim()).filter(Boolean)
            };

            const payload = {
                headline: formData.headline,
                aspiration: formData.aspiration,
                phone: formData.phone,
                resume: formData.resume,
                swot,
                education: formData.education,
                certifications: formData.certifications
            };

            const res = await api.put('/auth/profile', payload);
            setProfile(res.data);
            setUser(res.data); // Update global user state for the guard
            setIsEditing(false);
            toast.success('Profile Synced Successfully!');
        } catch (err) {
            toast.error('Failed to sync profile');
        }
    };

    const handleRequestOtp = async () => {
        if (!formData.phone) return toast.error('Enter phone number first');
        try {
            await api.post('/auth/request-otp', { phone: formData.phone });
            setTempPhone(formData.phone);
            setShowOtpModal(true);
            toast.success('Check console for mock OTP!');
        } catch (err) {
            toast.error('Failed to send OTP');
        }
    };

    const handleVerifyOtp = async () => {
        try {
            const res = await api.post('/auth/verify-otp', { code: otpCode });
            setProfile(res.data.user);
            setUser(res.data.user);
            setShowOtpModal(false);
            setOtpCode('');
            toast.success('Identity Verified!');
        } catch (err) {
            toast.error('Invalid OTP');
        }
    };

    const addEducation = () => {
        setFormData({
            ...formData,
            education: [...formData.education, { level: '10th Std', institution: '', year: '', percentage: '', proofUrl: '', semesters: ['', '', '', '', '', '', '', ''] }]
        });
    };

    const removeEducation = (index) => {
        const list = [...formData.education];
        list.splice(index, 1);
        setFormData({ ...formData, education: list });
    };

    const updateEducation = (index, field, value) => {
        const list = [...formData.education];
        list[index][field] = value;
        if (field === 'level' && ['Undergraduate (UG)', 'Diploma', 'Postgraduate (PG)'].includes(value) && !list[index].semesters) {
             list[index].semesters = ['', '', '', '', '', '', '', ''];
        }
        setFormData({ ...formData, education: list });
    };

    const updateSemester = (eduIndex, semIndex, value) => {
        const list = [...formData.education];
        if (!list[eduIndex].semesters) {
             list[eduIndex].semesters = ['', '', '', '', '', '', '', ''];
        }
        list[eduIndex].semesters[semIndex] = value;
        setFormData({ ...formData, education: list });
    };

    const addCertification = () => {
        setFormData({
            ...formData,
            certifications: [...formData.certifications, { title: '', organization: '', date: '', proofUrl: '' }]
        });
    };

    const removeCertification = (index) => {
        const list = [...formData.certifications];
        list.splice(index, 1);
        setFormData({ ...formData, certifications: list });
    };

    const updateCertification = (index, field, value) => {
        const list = [...formData.certifications];
        list[index][field] = value;
        setFormData({ ...formData, certifications: list });
    };

    const handleFileUpload = (e, index, type) => {
        const file = e.target.files[0];
        if (!file) return;
        
        if (file.size > 2 * 1024 * 1024) {
            return toast.error("File size must be under 2MB");
        }
        
        toast.loading("Processing file...", { id: "upload" });
        const reader = new FileReader();
        reader.onloadend = () => {
            if (type === 'education') {
                updateEducation(index, 'proofUrl', reader.result);
            } else if (type === 'certification') {
                updateCertification(index, 'proofUrl', reader.result);
            }
            toast.success("Proof Attached & Ready to Save", { id: "upload" });
        };
        reader.onerror = () => {
            toast.error("Failed to read file", { id: "upload" });
        };
        reader.readAsDataURL(file);
    };

    if (!profile) return <div className="loader-container">Initialising Your Profile...</div>;

    const generatePDFReport = () => {
        if (!profile) return toast.error("Profile not available");
        
        toast.loading("Generating Report...", { id: "pdf" });
        const doc = new jsPDF();
        let yPos = 20;
        
        const addSectionTitle = (title) => {
            doc.setFontSize(16);
            doc.setTextColor(0, 102, 204);
            doc.setFont("helvetica", "bold");
            doc.text(title, 14, yPos);
            yPos += 8;
        };

        const addText = (text, isBold = false) => {
            doc.setFontSize(11);
            doc.setTextColor(50, 50, 50);
            doc.setFont("helvetica", isBold ? "bold" : "normal");
            const splitText = doc.splitTextToSize(text, 180);
            
            if (yPos + (splitText.length * 6) > 280) {
                doc.addPage();
                yPos = 20;
            }
            
            doc.text(splitText, 14, yPos);
            yPos += splitText.length * 6 + 2;
        };

        doc.setFontSize(22);
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "bold");
        doc.text("CareerLens AI - Personal Profile & Progress Report", 14, yPos);
        yPos += 12;

        addSectionTitle("1. Basic Information");
        addText(`Name: ${user.name}`);
        addText(`Email: ${user.email}`);
        addText(`Phone: ${profile.phone || 'N/A'}`);
        addText(`Headline: ${profile.headline || 'N/A'}`);
        addText(`Aspiration: ${profile.aspiration || 'N/A'}`);
        yPos += 5;

        addSectionTitle("2. Educational Background");
        if (profile.education && profile.education.length > 0) {
            profile.education.forEach((edu) => {
                addText(`- ${edu.level} in ${edu.course || 'General'} from ${edu.institution} (${edu.year}) - Score: ${edu.percentage}%`);
            });
        } else {
            addText("No education data available.");
        }
        yPos += 5;

        addSectionTitle("3. Certifications & Achievements");
        if (profile.certifications && profile.certifications.length > 0) {
            profile.certifications.forEach((cert) => {
                addText(`- ${cert.title} by ${cert.organization} (${cert.date})`);
            });
        }
        if (tokens && tokens.length > 0) {
            addText(`Unlocked Badges / Tokens:`, true);
            tokens.forEach(token => {
                let displayTitle = token.title
                    .replace(/Completer/g, 'Roadmap Master')
                    .replace(/Communicator/g, 'Interview Ace')
                    .replace(/Expert/g, 'Skill Verified');
                addText(`  * ${displayTitle} (Earned: ${new Date(token.issuedAt).toLocaleDateString()})`);
            });
        }
        if (!profile.certifications?.length && !tokens?.length) {
             addText("No certifications or badges available.");
        }
        yPos += 5;

        addSectionTitle("4. Career SWOT Analysis");
        addText(`Strengths: ${(profile.swot?.strengths || []).join(', ') || 'N/A'}`);
        addText(`Weaknesses: ${(profile.swot?.weaknesses || []).join(', ') || 'N/A'}`);
        addText(`Opportunities: ${(profile.swot?.opportunities || []).join(', ') || 'N/A'}`);
        addText(`Threats: ${(profile.swot?.threats || []).join(', ') || 'N/A'}`);
        yPos += 5;

        addSectionTitle("5. Assessment & Skill Progress");
        if (profile.assessments && profile.assessments.length > 0) {
            profile.assessments.sort((a,b) => new Date(b.completedAt) - new Date(a.completedAt)).forEach((asmt) => {
                const asmtType = asmt.type === 'mock_interview' ? 'INTERVIEW' : 'SKILL EVALUATION';
                const mainScore = asmt.aiInsights?.technicalScore || asmt.score || 'N/A';
                addText(`- ${asmt.category.toUpperCase()} (${asmtType}) on ${new Date(asmt.completedAt).toLocaleDateString()}`, true);
                addText(`  Technical Depth Score: ${mainScore}% | Confidence: ${asmt.metrics?.confidence || 'N/A'}%`);
                addText(`  Feedback: ${asmt.aiInsights?.emotionalFeedback || 'No detailed feedback.'}`);
                yPos += 2;
            });
        } else {
            addText("No assessments completed yet.");
        }

        yPos += 15;
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        doc.text("Report automatically generated by CareerLens AI.", 14, yPos);

        doc.save(`${user.name.replace(/\s+/g, '_')}_Career_Report.pdf`);
        toast.success("Report Downloaded Successfully", { id: "pdf" });
    };

    // Calculate Progress
    const progressItems = [
        profile.headline,
        profile.aspiration,
        profile.isVerifiedPhone,
        profile.education?.length > 0,
        profile.swot?.strengths?.length > 0
    ];
    const progressPercent = Math.round((progressItems.filter(Boolean).length / progressItems.length) * 100);

    return (
        <AnimatedPage className="profile-container container">
            {/* Completion Progress */}
            <div className="profile-progress-section glass-panel">
                <div className="flex-between">
                    <span>Profile Strength: {progressPercent}%</span>
                    {profile.isProfileComplete ?
                        <span className="verified-badge"><CheckCircle size={14} /> ELIGIBLE FOR ALL SERVICES</span> :
                        <span className="unverified-badge" style={{ textDecoration: 'none' }}>RECRUITER VISIBILITY: LOW</span>
                    }
                </div>
                <div className="profile-progress-bar">
                    <div className="profile-progress-fill" style={{ width: `${progressPercent}%` }}></div>
                </div>
                {!profile.isProfileComplete && (
                    <p className="polite-msg" style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
                        "We require your details in order to make your profile strong and future bright."
                    </p>
                )}
            </div>

            <div className="profile-header glass-panel">
                <div className="profile-avatar">
                    {profile.isProfileComplete ? <Award size={64} color="var(--matrix)" /> : <User size={64} color="var(--primary)" />}
                </div>
                <div className="profile-info">
                    <GlitchText text={user.name} />
                    <div className="profile-meta">
                        {isEditing ? (
                            <div className="edit-row">
                                <input
                                    className="edit-input"
                                    value={formData.headline}
                                    onChange={e => setFormData({ ...formData, headline: e.target.value })}
                                    placeholder="Headline (e.g. Full Stack Architect)"
                                />
                                <input
                                    className="edit-input"
                                    value={formData.aspiration}
                                    onChange={e => setFormData({ ...formData, aspiration: e.target.value })}
                                    placeholder="Career Aspiration (e.g. Senior Lead)"
                                />
                            </div>
                        ) : (
                            <>
                                <p className="profile-headline">{profile.headline}</p>
                                {profile.aspiration && <p className="profile-aspiration"><Zap size={14} fill="var(--secondary)" stroke="none" /> Goal: {profile.aspiration}</p>}
                            </>
                        )}
                    </div>

                    <div className="contact-details">
                        <p className="profile-email"><Mail size={14} /> {user.email} <span className="verified-badge"><CheckCircle size={12} /> Verified</span></p>
                        <div className="phone-verification">
                            <Phone size={14} /> {isEditing ? (
                                <input
                                    className="edit-input small"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="Phone Number"
                                />
                            ) : (
                                <span>{profile.phone || 'No phone added'}</span>
                            )}
                            {!profile.isVerifiedPhone && !isEditing && profile.phone && (
                                <span className="unverified-badge" onClick={handleRequestOtp}>Verify Identity</span>
                            )}
                            {profile.isVerifiedPhone && <span className="verified-badge"><CheckCircle size={12} /> Secure</span>}
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <button className="neon-btn" onClick={generatePDFReport} style={{ background: 'var(--primary)', color: '#000', padding: '0.8rem 1.5rem' }}>
                        <Download size={18} /> PDF Report
                    </button>
                    <button className="neon-btn edit-btn" onClick={() => isEditing ? handleSave() : setIsEditing(true)}>
                        {isEditing ? <Save size={18} /> : <Edit2 size={18} />}
                        {isEditing ? ' Finalise' : ' Modify'}
                    </button>
                </div>
            </div>

            <div className="profile-grid">
                <div className="profile-section glass-panel">
                    <h3><GraduationCap size={20} /> Academic History & Qualifications</h3>
                    <div className="entry-list">
                        {(isEditing ? formData.education : profile.education).map((edu, idx) => (
                            <div key={idx} className="entry-card">
                                <div className="entry-main">
                                    {isEditing ? (
                                        <div className="edu-edit-grid">
                                            <select value={edu.level} onChange={e => updateEducation(idx, 'level', e.target.value)}>
                                                <option>10th Std</option>
                                                <option>12th Std / HSC</option>
                                                <option>Diploma</option>
                                                <option>Undergraduate (UG)</option>
                                                <option>Postgraduate (PG)</option>
                                                <option>PhD / Doctorate</option>
                                                <option>Professional Certificate</option>
                                            </select>
                                            <input placeholder="Major / Course Name (e.g. Science, CSE, MBA)" value={edu.course} onChange={e => updateEducation(idx, 'course', e.target.value)} />
                                            <input className="col-span-2" placeholder="Institution Name" value={edu.institution} onChange={e => updateEducation(idx, 'institution', e.target.value)} />
                                            <input placeholder="Year of Completion" value={edu.year} onChange={e => updateEducation(idx, 'year', e.target.value)} />
                                            <input placeholder="Percentage / CGPA" value={edu.percentage} onChange={e => updateEducation(idx, 'percentage', e.target.value)} />
                                            {['Undergraduate (UG)', 'Diploma', 'Postgraduate (PG)'].includes(edu.level) && (
                                                <div className="col-span-2" style={{ background: 'rgba(0, 243, 255, 0.05)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(0, 243, 255, 0.2)' }}>
                                                    <p style={{ color: 'var(--primary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Semester-wise CGPA Tracker</p>
                                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                                                        {Array.from({ length: edu.level === 'Diploma' ? 6 : edu.level === 'Postgraduate (PG)' ? 4 : 8 }).map((_, sIdx) => {
                                                            const semVal = edu.semesters ? edu.semesters[sIdx] : '';
                                                            return (
                                                                <input 
                                                                    key={sIdx}
                                                                    placeholder={`Sem ${sIdx + 1}`} 
                                                                    value={semVal || ''} 
                                                                    onChange={e => updateSemester(idx, sIdx, e.target.value)} 
                                                                    className="edit-input"
                                                                    style={{ margin: 0, padding: '0.5rem', textAlign: 'center' }}
                                                                />
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                            <div className="proof-upload-row col-span-2">
                                                <label className="edit-input file-upload-label" style={{ flex: 1, borderStyle: 'dashed', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', margin: 0 }}>
                                                    <input 
                                                        type="file" 
                                                        accept=".pdf,.png,.jpg,.jpeg" 
                                                        onChange={(e) => handleFileUpload(e, idx, 'education')} 
                                                        style={{ display: 'none' }}
                                                    />
                                                    <Upload size={18} /> 
                                                    <span>{edu.proofUrl ? 'Change Uploaded Proof' : 'Upload Proof (PDF/Image)'}</span>
                                                </label>
                                                {edu.proofUrl && (
                                                    <span className="verified-badge" style={{ whiteSpace: 'nowrap' }}><CheckCircle size={16} /> Attached</span>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <h4>{edu.level} - {edu.course || 'General Stream'}</h4>
                                            <p className="edu-institution">{edu.institution}</p>
                                            <div className="entry-details">Batch: {edu.year} | Performance: {edu.percentage}%</div>
                                            {['Undergraduate (UG)', 'Diploma', 'Postgraduate (PG)'].includes(edu.level) && edu.semesters && edu.semesters.some(s => s) && (
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
                                                    {edu.semesters.slice(0, edu.level === 'Diploma' ? 6 : edu.level === 'Postgraduate (PG)' ? 4 : 8).map((sem, sIdx) => sem && (
                                                        <div key={sIdx} style={{ background: 'rgba(0, 243, 255, 0.1)', padding: '4px 8px', borderRadius: '4px', border: '1px solid rgba(0, 243, 255, 0.2)', fontSize: '0.8rem' }}>
                                                            Sem {sIdx + 1}: <strong style={{ color: 'var(--primary)' }}>{sem}</strong>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            {edu.proofUrl && <a href={edu.proofUrl} target="_blank" className="entry-proof"><FileText size={12} /> View Attached Proof</a>}
                                        </>
                                    )}
                                </div>
                                {isEditing && <button className="remove-entry" onClick={() => removeEducation(idx)}><Trash2 size={18} /></button>}
                            </div>
                        ))}
                    </div>
                    {isEditing && <button className="add-btn" onClick={addEducation}><Plus size={16} /> Add Educational Entry</button>}
                </div>

                {/* Certifications Section */}
                <div className="profile-section glass-panel">
                    <h3><FileText size={20} /> Professional Certifications</h3>
                    <div className="entry-list">
                        {(isEditing ? formData.certifications : profile.certifications).map((cert, idx) => (
                            <div key={idx} className="entry-card">
                                <div className="entry-main">
                                    {isEditing ? (
                                        <div className="edu-edit-grid">
                                            <input placeholder="Certificate Title" value={cert.title} onChange={e => updateCertification(idx, 'title', e.target.value)} />
                                            <input placeholder="Date Issued" value={cert.date} onChange={e => updateCertification(idx, 'date', e.target.value)} />
                                            <input className="col-span-2" placeholder="Issuing Organization" value={cert.organization} onChange={e => updateCertification(idx, 'organization', e.target.value)} />
                                            <div className="proof-upload-row col-span-2">
                                                <label className="edit-input file-upload-label" style={{ flex: 1, borderStyle: 'dashed', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', margin: 0 }}>
                                                    <input 
                                                        type="file" 
                                                        accept=".pdf,.png,.jpg,.jpeg" 
                                                        onChange={(e) => handleFileUpload(e, idx, 'certification')} 
                                                        style={{ display: 'none' }}
                                                    />
                                                    <Upload size={18} /> 
                                                    <span>{cert.proofUrl ? 'Change Uploaded Proof' : 'Upload Proof (PDF/Image)'}</span>
                                                </label>
                                                {cert.proofUrl && (
                                                    <span className="verified-badge" style={{ whiteSpace: 'nowrap' }}><CheckCircle size={16} /> Attached</span>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <h4>{cert.title}</h4>
                                            <p className="edu-institution">{cert.organization} | {cert.date}</p>
                                            {cert.proofUrl && <a href={cert.proofUrl} target="_blank" className="entry-proof"><FileText size={12} /> View Certificate</a>}
                                        </>
                                    )}
                                </div>
                                {isEditing && <button className="remove-entry" onClick={() => removeCertification(idx)}><Trash2 size={18} /></button>}
                            </div>
                        ))}
                    </div>
                    {isEditing && <button className="add-btn" onClick={addCertification}><Plus size={16} /> Add Certification</button>}
                </div>

                {/* SWOT Analysis */}
                <div className="profile-section glass-panel">
                    <h3><Target size={20} /> Career SWOT Analysis</h3>
                    <div className="swot-grid">
                        <SwotBox label="Strengths" color="var(--matrix)" isEditing={isEditing}
                            value={formData.strengths}
                            onChange={v => setFormData({ ...formData, strengths: v })}
                            items={profile.swot?.strengths} />
                        <SwotBox label="Weaknesses" color="var(--accent)" isEditing={isEditing}
                            value={formData.weaknesses}
                            onChange={v => setFormData({ ...formData, weaknesses: v })}
                            items={profile.swot?.weaknesses} />
                        <SwotBox label="Opportunities" color="var(--primary)" isEditing={isEditing}
                            value={formData.opportunities}
                            onChange={v => setFormData({ ...formData, opportunities: v })}
                            items={profile.swot?.opportunities} />
                        <SwotBox label="Threats" color="var(--secondary)" isEditing={isEditing}
                            value={formData.threats}
                            onChange={v => setFormData({ ...formData, threats: v })}
                            items={profile.swot?.threats} />
                    </div>
                </div>

                {/* Assessment History */}
                <div className="profile-section glass-panel">
                    <h3><FileText size={20} /> Assessment Report History</h3>
                    <div className="assessment-history">
                        {profile.assessments?.length === 0 ? (
                            <p className="placeholder-text">Complete an interview or evaluation to see reports.</p>
                        ) : (
                            <div className="reports-list">
                                {profile.assessments.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt)).map((asmt, idx) => (
                                    <div key={idx} className="report-item glass-panel">
                                        <div className="report-main">
                                            <div className="report-header">
                                                <span className="report-type">{asmt.type === 'mock_interview' ? 'INTERVIEW' : 'SKILL_EVAL'}</span>
                                                <span className="report-date">{new Date(asmt.completedAt).toLocaleDateString()}</span>
                                            </div>
                                            <h4>{asmt.category.toUpperCase()} Session</h4>
                                            <div className="report-scores">
                                                <div className="mini-score">
                                                    <span>TECH_DEPTH</span>
                                                    <strong>{asmt.aiInsights?.technicalScore || asmt.score}%</strong>
                                                </div>
                                                <div className="mini-score">
                                                    <span>CONFIDENCE</span>
                                                    <strong>{asmt.metrics?.confidence || 'N/A'}%</strong>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="report-feedback">
                                            <p>{asmt.aiInsights?.emotionalFeedback || 'No detailed feedback available for this session.'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Achievements */}
                <div className="profile-section glass-panel">
                    <h3><Award size={20} /> Career Achievement Badges</h3>
                    {tokens.length === 0 ? (
                        <p className="placeholder-text">Tokens are awarded upon roadmap completion.</p>
                    ) : (
                        <div className="tokens-grid">
                            {tokens.map(token => {
                                // Title Normalization for professional look
                                let displayTitle = token.title
                                    .replace(/Completer/g, 'Roadmap Master')
                                    .replace(/Communicator/g, 'Interview Ace')
                                    .replace(/Expert/g, 'Skill Verified');

                                return (
                                    <Motion.div
                                        key={token._id}
                                        className="token-card"
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        whileInView={{ scale: 1, opacity: 1 }}
                                        viewport={{ once: true }}
                                        whileHover={{ y: -10 }}
                                    >
                                        <div className="token-icon">🏆</div>
                                        <h4>{displayTitle}</h4>
                                        <span className="token-date">{new Date(token.issuedAt).toLocaleDateString()}</span>
                                    </Motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* OTP Modal */}
            <AnimatePresence>
                {showOtpModal && (
                    <div className="modal-overlay">
                        <Motion.div
                            className="modal-content glass-panel"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                        >
                            <h3>Verify Identity</h3>
                            <p>Verification code sent to {tempPhone}</p>
                            <input
                                className="otp-input"
                                value={otpCode}
                                onChange={e => setOtpCode(e.target.value)}
                                maxLength={6}
                                placeholder="000000"
                            />
                            <div className="flex-between">
                                <button className="neon-btn small" onClick={() => setShowOtpModal(false)}>Cancel</button>
                                <button className="neon-btn" onClick={handleVerifyOtp}>Confirm Identity</button>
                            </div>
                        </Motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AnimatedPage>
    );
}

const SwotBox = ({ label, color, isEditing, value, onChange, items }) => (
    <div className="swot-box" style={{ borderColor: color }}>
        <h4 style={{ color }}>{label}</h4>
        {isEditing ? (
            <textarea
                className="swot-input"
                placeholder="Core strengths..."
                value={value}
                onChange={e => onChange(e.target.value)}
            />
        ) : (
            <ul>
                {items && items.length > 0 ? items.map((i, idx) => <li key={idx}>{i}</li>) : <li>-</li>}
            </ul>
        )}
    </div>
);
