import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AnimatedPage from '../components/AnimatedPage';
import GlitchText from '../components/GlitchText';
import { motion as Motion } from 'framer-motion';
import { User, Lock, Mail, ArrowRight } from 'lucide-react';
import './signup.css';

export default function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await signup(name, email, password, role);
        if (success) {
            // Auto redirect based on role (token is already set by signup)
            if (role === 'recruiter') {
                navigate('/recruiter-dashboard');
            } else {
                navigate('/dashboard');
            }
        } else {
            setName('');
            setEmail('');
            setPassword('');
        }
    };

    return (
        <AnimatedPage className="auth-page">
            {/* Background Shapes */}
            <div className="shape shape-3" />
            <div className="shape shape-4" />

            <Motion.div
                className="glass-panel auth-card"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="auth-header">
                    <GlitchText text="Create Account" className="auth-title" />
                    <p className="auth-subtitle">Choose your path in the CareerLens ecosystem</p>
                </div>

                <div className="role-selector">
                    <button
                        type="button"
                        onClick={() => setRole('student')}
                        className={`role-btn ${role === 'student' ? 'active' : ''}`}
                    >
                        I am a Student
                    </button>
                    <button
                        type="button"
                        onClick={() => setRole('recruiter')}
                        className={`role-btn ${role === 'recruiter' ? 'active' : ''}`}
                    >
                        I am a Recruiter
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Full Name</label>
                        <div className="input-icon-wrapper">
                            <User size={18} className="input-icon" />
                            <input
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Email Address</label>
                        <div className="input-icon-wrapper">
                            <Mail size={18} className="input-icon" />
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <div className="input-icon-wrapper">
                            <Lock size={18} className="input-icon" />
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <Motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="neon-btn full-width"
                        type="submit"
                    >
                        Create {role === 'student' ? 'Student' : 'Recruiter'} Account <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                    </Motion.button>
                </form>

                <div className="auth-footer">
                    <p>Already have an account? <Link to="/login" className="link-highlight">Sign In</Link></p>
                </div>
            </Motion.div>
        </AnimatedPage>
    );
}