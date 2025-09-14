import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// Backend URL configuration
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001';

// Landing Page Component
const LandingPage = ({ onStartInterview, onViewDemo }) => {
  return (
    <div className="landing-container">
      <div className="landing-content">
        <div className="hero-section">
          <div className="hero-text">
            <h1 className="hero-title">
              Excel Skills Assessment
              <span className="gradient-text">Powered by AI</span>
            </h1>
            <p className="hero-subtitle">
              Get personalized Excel skill evaluation through intelligent conversation. 
              <strong> 10 minutes or 10 questions</strong> - whichever comes first!
            </p>
            
            <div className="feature-highlights">
              <div className="feature">
                <span className="feature-icon">🤖</span>
                <span>AI-Powered Conversation</span>
              </div>
              <div className="feature">
                <span className="feature-icon">⏱️</span>
                <span>10-Minute Time Limit</span>
              </div>
              <div className="feature">
                <span className="feature-icon">📊</span>
                <span>Maximum 10 Questions</span>
              </div>
            </div>

            <div className="cta-buttons">
              <button className="primary-btn" onClick={onStartInterview}>
                Start Assessment
                <span className="btn-icon">→</span>
              </button>
              <button className="secondary-btn" onClick={onViewDemo}>
                View Demo
                <span className="btn-icon">▶</span>
              </button>
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="floating-card card-1">
              <div className="card-header">Time Limit</div>
              <div className="card-content">10:00 ⏰</div>
            </div>
            <div className="floating-card card-2">
              <div className="card-header">Questions</div>
              <div className="card-content">Max 10 ❓</div>
            </div>
            <div className="floating-card card-3">
              <div className="card-header">AI Evaluation</div>
              <div className="card-content">Real-time ✨</div>
            </div>
          </div>
        </div>

        <div className="stats-section">
          <div className="stat">
            <div className="stat-number">10K+</div>
            <div className="stat-label">Assessments Completed</div>
          </div>
          <div className="stat">
            <div className="stat-number">95%</div>
            <div className="stat-label">Accuracy Rate</div>
          </div>
          <div className="stat">
            <div className="stat-number">4.9★</div>
            <div className="stat-label">User Rating</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Login Component
const LoginForm = ({ onLogin, onBackToHome }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    experience: 'beginner'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(formData);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <button className="back-btn" onClick={onBackToHome}>
          ← Back to Home
        </button>
        
        <div className="auth-header">
          <h2>Start Your Assessment</h2>
          <p>⏱️ 10 minutes • ❓ Max 10 questions • 🎯 Adaptive difficulty</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label>Company/Organization</label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({...formData, company: e.target.value})}
              placeholder="Enter your company (optional)"
            />
          </div>

          <div className="form-group">
            <label>Excel Experience Level</label>
            <select
              value={formData.experience}
              onChange={(e) => setFormData({...formData, experience: e.target.value})}
            >
              <option value="beginner">Beginner (Basic formulas)</option>
              <option value="intermediate">Intermediate (VLOOKUP, Pivot Tables)</option>
              <option value="advanced">Advanced (VBA, Power Query)</option>
            </select>
          </div>

          <button type="submit" className="auth-submit-btn">
            Begin 10-Minute Assessment
            <span className="btn-icon">🚀</span>
          </button>
        </form>

        <div className="auth-footer">
          <p>✨ Assessment ends when you reach 10 questions OR 10 minutes - whichever comes first!</p>
        </div>
      </div>
    </div>
  );
};

