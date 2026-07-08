import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Code, Server, Database, Cpu, CheckCircle, Clock, Award, TrendingUp, Target, BookOpen, Layout, Shield, Zap, BarChart, Smartphone, Globe, Lock, Palette, Gamepad2, Users, Briefcase, Radio, Monitor, Coffee, Box, Settings, Share2, Layers, FileCode, Hexagon, GitBranch, CloudLightning, Terminal, Anchor, Network, MessageSquare } from 'lucide-react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import AnimatedPage from '../components/AnimatedPage';
import './skillevaluation.css';

const roles = [
    { id: 'frontend', name: 'Frontend Developer', icon: Code, color: '#61dafb', category: 'Development' },
    { id: 'backend', name: 'Backend Developer', icon: Server, color: '#68a063', category: 'Development' },
    { id: 'fullstack', name: 'Full Stack Developer', icon: Layout, color: '#8b5cf6', category: 'Development' },
    { id: 'devops', name: 'DevOps Engineer', icon: Cpu, color: '#00d4aa', category: 'Operations' },
    { id: 'devsecops', name: 'DevSecOps Engineer', icon: Shield, color: '#ff6b6b', category: 'Security' },
    { id: 'ai-engineer', name: 'AI Engineer', icon: Zap, color: '#ffd93d', category: 'AI/ML' },
    { id: 'data-analyst', name: 'Data Analyst', icon: BarChart, color: '#6bcf7f', category: 'Data' },
    { id: 'ai-data-scientist', name: 'AI & Data Scientist', icon: TrendingUp, color: '#a29bfe', category: 'AI/ML' },
    { id: 'data-engineer', name: 'Data Engineer', icon: Database, color: '#fd79a8', category: 'Data' },
    { id: 'android', name: 'Android Developer', icon: Smartphone, color: '#3ddc84', category: 'Mobile' },
    { id: 'ios', name: 'iOS Developer', icon: Smartphone, color: '#007aff', category: 'Mobile' },
    { id: 'postgresql', name: 'PostgreSQL DBA', icon: Database, color: '#336791', category: 'Database' },
    { id: 'blockchain', name: 'Blockchain Developer', icon: Globe, color: '#f7931a', category: 'Web3' },
    { id: 'qa', name: 'QA Engineer', icon: CheckCircle, color: '#00b894', category: 'Quality' },
    { id: 'software-architect', name: 'Software Architect', icon: Layout, color: '#0984e3', category: 'Architecture' },
    { id: 'cyber-security', name: 'Cyber Security', icon: Lock, color: '#d63031', category: 'Security' },
    { id: 'ux-design', name: 'UX Designer', icon: Palette, color: '#e17055', category: 'Design' },
    { id: 'game-developer', name: 'Game Developer', icon: Gamepad2, color: '#6c5ce7', category: 'Gaming' },
    { id: 'mlops', name: 'MLOps Engineer', icon: Cpu, color: '#fdcb6e', category: 'AI/ML' },
    { id: 'product-manager', name: 'Product Manager', icon: Briefcase, color: '#74b9ff', category: 'Management' },
    { id: 'engineering-manager', name: 'Engineering Manager', icon: Users, color: '#a29bfe', category: 'Management' },
    { id: 'devrel', name: 'Developer Relations', icon: Radio, color: '#fd79a8', category: 'Community' },
    { id: 'bi-analyst', name: 'BI Analyst', icon: BarChart, color: '#55efc4', category: 'Analytics' },
];

