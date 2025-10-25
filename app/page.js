'use client';
import { useState } from 'react';

const examQuestions = {
  physics: [
    {
      question: "What is the SI unit of force?",
      options: ["Joule", "Newton", "Watt", "Pascal"],
      correct: 1
    },
    {
      question: "The velocity of light in vacuum is approximately:",
      options: ["3 × 10⁸ m/s", "3 × 10⁶ m/s", "3 × 10⁵ m/s", "3 × 10⁷ m/s"],
      correct: 0
    },
    {
      question: "Which law states that F = ma?",
      options: ["Newton's First Law", "Newton's Second Law", "Newton's Third Law", "Law of Gravitation"],
      correct: 1
    },
    {
      question: "What is the unit of electric current?",
      options: ["Volt", "Ohm", "Ampere", "Coulomb"],
      correct: 2
    },
    {
      question: "The dimensional formula of energy is:",
      options: ["[ML²T⁻²]", "[MLT⁻²]", "[ML²T⁻¹]", "[MLT⁻¹]"],
      correct: 0
    }
  ],
  chemistry: [
    {
      question: "What is the atomic number of Carbon?",
      options: ["4", "6", "8", "12"],
      correct: 1
    },
    {
      question: "Which gas is most abundant in Earth's atmosphere?",
      options: ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"],
      correct: 2
    },
    {
      question: "The pH of pure water is:",
      options: ["0", "7", "14", "1"],
      correct: 1
    },
    {
      question: "What is the molecular formula of benzene?",
      options: ["C₆H₆", "C₆H₁₂", "C₅H₆", "C₇H₈"],
      correct: 0
    },
    {
      question: "Which element has the chemical symbol 'Fe'?",
      options: ["Fluorine", "Iron", "Francium", "Fermium"],
      correct: 1
    }
  ],
  mathematics: [
    {
      question: "What is the value of π (pi) approximately?",
      options: ["2.14", "3.14", "4.14", "5.14"],
      correct: 1
    },
    {
      question: "The derivative of x² is:",
      options: ["x", "2x", "x²", "2x²"],
      correct: 1
    },
    {
      question: "What is the sum of angles in a triangle?",
      options: ["90°", "180°", "270°", "360°"],
      correct: 1
    },
    {
      question: "The value of sin(90°) is:",
      options: ["0", "1", "∞", "1/2"],
      correct: 1
    },
    {
      question: "If log₁₀(100) = x, then x equals:",
      options: ["1", "2", "10", "100"],
      correct: 1
    }
  ]
};