// Progress Bar Component
const ProgressBar = ({ timeRemaining, questionsAnswered, maxTime, maxQuestions }) => {
  const timeProgress = ((maxTime - timeRemaining) / maxTime) * 100;
  const questionProgress = (questionsAnswered / maxQuestions) * 100;
  const overallProgress = Math.max(timeProgress, questionProgress);

  return (
    <div className="progress-container">
      <div className="progress-stats">
        <div className="progress-item">
          <span className="progress-label">⏱️ Time</span>
          <span className="progress-value">
            {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
          </span>
        </div>
        <div className="progress-item">
          <span className="progress-label">❓ Questions</span>
          <span className="progress-value">{questionsAnswered}/{maxQuestions}</span>
        </div>
      </div>
      <div className="progress-bar-container">
        <div 
          className="progress-bar-fill" 
          style={{ width: `${overallProgress}%` }}
        />
      </div>
    </div>
  );
};

// Main App Component with Timer & Counter
function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [userInfo, setUserInfo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState(null);
  
  // Timer & Counter States
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes in seconds
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [interviewEnded, setInterviewEnded] = useState(false);
  const [endReason, setEndReason] = useState('');
  
  const messagesEndRef = useRef(null);
  const timerRef = useRef(null);

  // Constants
  const MAX_TIME = 600; // 10 minutes
  const MAX_QUESTIONS = 10;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Timer Effect
  useEffect(() => {
    if (isInterviewActive && timeRemaining > 0 && !interviewEnded) {
      timerRef.current = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && !interviewEnded) {
      endInterview('time');
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isInterviewActive, timeRemaining, interviewEnded]);

  // Check question limit
  useEffect(() => {
    if (questionsAnswered >= MAX_QUESTIONS && !interviewEnded) {
      endInterview('questions');
    }
  }, [questionsAnswered, interviewEnded]);

  const endInterview = (reason) => {
    setIsInterviewActive(false);
    setInterviewEnded(true);
    setEndReason(reason);
    
    const endMessage = reason === 'time' 
      ? "⏰ Time's up! Your 10-minute assessment is complete. Great job! Click 'Generate Report' to see your results."
      : "🎯 You've completed all 10 questions! Excellent work! Click 'Generate Report' to see your detailed performance analysis.";
    
    setMessages(prev => [...prev, { 
      type: 'bot', 
      content: endMessage, 
      timestamp: new Date(),
      isEndMessage: true
    }]);
  };

  const handleStartInterview = () => {
    setCurrentView('login');
  };

  const handleViewDemo = () => {
    setUserInfo({ name: 'Demo User', email: 'demo@example.com', experience: 'intermediate' });
    setCurrentView('interview');
    startInterview();
  };

  const handleLogin = (formData) => {
    setUserInfo(formData);
    setCurrentView('interview');
    startInterview();
  };

  const handleBackToHome = () => {
    // Reset all states
    setCurrentView('landing');
    setMessages([]);
    setSessionId(null);
    setUserInfo(null);
    setReport(null);
    setTimeRemaining(MAX_TIME);
    setQuestionsAnswered(0);
    setIsInterviewActive(false);
    setInterviewEnded(false);
    setEndReason('');
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  const startInterview = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/chat/start`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const data = await response.json();
      setSessionId(data.sessionId);
      setMessages([{ 
        type: 'bot', 
        content: `Hello ${userInfo?.name || 'there'}! Welcome to your Excel skills assessment. You have 10 minutes or 10 questions (whichever comes first) to showcase your Excel knowledge. Let's begin! ${data.message}`, 
        timestamp: new Date() 
      }]);
      
      // Start the timer
      setIsInterviewActive(true);
      setTimeRemaining(MAX_TIME);
      setQuestionsAnswered(0);
      setInterviewEnded(false);
    } catch (error) {
      console.error('Failed to start interview:', error);
      setMessages([{
        type: 'bot',
        content: 'Sorry, I\'m having trouble connecting to the server. Please try again later or contact support.',
        timestamp: new Date()
      }]);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading || interviewEnded) return;

    const userMessage = { type: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Increment question counter
    setQuestionsAnswered(prev => prev + 1);

    try {
      const response = await fetch(`${BACKEND_URL}/api/chat/message`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId, message: input })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const botMessage = { type: 'bot', content: data.message, timestamp: new Date() };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage = { 
        type: 'bot', 
        content: 'Sorry, I encountered an error. Please try again or check your connection.', 
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateReport = async () => {
    try {
      // Add completion stats to report request
      const response = await fetch(`${BACKEND_URL}/api/chat/report/${sessionId}?timeUsed=${MAX_TIME - timeRemaining}&questionsAnswered=${questionsAnswered}&endReason=${endReason}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const reportData = await response.json();
      
      // Add timing and question data to report
      reportData.assessmentStats = {
        timeUsed: MAX_TIME - timeRemaining,
        totalTime: MAX_TIME,
        questionsAnswered,
        maxQuestions: MAX_QUESTIONS,
        endReason,
        completionRate: Math.max(
          ((MAX_TIME - timeRemaining) / MAX_TIME) * 100,
          (questionsAnswered / MAX_QUESTIONS) * 100
        )
      };
      
      setReport(reportData);
      setCurrentView('report');
    } catch (error) {
      console.error('Failed to generate report:', error);
      alert('Failed to generate report. Please try again.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !interviewEnded) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Render based on current view
  if (currentView === 'landing') {
    return (
      <div className="app">
        <LandingPage 
          onStartInterview={handleStartInterview}
          onViewDemo={handleViewDemo}
        />
      </div>
    );
  }

  if (currentView === 'login') {
    return (
      <div className="app">
        <LoginForm 
          onLogin={handleLogin}
          onBackToHome={handleBackToHome}
        />
      </div>
    );
  }

  if (currentView === 'report' && report) {
    return (
      <div className="app">
        <div className="report-container">
          <div className="report-header">
            <h2>📊 Assessment Report</h2>
            <p>for {userInfo?.name}</p>
          </div>
          
          <div className="report-card">
            <div className="completion-stats">
              <div className="stat-card">
                <div className="stat-value">
                  {Math.floor(report.assessmentStats.timeUsed / 60)}:{(report.assessmentStats.timeUsed % 60).toString().padStart(2, '0')}
                </div>
                <div className="stat-label">Time Used</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{report.assessmentStats.questionsAnswered}</div>
                <div className="stat-label">Questions Answered</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{Math.round(report.assessmentStats.completionRate)}%</div>
                <div className="stat-label">Completion Rate</div>
              </div>
            </div>

            <div className="score-section">
              <h3>Overall Score: {report.overallScore}/10</h3>
              <p className="skill-level">
                Skill Level: <span className={`level ${report.skillLevel}`}>{report.skillLevel}</span>
              </p>
              <p className="end-reason">
                Assessment ended due to: 
                <strong> {report.assessmentStats.endReason === 'time' ? 'Time limit reached' : 'All questions completed'}</strong>
              </p>
            </div>
            
            <div className="report-grid">
              <div className="strengths-section">
                <h4>✅ Strengths</h4>
                <ul>
                  {report.strengths.map((strength, index) => (
                    <li key={index}>{strength}</li>
                  ))}
                </ul>
              </div>

              <div className="improvements-section">
                <h4>🎯 Areas for Improvement</h4>
                <ul>
                  {report.improvements.map((improvement, index) => (
                    <li key={index}>{improvement}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="report-actions">
              <button onClick={handleBackToHome} className="restart-btn">
                Take New Assessment
              </button>
              {!interviewEnded && (
                <button onClick={() => setCurrentView('interview')} className="continue-btn">
                  Continue Interview
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Interview View with Timer & Progress
  return (
    <div className="app">
      <div className="chat-container">
        <div className="chat-header">
          <div className="header-info">
            <h2>🤖 ExcelBot Interview</h2>
            <span className="user-badge">{userInfo?.name}</span>
          </div>
          <div className="header-actions">
            <button 
              onClick={generateReport} 
              className="report-btn"
              disabled={questionsAnswered === 0}
            >
              Generate Report
            </button>
            <button onClick={handleBackToHome} className="home-btn">
              🏠
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <ProgressBar 
          timeRemaining={timeRemaining}
          questionsAnswered={questionsAnswered}
          maxTime={MAX_TIME}
          maxQuestions={MAX_QUESTIONS}
        />
        
        <div className="messages-container">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.type} ${message.isEndMessage ? 'end-message' : ''}`}>
              <div className="message-content">
                {message.content}
              </div>
              <div className="message-time">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          ))}
          
          {isLoading && !interviewEnded && (
            <div className="message bot">
              <div className="typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="input-container">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={interviewEnded ? "Assessment completed. Generate your report!" : "Type your answer here... (Press Enter to send)"}
            className="message-input"
            rows={3}
            disabled={interviewEnded}
          />
          <button 
            onClick={sendMessage} 
            disabled={!input.trim() || isLoading || interviewEnded}
            className="send-btn"
          >
            {interviewEnded ? 'Ended' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