const skills = [
    { id: 'computer-science', name: 'Computer Science', icon: Monitor, color: '#a29bfe', category: 'CS Core' },
    { id: 'sql', name: 'SQL', icon: Database, color: '#f29111', category: 'Database' },
    { id: 'react', name: 'React', icon: Code, color: '#61dafb', category: 'Frontend' },
    { id: 'vue', name: 'Vue', icon: Code, color: '#42b883', category: 'Frontend' },
    { id: 'angular', name: 'Angular', icon: Code, color: '#dd1b16', category: 'Frontend' },
    { id: 'javascript', name: 'JavaScript', icon: Code, color: '#f7df1e', category: 'Language' },
    { id: 'typescript', name: 'TypeScript', icon: Code, color: '#3178c6', category: 'Language' },
    { id: 'nodejs', name: 'Node.js', icon: Server, color: '#68a063', category: 'Backend' },
    { id: 'python', name: 'Python', icon: Code, color: '#3776ab', category: 'Language' },
    { id: 'java', name: 'Java', icon: Coffee, color: '#e76f00', category: 'Language' },
    { id: 'spring-boot', name: 'Spring Boot', icon: Layers, color: '#6db33f', category: 'Backend' },
    { id: 'go', name: 'Go', icon: Box, color: '#00add8', category: 'Language' },
    { id: 'rust', name: 'Rust', icon: Settings, color: '#dea584', category: 'Language' },
    { id: 'cpp', name: 'C++', icon: Code, color: '#00599c', category: 'Language' },
    { id: 'flutter', name: 'Flutter', icon: Smartphone, color: '#02569b', category: 'Mobile' },
    { id: 'graphql', name: 'GraphQL', icon: Share2, color: '#e10098', category: 'API' },
    { id: 'design-system', name: 'Design System', icon: Palette, color: '#ff4785', category: 'Design' },
    { id: 'system-design', name: 'System Design', icon: Layout, color: '#555555', category: 'Architecture' },
    { id: 'docker', name: 'Docker', icon: Box, color: '#2496ed', category: 'DevOps' },
    { id: 'kubernetes', name: 'Kubernetes', icon: Anchor, color: '#326ce5', category: 'DevOps' },
    { id: 'aws', name: 'AWS', icon: CloudLightning, color: '#ff9900', category: 'Cloud' },
    { id: 'mongodb', name: 'MongoDB', icon: Database, color: '#47a248', category: 'Database' },
    { id: 'linux', name: 'Linux', icon: Terminal, color: '#fcc624', category: 'OS' },
    { id: 'git-github', name: 'Git & GitHub', icon: GitBranch, color: '#f05133', category: 'Tools' },
    { id: 'terraform', name: 'Terraform', icon: Globe, color: '#7b42bc', category: 'DevOps' },
    { id: 'redis', name: 'Redis', icon: Database, color: '#d82c20', category: 'Database' },
    { id: 'datastructures', name: 'DSA', icon: Network, color: '#00d8ff', category: 'CS Core' },
    { id: 'prompt-engineering', name: 'Prompt Eng.', icon: MessageSquare, color: '#10a37f', category: 'AI' },
    { id: 'nextjs', name: 'Next.js', icon: Layers, color: '#000000', category: 'Frontend' },
    { id: 'html', name: 'HTML', icon: FileCode, color: '#e34f26', category: 'Frontend' },
    { id: 'css', name: 'CSS', icon: Palette, color: '#1572b6', category: 'Frontend' },
    { id: 'kotlin', name: 'Kotlin', icon: Smartphone, color: '#7f52ff', category: 'Mobile' },
    { id: 'swift', name: 'Swift', icon: Smartphone, color: '#f05138', category: 'Mobile' },
    { id: 'laravel', name: 'Laravel', icon: Hexagon, color: '#ff2d20', category: 'Backend' },
    { id: 'wordpress', name: 'WordPress', icon: Globe, color: '#21759b', category: 'CMS' },
];