export default function Home() {
  const [started, setStarted] = useState(false);
  const [currentSubject, setCurrentSubject] = useState('physics');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes

  useState(() => {
    if (started && !showResults) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [started, showResults]);

  const handleStart = () => {
    if (studentName.trim()) {
      setStarted(true);
    } else {
      alert('Please enter your name');
    }
  };

  const handleAnswer = (answerIndex) => {
    const key = `${currentSubject}-${currentQuestion}`;
    setAnswers({ ...answers, [key]: answerIndex });
  };

  const handleNext = () => {
    const subjects = ['physics', 'chemistry', 'mathematics'];
    const currentSubjectIndex = subjects.indexOf(currentSubject);

    if (currentQuestion < examQuestions[currentSubject].length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (currentSubjectIndex < subjects.length - 1) {
      setCurrentSubject(subjects[currentSubjectIndex + 1]);
      setCurrentQuestion(0);
    }
  };

  const handlePrevious = () => {
    const subjects = ['physics', 'chemistry', 'mathematics'];
    const currentSubjectIndex = subjects.indexOf(currentSubject);

    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else if (currentSubjectIndex > 0) {
      setCurrentSubject(subjects[currentSubjectIndex - 1]);
      setCurrentQuestion(examQuestions[subjects[currentSubjectIndex - 1]].length - 1);
    }
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const calculateScore = (subject) => {
    let correct = 0;
    examQuestions[subject].forEach((q, idx) => {
      const key = `${subject}-${idx}`;
      if (answers[key] === q.correct) {
        correct++;
      }
    });
    return correct;
  };

  const getTotalScore = () => {
    return calculateScore('physics') + calculateScore('chemistry') + calculateScore('mathematics');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isLastQuestion = () => {
    return currentSubject === 'mathematics' && currentQuestion === examQuestions.mathematics.length - 1;
  };

  const isFirstQuestion = () => {
    return currentSubject === 'physics' && currentQuestion === 0;
  };

  if (!started) {
    return (
      <div style={styles.container}>
        <div style={styles.startCard}>
          <h1 style={styles.title}>PCM Exam Portal</h1>
          <p style={styles.subtitle}>Physics, Chemistry & Mathematics</p>
          <div style={styles.info}>
            <p>📝 Total Questions: 15 (5 per subject)</p>
            <p>⏱️ Duration: 30 minutes</p>
            <p>📊 Marks: 1 mark per question</p>
          </div>
          <input
            type="text"
            placeholder="Enter your name"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            style={styles.input}
          />
          <button onClick={handleStart} style={styles.startButton}>
            Start Exam
          </button>
        </div>
      </div>
    );
  }

  if (showResults) {
    const physicsScore = calculateScore('physics');
    const chemistryScore = calculateScore('chemistry');
    const mathScore = calculateScore('mathematics');
    const totalScore = getTotalScore();
    const percentage = (totalScore / 15) * 100;

    return (
      <div style={styles.container}>
        <div style={styles.resultsCard}>
          <h1 style={styles.title}>Exam Results</h1>
          <h2 style={styles.studentName}>{studentName}</h2>

          <div style={styles.scoreGrid}>
            <div style={styles.scoreItem}>
              <div style={styles.subjectIcon}>⚛️</div>
              <h3>Physics</h3>
              <p style={styles.score}>{physicsScore}/5</p>
            </div>
            <div style={styles.scoreItem}>
              <div style={styles.subjectIcon}>🧪</div>
              <h3>Chemistry</h3>
              <p style={styles.score}>{chemistryScore}/5</p>
            </div>
            <div style={styles.scoreItem}>
              <div style={styles.subjectIcon}>📐</div>
              <h3>Mathematics</h3>
              <p style={styles.score}>{mathScore}/5</p>
            </div>
          </div>

          <div style={styles.totalScore}>
            <h2>Total Score</h2>
            <p style={styles.bigScore}>{totalScore}/15</p>
            <p style={styles.percentage}>{percentage.toFixed(1)}%</p>
          </div>

          <div style={styles.grade}>
            {percentage >= 90 ? '🏆 Outstanding!' :
             percentage >= 75 ? '🌟 Excellent!' :
             percentage >= 60 ? '✅ Good!' :
             percentage >= 40 ? '📚 Keep Practicing!' :
             '💪 Need More Preparation!'}
          </div>

          <button onClick={() => window.location.reload()} style={styles.retakeButton}>
            Retake Exam
          </button>
        </div>
      </div>
    );
  }

  const currentQ = examQuestions[currentSubject][currentQuestion];
  const currentKey = `${currentSubject}-${currentQuestion}`;
  const selectedAnswer = answers[currentKey];

  const subjectIcons = {
    physics: '⚛️',
    chemistry: '🧪',
    mathematics: '📐'
  };

  const subjectNames = {
    physics: 'Physics',
    chemistry: 'Chemistry',
    mathematics: 'Mathematics'
  };

  return (
    <div style={styles.container}>
      <div style={styles.examCard}>
        <div style={styles.header}>
          <div>
            <h2 style={styles.subjectTitle}>
              {subjectIcons[currentSubject]} {subjectNames[currentSubject]}
            </h2>
            <p style={styles.questionNumber}>
              Question {currentQuestion + 1} of {examQuestions[currentSubject].length}
            </p>
          </div>
          <div style={styles.timer}>
            <span style={timeLeft < 300 ? styles.timerWarning : {}}>
              ⏱️ {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        <div style={styles.questionBox}>
          <h3 style={styles.question}>{currentQ.question}</h3>
          <div style={styles.options}>
            {currentQ.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                style={{
                  ...styles.option,
                  ...(selectedAnswer === idx ? styles.optionSelected : {})
                }}
              >
                <span style={styles.optionLetter}>{String.fromCharCode(65 + idx)}</span>
                {option}
              </button>
            ))}
          </div>
        </div>

        <div style={styles.navigation}>
          <button
            onClick={handlePrevious}
            disabled={isFirstQuestion()}
            style={{
              ...styles.navButton,
              ...(isFirstQuestion() ? styles.navButtonDisabled : {})
            }}
          >
            ← Previous
          </button>

          {isLastQuestion() ? (
            <button onClick={handleSubmit} style={styles.submitButton}>
              Submit Exam
            </button>
          ) : (
            <button onClick={handleNext} style={styles.nextButton}>
              Next →
            </button>
          )}
        </div>

        <div style={styles.progress}>
          <div style={styles.progressBar}>
            <div style={{
              ...styles.progressFill,
              width: `${((Object.keys(answers).length) / 15) * 100}%`
            }} />
          </div>
          <p style={styles.progressText}>
            {Object.keys(answers).length}/15 questions answered
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  },
  startCard: {
    background: 'white',
    borderRadius: '20px',
    padding: '50px',
    maxWidth: '500px',
    width: '100%',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    textAlign: 'center'
  },
  title: {
    fontSize: '36px',
    margin: '0 0 10px 0',
    color: '#333',
    fontWeight: 'bold'
  },
  subtitle: {
    fontSize: '18px',
    color: '#666',
    margin: '0 0 30px 0'
  },
  info: {
    background: '#f8f9ff',
    padding: '20px',
    borderRadius: '10px',
    marginBottom: '30px',
    textAlign: 'left'
  },
  input: {
    width: '100%',
    padding: '15px',
    fontSize: '16px',
    border: '2px solid #ddd',
    borderRadius: '10px',
    marginBottom: '20px',
    boxSizing: 'border-box'
  },
  startButton: {
    width: '100%',
    padding: '15px',
    fontSize: '18px',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'transform 0.2s'
  },
  examCard: {
    background: 'white',
    borderRadius: '20px',
    padding: '40px',
    maxWidth: '800px',
    width: '100%',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '30px',
    flexWrap: 'wrap'
  },
  subjectTitle: {
    fontSize: '28px',
    margin: '0 0 5px 0',
    color: '#333'
  },
  questionNumber: {
    fontSize: '14px',
    color: '#666',
    margin: 0
  },
  timer: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#667eea'
  },
  timerWarning: {
    color: '#e74c3c'
  },
  questionBox: {
    marginBottom: '30px'
  },
  question: {
    fontSize: '20px',
    color: '#333',
    marginBottom: '20px',
    lineHeight: '1.6'
  },
  options: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  option: {
    padding: '15px 20px',
    fontSize: '16px',
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    background: 'white',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  optionLetter: {
    display: 'inline-block',
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    background: '#f0f0f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold'
  },
  optionSelected: {
    borderColor: '#667eea',
    background: '#f0f4ff'
  },
  navigation: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'space-between',
    marginBottom: '20px'
  },
  navButton: {
    padding: '12px 30px',
    fontSize: '16px',
    border: '2px solid #667eea',
    borderRadius: '10px',
    background: 'white',
    color: '#667eea',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  navButtonDisabled: {
    opacity: 0.3,
    cursor: 'not-allowed'
  },
  nextButton: {
    padding: '12px 30px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '10px',
    background: '#667eea',
    color: 'white',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  submitButton: {
    padding: '12px 30px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '10px',
    background: '#27ae60',
    color: 'white',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  progress: {
    marginTop: '20px'
  },
  progressBar: {
    width: '100%',
    height: '8px',
    background: '#e0e0e0',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
    transition: 'width 0.3s'
  },
  progressText: {
    fontSize: '14px',
    color: '#666',
    marginTop: '8px',
    textAlign: 'center'
  },
  resultsCard: {
    background: 'white',
    borderRadius: '20px',
    padding: '50px',
    maxWidth: '700px',
    width: '100%',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    textAlign: 'center'
  },
  studentName: {
    color: '#667eea',
    marginBottom: '30px'
  },
  scoreGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  },
  scoreItem: {
    padding: '20px',
    background: '#f8f9ff',
    borderRadius: '15px'
  },
  subjectIcon: {
    fontSize: '40px',
    marginBottom: '10px'
  },
  score: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#667eea',
    margin: '10px 0 0 0'
  },
  totalScore: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '30px',
    borderRadius: '15px',
    marginBottom: '20px'
  },
  bigScore: {
    fontSize: '48px',
    fontWeight: 'bold',
    margin: '10px 0'
  },
  percentage: {
    fontSize: '24px',
    margin: 0
  },
  grade: {
    fontSize: '28px',
    padding: '20px',
    marginBottom: '30px'
  },
  retakeButton: {
    padding: '15px 40px',
    fontSize: '18px',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer'
  }
};
