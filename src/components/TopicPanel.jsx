import React, { useState } from 'react';
import { CheckCircle, XCircle, RotateCcw, Loader, Lock, ChevronDown, ChevronUp, Youtube, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateTopicContent, validateAnswer } from '../api/groqService';

const CACHE_PREFIX = 'groq_topic_v3_';   // v3 = keyword-based validation

const TopicPanel = ({ topic, sectionTitle, isCompleted, isUnlocked, onComplete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState(null);
  const [answer, setAnswer] = useState('');
  const [loadingContent, setLoadingContent] = useState(false);
  const [validating, setValidating] = useState(false);
  const [result, setResult] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const cacheKey = `${CACHE_PREFIX}${topic.replace(/\s+/g, '_')}`;

  const loadContent = async () => {
    setLoadingContent(true);
    try {
      const data = await generateTopicContent(topic, sectionTitle);
      setContent(data);
    } catch (err) {
      console.error('Groq API failed:', err);
      setContent({
        explanation: null,
        questions: [{ question: null, keywords: [] }],
        error: 'Failed to load content from AI. Please check your internet connection and try again.',
      });
    } finally {
      setLoadingContent(false);
    }
  };

  const handleItemClick = () => {
    if (!isUnlocked || isCompleted) return;

    const opening = !isOpen;
    setIsOpen(opening);

    if (opening && !content) {
      loadContent();
    }
    if (opening) {
      setShowQuestion(false);
      setCurrentQuestionIndex(0);
    }
  };

  const handleSubmit = async () => {
    if (!answer.trim() || validating) return;
    setValidating(true);
    setResult(null);

    try {
      const currentQ = content.questions[currentQuestionIndex];
      const res = await validateAnswer(currentQ.question, answer, currentQ.keywords || []);
      setResult(res);

      if (res.isCorrect) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setAnswer('');
          setResult(null);
          setRetryCount(0);
          
          if (content.questions && currentQuestionIndex < content.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
          } else {
            onComplete(topic);
            setIsOpen(false);
            setCurrentQuestionIndex(0);
            setShowQuestion(false);
          }
        }, 1400);
      } else {
        setRetryCount((c) => c + 1);
      }
    } catch (err) {
      setResult({ isCorrect: false, feedback: 'Incorrect ❌: Could not reach AI. Please check your connection and try again.' });
    } finally {
      setValidating(false);
    }
  };

  const handleRetry = () => {
    setAnswer('');
    setResult(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) handleSubmit();
  };

  return (
    <div className="topic-panel-wrapper">
      {/* ── Topic Row ── */}
      <div
        className={`step-item ${isCompleted ? 'checked' : ''} ${!isUnlocked ? 'locked' : ''}`}
        onClick={handleItemClick}
        title={!isUnlocked ? 'Complete the previous topic first' : ''}
        style={{ cursor: isCompleted ? 'default' : !isUnlocked ? 'not-allowed' : 'pointer' }}
      >
        <div className={`checkbox ${isCompleted ? 'active' : ''} ${!isUnlocked ? 'locked-check' : ''}`}>
          {isCompleted && <CheckCircle size={12} />}
          {!isUnlocked && !isCompleted && <Lock size={10} />}
        </div>
        <span className={!isUnlocked ? 'locked-text' : ''}>{topic}</span>
        {isUnlocked && !isCompleted && (
          <span className="panel-chevron">
            {isOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </span>
        )}
      </div>

      {/* ── Expandable AI Panel ── */}
      <AnimatePresence>
        {isOpen && isUnlocked && !isCompleted && (
          <motion.div
            className="topic-panel-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {/* Success Banner */}
            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  className="panel-success-banner"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  🎉 Correct! Topic Completed!
                </motion.div>
              )}
            </AnimatePresence>

            {loadingContent ? (
              <div className="panel-loading">
                <Loader size={18} className="panel-spinner" />
                <span>AI is generating content...</span>
              </div>
            ) : content ? (
              <>
                {/* Error State */}
                {content.error ? (
                  <div className="panel-result incorrect" style={{ marginTop: '0.8rem' }}>
                    <XCircle size={15} />
                    <span>{content.error}</span>
                  </div>
                ) : (
                  <>
                    {!showQuestion ? (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {/* Explanation */}
                        <div className="panel-explanation">
                          <span className="panel-label">📖 Explanation</span>
                          <p>{content.explanation}</p>

                      {/* Top Resource Link */}
                      {content.resourceLink && (
                        <div style={{ marginTop: '15px', marginBottom: '5px' }}>
                          <span className="panel-label">🔗 Top Resource</span>
                          <div style={{ display: 'flex', marginTop: '8px' }}>
                            <a 
                              href={content.resourceLink} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              style={{ color: '#4285F4', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 500, textDecoration: 'none', background: 'rgba(66, 133, 244, 0.1)', padding: '5px 10px', borderRadius: '4px', transition: 'all 0.2s' }}
                              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(66, 133, 244, 0.2)'}
                              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(66, 133, 244, 0.1)'}
                            >
                              <Search size={14} /> Explore Best Resource
                            </a>
                          </div>
                        </div>
                      )}
                    </div>

                    <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'flex-end' }}>
                      <button 
                        onClick={() => setShowQuestion(true)}
                        style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600, fontSize: '0.85rem' }}
                      >
                        Test Your Knowledge <ChevronDown size={14} style={{ transform: 'rotate(-90deg)' }} />
                      </button>
                     </div>
                   </motion.div>
                 ) : (
                   <motion.div
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ duration: 0.3 }}
                   >
                     <div style={{ marginBottom: '10px' }}>
                       <button 
                         onClick={() => setShowQuestion(false)}
                         style={{ background: 'transparent', color: 'var(--text-muted)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', padding: 0 }}
                       >
                         <ChevronDown size={14} style={{ transform: 'rotate(90deg)' }} /> Back to Explanation
                       </button>
                     </div>

                    {/* Question */}
                    <div className="panel-question" style={{ marginTop: '0' }}>
                      <span className="panel-label">
                        ❓ Question {currentQuestionIndex + 1} of {content.questions?.length || 1}
                      </span>
                      <p>{content.questions?.[currentQuestionIndex]?.question}</p>
                    </div>

                    {/* Answer Input (hide after correct) */}
                    {!result?.isCorrect && (
                      <>
                        <textarea
                          className="panel-answer"
                          placeholder="Type your answer here... (Ctrl+Enter to submit)"
                          value={answer}
                          onChange={(e) => setAnswer(e.target.value)}
                          onKeyDown={handleKeyDown}
                          rows={3}
                          disabled={validating}
                        />
                        <div className="panel-actions">
                          <button
                            className="panel-submit-btn"
                            onClick={handleSubmit}
                            disabled={validating || !answer.trim()}
                          >
                            {validating ? (
                              <><Loader size={13} className="panel-spinner" /> Validating...</>
                            ) : (
                              'Submit Answer'
                            )}
                          </button>
                          {retryCount > 0 && (
                            <button className="panel-retry-btn" onClick={handleRetry}>
                              <RotateCcw size={13} /> Try Again ({retryCount})
                            </button>
                          )}
                        </div>
                      </>
                    )}

                    {/* Result */}
                    {result && !result.isCorrect && (
                      <motion.div
                        className="panel-result incorrect"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <XCircle size={15} />
                        <span>{result.feedback}</span>
                      </motion.div>
                    )}
                   </motion.div>
                 )}
                  </>
                )}
              </>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TopicPanel;
