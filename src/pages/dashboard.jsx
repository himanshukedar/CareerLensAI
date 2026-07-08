import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { LogOut, User, Map, MessageSquare, BarChart2, Users, Sun, Moon, Award, Briefcase, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import AnimatedPage from '../components/AnimatedPage';

import './dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  React.useEffect(() => {
    if (user?.role === 'recruiter') navigate('/recruiter-dashboard');
    if (user?.role === 'admin') navigate('/admin-dashboard');
  }, [user, navigate]);

  return (
    <AnimatedPage className="dashboard-container">


      <div className="dashboard-wrapper container">
        <section className="hero-section">
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="hero-badge">AI-Powered Career Guidance</div>
            <h1 className="hero-title">
              Transform Your <br />
              <span className="hero-glitch">Career Journey</span>
            </h1>
            <p className="hero-subtitle">
              Get personalized roadmaps, skill assessments, and AI-driven advice to accelerate your professional growth.
            </p>
            <div className="hero-content-wrapper">
              <div className="hero-actions">
                <button onClick={() => navigate('/profile-analysis')} className="neon-btn">Start Analysis</button>
                <button onClick={() => navigate('/roadmap')} className="outline-btn">Explore Roadmaps</button>
              </div>
            </div>
          </Motion.div>
        </section>



        <section className="features-section">
          <div className="section-header">
            <h2 className="section-title">Everything You Need to Succeed</h2>
            <p className="section-subtitle">Comprehensive tools and AI-powered insights</p>
          </div>

          <Motion.div
            className="features-grid"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <FeatureCard
              icon={<User size={24} />}
              title="Profile Analysis"
              desc={`${user?.completedRoadmaps?.length || 0} Roadmaps Analyzed. Click for deep dive.`}
              onClick={() => navigate('/profile-analysis')}
            />

            <Motion.div
              variants={item}
              className="feature-card highlighted-card glass-panel"
              onClick={() => navigate('/roadmap')}
              whileHover={{ scale: 1.05, borderColor: 'var(--primary)' }}
            >
              <div className="feature-icon"><Map size={24} color="#6366f1" /></div>
              <h3>Career Roadmap</h3>
              <p>{user?.completedRoadmaps?.length > 0 ? "Continue your journey." : "Start your first roadmap today."}</p>
              <span className="card-action">View Path →</span>
            </Motion.div>

            <FeatureCard
              icon={<Briefcase size={24} color="#00f3ff" />}
              title="Job Marketplace"
              desc="See vacancies and apply for roles matching your level."
              onClick={() => navigate('/jobs')}
            />

            <FeatureCard
              icon={<MessageSquare size={24} color="#6366f1" />}
              title="Direct Messages"
              desc="Chat with recruiters about your applications."
              onClick={() => navigate('/messages')}
            />

            <FeatureCard
              icon={<Award size={24} />}
              title="Achievements"
              desc={`You have earned ${user?.tokens?.length || 0} career tokens.`}
              onClick={() => navigate('/profile')}
            />

            <FeatureCard
              icon={<Users size={24} />}
              title="Practice Interview"
              desc="Real-time AI-powered technical & behavioral practice."
              onClick={() => navigate('/mock-interview')}
            />

            <FeatureCard
              icon={<BarChart2 size={24} />}
              title="Skill Evaluation"
              desc="Assess your technical skills comprehensively."
              onClick={() => navigate('/skill-evaluation')}
            />

            <FeatureCard
              icon={<Award size={24} color="#f59e0b" />}
              title="Certificate Explorer"
              desc="Discover top AI-recommended professional certifications."
              onClick={() => navigate('/certificates')}
            />
          </Motion.div>
        </section>
      </div>
    </AnimatedPage>
  );
}

const FeatureCard = ({ icon, title, desc, onClick }) => (
  <Motion.div
    variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
    className="feature-card glass-panel"
    whileHover={{ scale: 1.03 }}
    onClick={onClick}
    style={{ cursor: onClick ? 'pointer' : 'default' }}
  >
    <div className="feature-icon">{icon}</div>
    <h3>{title}</h3>
    <p>{desc}</p>
  </Motion.div>
);