export default function SkillEvaluation() {
    const navigate = useNavigate();
    const { setUser } = useAuth();
    const [currentState, setCurrentState] = useState('selection'); // selection, assessment, results
    const [selectedStacks, setSelectedStacks] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [timeLeft, setTimeLeft] = useState(30);
    const [score, setScore] = useState(0);
    const [skillScores, setSkillScores] = useState({});
    
    // Dynamic Questions Generation
    const [questions, setQuestions] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);

    const currentStack = selectedStacks[0];
    const currentQuestion = questions[currentQuestionIndex];

    // Timer
    useEffect(() => {
        if (currentState === 'assessment' && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && currentState === 'assessment') {
            handleNextQuestion();
        }
    }, [timeLeft, currentState, currentQuestionIndex, questions.length]);

    const toggleStack = (stackId) => {
        if (selectedStacks.includes(stackId)) {
            setSelectedStacks(selectedStacks.filter(s => s !== stackId));
        } else {
            setSelectedStacks([...selectedStacks, stackId]);
        }
    };

    const generateQuestions = async (stackId) => {
        setIsGenerating(true);
        try {
            const roleObj = roles.find(r => r.id === stackId) || skills.find(s => s.id === stackId);
            const stackName = roleObj ? roleObj.name : stackId;
            
            const prompt = `Generate exactly 10 multiple choice questions for a technical skill evaluation assessment for the role/skill: ${stackName}. Return ONLY a valid JSON object with a single key "questions" holding an array of 10 objects. Each object must have: "question" (string), "options" (array of 4 strings), and "correct" (integer 0-3 representing the index of the correct option). Do not return any markdown or extra text.`;

            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "llama-3.1-8b-instant",
                    messages: [{ role: "user", content: prompt }],
                    response_format: { type: "json_object" }
                })
            });

            if (!response.ok) throw new Error("Failed to generate questions");
            const data = await response.json();
            const result = JSON.parse(data.choices[0].message.content);
            
            if (result.questions && result.questions.length > 0) {
                setQuestions(result.questions);
            } else {
                throw new Error("Invalid response format");
            }
        } catch (error) {
            console.error("Error generating questions:", error);
            toast.error("Failed to generate questions. Please try again.");
            setCurrentState('selection');
        } finally {
            setIsGenerating(false);
        }
    };

    const startAssessment = async () => {
        if (selectedStacks.length > 0) {
            await generateQuestions(selectedStacks[0]);
            setCurrentState('assessment');
            setTimeLeft(30);
        }
    };

    const handleAnswer = (optionIndex) => {
        const isCorrect = optionIndex === currentQuestion.correct;
        setAnswers([...answers, { questionIndex: currentQuestionIndex, answer: optionIndex, correct: isCorrect }]);

        if (isCorrect) {
            setScore(score + 1);
        }

        setTimeout(() => handleNextQuestion(), 500);
    };

    const handleNextQuestion = async () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setTimeLeft(30);
        } else {
            // Calculate final scores
            const overallScore = Math.round((score / questions.length) * 100);

            try {
                const response = await api.post('/assessment/submit', {
                    type: 'skill_evaluation',
                    category: currentStack,
                    score: overallScore,
                    metrics: { correct: score, total: questions.length }
                });

                if (response.data.tokenAwarded) {
                    toast.success(`You earned the "${response.data.tokenTitle}" token!`, {
                        duration: 5000,
                        icon: '🏆'
                    });
                }

                // Refresh user context
                const userRes = await api.get('/auth/me');
                setUser(userRes.data);

            } catch (err) {
                console.error('Failed to save skill evaluation:', err);
                toast.error('Failed to save assessment results.');
            }

            setSkillScores({
                [currentStack]: overallScore,
                overall: overallScore
            });
            setCurrentState('results');
        }
    };

    const resetEvaluation = () => {
        setCurrentState('selection');
        setSelectedStacks([]);
        setCurrentQuestionIndex(0);
        setAnswers([]);
        setScore(0);
        setTimeLeft(30);
        setSkillScores({});
    };

    return (
        <AnimatedPage className="skill-evaluation-container">
            {/* Header */}
            <div className="evaluation-header">
                <button onClick={() => navigate('/dashboard')} className="back-btn">
                    <ArrowLeft size={20} />
                    <span>Back to Dashboard</span>
                </button>
                <h1 className="page-title">Skill Evaluation</h1>
            </div>

            <AnimatePresence mode="wait">
                {currentState === 'selection' && (
                    <Motion.div
                        key="selection"
                        className="selection-state"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="selection-header">
                            <h2>Select Your Path</h2>
                            <p>Choose a role or specific skill to evaluate</p>
                        </div>

                        {/* Roles Section */}
                        <div className="section-title-wrapper">
                            <h3>Career Roles</h3>
                            <div className="section-divider"></div>
                        </div>
                        <div className="tech-stack-grid">
                            {roles.map((role, idx) => {
                                const Icon = role.icon;
                                const isSelected = selectedStacks.includes(role.id);
                                return (
                                    <Motion.div
                                        key={role.id}
                                        className={`tech-card glass-panel ${isSelected ? 'selected' : ''}`}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        whileHover={{ scale: 1.05, y: -5 }}
                                        onClick={() => toggleStack(role.id)}
                                    >
                                        <div className="tech-icon" style={{ color: role.color }}>
                                            <Icon size={32} />
                                        </div>
                                        <h3>{role.name}</h3>
                                        <span className="tech-category">{role.category}</span>
                                        {isSelected && (
                                            <div className="selected-badge">
                                                <CheckCircle size={20} />
                                            </div>
                                        )}
                                    </Motion.div>
                                );
                            })}
                        </div>

                        {/* Skills Section */}
                        <div className="section-title-wrapper">
                            <h3>Technical Skills</h3>
                            <div className="section-divider"></div>
                        </div>
                        <div className="tech-stack-grid">
                            {skills.map((skill, idx) => {
                                const Icon = skill.icon;
                                const isSelected = selectedStacks.includes(skill.id);
                                return (
                                    <Motion.div
                                        key={skill.id}
                                        className={`tech-card glass-panel ${isSelected ? 'selected' : ''}`}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        whileHover={{ scale: 1.05, y: -5 }}
                                        onClick={() => toggleStack(skill.id)}
                                    >
                                        <div className="tech-icon" style={{ color: skill.color }}>
                                            <Icon size={32} />
                                        </div>
                                        <h3>{skill.name}</h3>
                                        <span className="tech-category">{skill.category}</span>
                                        {isSelected && (
                                            <div className="selected-badge">
                                                <CheckCircle size={20} />
                                            </div>
                                        )}
                                    </Motion.div>
                                );
                            })}
                        </div>

                        <Motion.button
                            className="start-btn neon-btn"
                            disabled={selectedStacks.length === 0 || isGenerating}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={startAssessment}
                        >
                            {isGenerating ? "Generating Questions..." : `Start Assessment (${selectedStacks.length} selected)`}
                        </Motion.button>
                    </Motion.div>
                )}

                {currentState === 'assessment' && currentQuestion && (
                    <Motion.div
                        key="assessment"
                        className="assessment-state"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="assessment-header">
                            <div className="progress-info">
                                <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill"
                                        style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                                    />
                                </div>
                            </div>
                            <div className="timer">
                                <Clock size={20} />
                                <span>{timeLeft}s</span>
                            </div>
                        </div>

                        <Motion.div className="question-card glass-panel">
                            <h2>{currentQuestion.question}</h2>
                            <div className="options-grid">
                                {currentQuestion.options.map((option, idx) => (
                                    <Motion.button
                                        key={idx}
                                        className="option-btn"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleAnswer(idx)}
                                    >
                                        <span className="option-letter">{String.fromCharCode(65 + idx)}</span>
                                        <span className="option-text">{option}</span>
                                    </Motion.button>
                                ))}
                            </div>
                        </Motion.div>
                    </Motion.div>
                )}

                {currentState === 'results' && (
                    <Motion.div
                        key="results"
                        className="results-state"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="results-header">
                            <Award size={48} color="var(--secondary)" />
                            <h2>Assessment Complete!</h2>
                            <p>Here's how you performed</p>
                        </div>

                        <div className="results-grid">
                            <Motion.div
                                className="score-card glass-panel"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <h3>Overall Score</h3>
                                <div className="score-circle">
                                    <span className="score-value">{Math.round(skillScores.overall)}%</span>
                                </div>
                                <p>{score} out of {questions.length} correct</p>
                            </Motion.div>

                            <Motion.div
                                className="insights-card glass-panel"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <h3><Target size={20} /> Performance Insights</h3>
                                <div className="insight-item">
                                    <TrendingUp size={16} color="var(--matrix)" />
                                    <span>
                                        {skillScores.overall >= 70 ? 'Strong understanding!' : 'Room for improvement'}
                                    </span>
                                </div>
                                <div className="insight-item">
                                    <BookOpen size={16} color="var(--primary)" />
                                    <span>Recommended: Practice more {currentStack} concepts</span>
                                </div>
                            </Motion.div>

                            <Motion.div
                                className="recommendations-card glass-panel"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <h3>Career Match</h3>
                                <div className="career-matches">
                                    <div className="match-item">
                                        <span>Frontend Developer</span>
                                        <div className="match-bar">
                                            <div className="match-fill" style={{ width: `${skillScores.overall}%` }} />
                                        </div>
                                        <span className="match-percent">{Math.round(skillScores.overall)}%</span>
                                    </div>
                                </div>
                            </Motion.div>
                        </div>

                        <div className="results-actions">
                            <button className="outline-btn" onClick={resetEvaluation}>
                                Take Another Assessment
                            </button>
                            <button className="neon-btn" onClick={() => navigate(`/mock-interview?role=${currentStack}`)}>
                                Start Technical Interview
                            </button>
                            <button className="outline-btn" style={{ marginLeft: '1rem' }} onClick={() => navigate('/roadmap')}>
                                View Learning Roadmap
                            </button>
                        </div>
                    </Motion.div>
                )}
            </AnimatePresence>
        </AnimatedPage>
    );
}
