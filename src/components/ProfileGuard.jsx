import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, ArrowRight } from 'lucide-react';
import { motion as Motion } from 'framer-motion';

const ProfileGuard = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) return null;
    if (!user) return <Navigate to="/login" state={{ from: location }} />;

    // Don't show the guard if we are already on the profile page
    if (location.pathname === '/profile') return children;

    if (!user.isProfileComplete) {
        return (
            <div className="profile-lock-overlay">
                <div className="lock-card glass-panel">
                    <GraduationCap size={64} color="var(--primary)" className="lock-icon" />
                    <h2>Knowledge Bridge</h2>
                    <p className="polite-msg">
                        "We require your details in order to make your profile strong and future bright."
                        <br /><br />
                        To provide you with the most personalized career path and unlock premium features, please take a moment to complete your profile.
                    </p>
                    <Link to="/profile" className="neon-btn">
                        Finalize Profile <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        );
    }

    return children;
};

export default ProfileGuard;
