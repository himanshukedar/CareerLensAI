import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AnimatedPage from '../components/AnimatedPage';
import GlitchText from '../components/GlitchText';
import { motion as Motion } from 'framer-motion';
import { User, Lock, ArrowRight } from 'lucide-react';
import './login.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, user, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/dashboard';

    // If already logged in, redirect to appropriate dashboard
    React.useEffect(() => {
        if (!loading && user) {
            if (user.role === 'recruiter') {
                navigate('/recruiter-dashboard', { replace: true });
            } else {
                navigate(from, { replace: true });
            }
        }
    }, [user, loading]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(email, password);
        if (success) {
            navigate(from, { replace: true });
        } else {
            // Refresh state by clearing BOTH email and password on failure
            setEmail('');
            setPassword('');
        }
    };

    return (
        <AnimatedPage className="auth-page">
            {/* Background Shapes */}
            <div className="shape shape-1" />
            <div className="shape shape-2" />

            <Motion.div
                className="glass-panel auth-card"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="auth-header">
                    <GlitchText text="Welcome Back" className="auth-title" />
                    <p className="auth-subtitle">Enter your credentials to access your roadmap</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Email Address</label>
                        <div className="input-icon-wrapper">
                            <User size={18} className="input-icon" />
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
                        Sign In <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                    </Motion.button>
                </form>

                <div className="auth-footer">
                    <p>Don't have an account? <Link to="/signup" className="link-highlight">Sign Up</Link></p>
                </div>
            </Motion.div>
        </AnimatedPage>
    );
}