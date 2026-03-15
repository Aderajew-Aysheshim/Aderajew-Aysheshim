import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaClock, FaCheck, FaTimes, FaArrowLeft, FaArrowRight, FaFlag } from 'react-icons/fa';

const Grade12MathematicsEntrance = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(7200); // 2 hours in seconds
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());

  const questions = [
    {
      id: 1,
      question: "If f(x) = 2x² + 3x - 5, find f(-2).",
      options: ["-3", "3", "7", "-7"],
      correct: 0
    },
    {
      id: 2,
      question: "Solve for x: 2x + 7 = 15",
      options: ["x = 4", "x = 3", "x = 8", "x = 11"],
      correct: 0
    },
    {
      id: 3,
      question: "What is the derivative of f(x) = x³ + 2x² - 3x + 1?",
      options: ["3x² + 4x - 3", "3x² + 4x + 3", "3x² - 4x - 3", "3x² - 4x + 3"],
      correct: 0
    },
    {
      id: 4,
      question: "Find the value of sin(30°).",
      options: ["1/2", "√3/2", "√2/2", "0"],
      correct: 0
    },
    {
      id: 5,
      question: "If log₂(x) = 3, what is x?",
      options: ["6", "8", "9", "12"],
      correct: 1
    },
    {
      id: 6,
      question: "What is the area of a circle with radius 5cm?",
      options: ["25π cm²", "10π cm²", "5π cm²", "50π cm²"],
      correct: 0
    },
    {
      id: 7,
      question: "Solve: x² - 9 = 0",
      options: ["x = ±3", "x = 3", "x = -3", "x = 9"],
      correct: 0
    },
    {
      id: 8,
      question: "What is the limit of (x² - 1)/(x - 1) as x approaches 1?",
      options: ["0", "1", "2", "Undefined"],
      correct: 2
    },
    {
      id: 9,
      question: "Find the sum of the first 10 natural numbers.",
      options: ["45", "55", "65", "75"],
      correct: 1
    },
    {
      id: 10,
      question: "If tan(θ) = 3/4, what is cos(θ)?",
      options: ["3/5", "4/5", "5/3", "5/4"],
      correct: 1
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionId, optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleFlagQuestion = (questionId) => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Calculate score
    let correct = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correct) {
        correct++;
      }
    });

    const score = (correct / questions.length) * 100;

    // Simulate API call to save results
    setTimeout(() => {
      setShowResults(true);
      setIsSubmitting(false);
    }, 2000);
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correct) {
        correct++;
      }
    });
    return (correct / questions.length) * 100;
  };

  if (showResults) {
    const score = calculateScore();
    const correct = questions.filter(q => answers[q.id] === q.correct).length;

    return (
      <div className="min-h-screen bg-[#0a0f1d] text-slate-200 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full bg-slate-800 rounded-2xl p-8 text-center">
          <div className="mb-8">
            <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center text-5xl font-bold ${score >= 70 ? 'bg-green-500/20 text-green-400' :
                score >= 50 ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
              }`}>
              {Math.round(score)}%
            </div>
          </div>

          <h2 className="text-3xl font-bold text-white mb-4">Exam Completed!</h2>
          <p className="text-xl text-slate-300 mb-8">
            You got {correct} out of {questions.length} questions correct
          </p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-slate-700 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-400">{correct}</div>
              <div className="text-sm text-slate-400">Correct</div>
            </div>
            <div className="bg-slate-700 rounded-lg p-4">
              <div className="text-2xl font-bold text-red-400">{questions.length - correct}</div>
              <div className="text-sm text-slate-400">Incorrect</div>
            </div>
            <div className="bg-slate-700 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-400">{flaggedQuestions.size}</div>
              <div className="text-sm text-slate-400">Flagged</div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => navigate('/grade12-exams')}
              className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Back to Exams
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Retake Exam
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-slate-200">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/grade12-exams')}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <FaArrowLeft />
              </button>
              <div>
                <h1 className="text-xl font-bold text-white">Mathematics Entrance Exam</h1>
                <p className="text-sm text-slate-400">Grade 12 University Entrance</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-red-400">
                <FaClock />
                <span className="font-mono text-lg">{formatTime(timeRemaining)}</span>
              </div>

              <div className="text-sm">
                <span className="text-slate-400">Question:</span>
                <span className="text-white font-bold ml-2">
                  {currentQuestion + 1} / {questions.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-slate-900 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex gap-1">
            {questions.map((q, index) => (
              <div
                key={q.id}
                className={`flex-1 h-2 rounded-full transition-colors ${index < currentQuestion ? 'bg-green-500' :
                    index === currentQuestion ? 'bg-purple-500' :
                      'bg-slate-600'
                  }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Question Navigation */}
      <div className="bg-slate-900 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-wrap gap-2">
            {questions.map((q, index) => (
              <button
                key={q.id}
                onClick={() => setCurrentQuestion(index)}
                className={`w-10 h-10 rounded-lg font-medium transition-colors ${answers[q.id] !== undefined ?
                    (answers[q.id] === q.correct ? 'bg-green-600 text-white' : 'bg-red-600 text-white') :
                    flaggedQuestions.has(q.id) ? 'bg-yellow-600 text-white' :
                      index === currentQuestion ? 'bg-purple-600 text-white' :
                        'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-slate-800 rounded-2xl p-8">
          {/* Question */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                Question {currentQuestion + 1}
              </h2>
              <button
                onClick={() => handleFlagQuestion(questions[currentQuestion].id)}
                className={`p-2 rounded-lg transition-colors ${flaggedQuestions.has(questions[currentQuestion].id)
                    ? 'bg-yellow-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
              >
                <FaFlag />
              </button>
            </div>

            <p className="text-xl text-slate-200 leading-relaxed">
              {questions[currentQuestion].question}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-4 mb-8">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(questions[currentQuestion].id, index)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${answers[questions[currentQuestion].id] === index
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-slate-600 hover:border-slate-500 bg-slate-700/50'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${answers[questions[currentQuestion].id] === index
                      ? 'border-purple-500 bg-purple-500'
                      : 'border-slate-500'
                    }`}>
                    {answers[questions[currentQuestion].id] === index && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <span className="text-lg text-slate-200">{option}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <FaArrowLeft /> Previous
            </button>

            <div className="flex gap-4">
              {currentQuestion === questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || Object.keys(answers).length === 0}
                  className="px-8 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-bold"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Exam'}
                </button>
              ) : (
                <button
                  onClick={() => setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1))}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  Next <FaArrowRight />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Grade12MathematicsEntrance;
