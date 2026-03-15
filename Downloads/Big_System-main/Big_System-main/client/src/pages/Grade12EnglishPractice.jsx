import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaClock, FaArrowLeft, FaArrowRight, FaCheckCircle, FaTimesCircle, FaRedo, FaFlag, FaQuestionCircle } from 'react-icons/fa';

const Grade12EnglishPractice = () => {
  const navigate = useNavigate();
  
  // Sample exam data (you can expand this)
  const examData = [
    {
      section: "Grammar",
      questions: [
        {
          id: 1,
          question: "How ______ the piano was through my strong ambitious effort I exerted on it.",
          options: [
            { id: 'A', text: "did I come to learn" },
            { id: 'B', text: "I come to learn" },
            { id: 'C', text: "I came to learn" },
            { id: 'D', text: "did I learn" }
          ],
          correctAnswer: 'C',
          explanation: "This is an exclamatory sentence starting with 'How,' so the structure is: How + subject + verb. 'I came to learn' is correct."
        },
        {
          id: 2,
          question: "He works ______ a security in the Sheraton hotel.",
          options: [
            { id: 'A', text: "like" },
            { id: 'B', text: "as" },
            { id: 'C', text: "for" },
            { id: 'D', text: "in" }
          ],
          correctAnswer: 'B',
          explanation: "The preposition 'as' is used to indicate someone's job role: work as + job title."
        },
        {
          id: 3,
          question: "I wish I ______ rich to help the poor.",
          options: [
            { id: 'A', text: "am" },
            { id: 'B', text: "were" },
            { id: 'C', text: "will be" },
            { id: 'D', text: "can be" }
          ],
          correctAnswer: 'B',
          explanation: "After 'I wish,' we use the subjunctive mood (past tense for present wishes). 'Were' is correct here."
        }
      ]
    },
    {
      section: "Vocabulary",
      questions: [
        {
          id: 4,
          question: "Pride is to lion as school is to ______.",
          options: [
            { id: 'A', text: "teacher" },
            { id: 'B', text: "student" },
            { id: 'C', text: "self-respect" },
            { id: 'D', text: "fish" }
          ],
          correctAnswer: 'D',
          explanation: "This is an analogy: a group of lions is a pride; a group of fish is a school."
        },
        {
          id: 5,
          question: "Sabah's literary work has obtained ______ from among many scholars.",
          options: [
            { id: 'A', text: "awareness" },
            { id: 'B', text: "dominant" },
            { id: 'C', text: "entertainment" },
            { id: 'D', text: "recognition" }
          ],
          correctAnswer: 'D',
          explanation: "'Recognition' means acknowledgment or praise, which fits the context of literary work."
        }
      ]
    },
    {
      section: "Communicative Activities",
      questions: [
        {
          id: 6,
          question: "Genet: I just love your hair that way! Did you do it yourself? Senaet: ______. Yes, I did.",
          options: [
            { id: 'A', text: "Oh, thanks" },
            { id: 'B', text: "Oh, you're welcome" },
            { id: 'C', text: "Never" },
            { id: 'D', text: "Quite well" }
          ],
          correctAnswer: 'A',
          explanation: "'Oh, thanks' is a natural response to a compliment."
        }
      ]
    }
  ];

  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes in seconds
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !showResults) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResults) {
      calculateScore();
    }
  }, [timeLeft, showResults]);

  const handleAnswerSelect = (questionId, answerId) => {
    setAnswers({
      ...answers,
      [questionId]: answerId
    });
  };

  const toggleFlag = (questionId) => {
    const newFlagged = new Set(flaggedQuestions);
    if (newFlagged.has(questionId)) {
      newFlagged.delete(questionId);
    } else {
      newFlagged.add(questionId);
    }
    setFlaggedQuestions(newFlagged);
  };

  const nextQuestion = () => {
    if (currentQuestion < examData[currentSection].questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (currentSection < examData.length - 1) {
      setCurrentSection(currentSection + 1);
      setCurrentQuestion(0);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      setCurrentQuestion(examData[currentSection - 1].questions.length - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    examData.forEach(section => {
      section.questions.forEach(q => {
        if (answers[q.id] === q.correctAnswer) {
          correct++;
        }
      });
    });
    setScore(correct);
    setShowResults(true);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const resetExam = () => {
    setAnswers({});
    setCurrentSection(0);
    setCurrentQuestion(0);
    setShowResults(false);
    setScore(0);
    setTimeLeft(3600);
    setFlaggedQuestions(new Set());
  };

  const currentQ = examData[currentSection].questions[currentQuestion];
  const totalQuestions = examData.reduce((sum, section) => sum + section.questions.length, 0);
  const answeredQuestions = Object.keys(answers).length;

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Results Header */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">🎉 Exam Results 🎉</h1>
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-2">Your Score: {score} / {totalQuestions}</h2>
                <p className="text-xl">Percentage: {((score / totalQuestions) * 100).toFixed(1)}%</p>
                <div className="mt-4">
                  {score >= totalQuestions * 0.8 ? (
                    <p className="text-lg">🏆 Excellent work!</p>
                  ) : score >= totalQuestions * 0.6 ? (
                    <p className="text-lg">👍 Good job!</p>
                  ) : (
                    <p className="text-lg">📚 Keep practicing!</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Detailed Results */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Detailed Review:</h3>
              {examData.map((section, sIndex) => (
                <div key={sIndex} className="bg-gray-50 rounded-xl p-6">
                  <h4 className="text-xl font-bold text-gray-800 mb-4">{section.section}</h4>
                  {section.questions.map(q => {
                    const userAnswer = answers[q.id];
                    const isCorrect = userAnswer === q.correctAnswer;
                    return (
                      <div key={q.id} className={`mb-4 p-4 rounded-lg ${isCorrect ? 'bg-green-100 border-green-300' : 'bg-red-100 border-red-300'} border`}>
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            {isCorrect ? (
                              <FaCheckCircle className="text-green-600 text-xl" />
                            ) : (
                              <FaTimesCircle className="text-red-600 text-xl" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800 mb-2">Q{q.id}: {q.question}</p>
                            <p className="text-sm text-gray-600 mb-1">
                              Your answer: <span className={isCorrect ? 'text-green-700 font-semibold' : 'text-red-700 font-semibold'}>
                                {userAnswer ? q.options.find(o => o.id === userAnswer)?.text : 'Not answered'}
                              </span>
                            </p>
                            {!isCorrect && (
                              <p className="text-sm text-gray-600 mb-1">
                                Correct answer: <span className="text-green-700 font-semibold">
                                  {q.options.find(o => o.id === q.correctAnswer)?.text}
                                </span>
                              </p>
                            )}
                            <p className="text-sm text-gray-700 italic mt-2">
                              <strong>Explanation:</strong> {q.explanation}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-4 mt-8">
              <button 
                onClick={resetExam} 
                className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
              >
                <FaRedo /> Retake Exam
              </button>
              <button 
                onClick={() => navigate('/grade12-exams')}
                className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
              >
                Back to Grade 12
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/grade12-exams')}
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                <FaArrowLeft className="text-xl" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">🏫 Grade 12 English Practice Exam</h1>
                <p className="text-sm text-gray-600">Grammar, Vocabulary & Communication</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="flex items-center gap-2 text-lg font-semibold text-indigo-600">
                  <FaClock /> {formatTime(timeLeft)}
                </div>
                <p className="text-xs text-gray-500">Time Remaining</p>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-800">
                  {answeredQuestions}/{totalQuestions}
                </div>
                <p className="text-xs text-gray-500">Answered</p>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-semibold text-orange-600">
                  {flaggedQuestions.size}
                </div>
                <p className="text-xs text-gray-500">Flagged</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Exam Content */}
          <div className="lg:col-span-3">
            {/* Section Header */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">{examData[currentSection].section}</h2>
                <span className="text-sm text-gray-500">
                  Question {currentQuestion + 1} of {examData[currentSection].questions.length}
                </span>
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-semibold">
                    Question {currentQ.id}
                  </span>
                  {flaggedQuestions.has(currentQ.id) && (
                    <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                      <FaFlag /> Flagged
                    </span>
                  )}
                </div>
                <button
                  onClick={() => toggleFlag(currentQ.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    flaggedQuestions.has(currentQ.id) 
                      ? 'bg-orange-100 text-orange-600 hover:bg-orange-200' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title="Flag for review"
                >
                  <FaFlag />
                </button>
              </div>
              
              <div className="mb-8">
                <p className="text-lg text-gray-800 leading-relaxed">{currentQ.question}</p>
              </div>

              <div className="space-y-3">
                {currentQ.options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswerSelect(currentQ.id, option.id)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      answers[currentQ.id] === option.id
                        ? 'border-indigo-500 bg-indigo-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        answers[currentQ.id] === option.id
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}>
                        {option.id}
                      </span>
                      <span className="text-gray-800">{option.text}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <button 
                  onClick={prevQuestion} 
                  disabled={currentQuestion === 0 && currentSection === 0}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaArrowLeft /> Previous
                </button>
                
                <div className="flex gap-3">
                  <button 
                    onClick={calculateScore} 
                    className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    Submit Exam
                  </button>
                  
                  <button 
                    onClick={nextQuestion} 
                    disabled={
                      currentQuestion === examData[currentSection].questions.length - 1 && 
                      currentSection === examData.length - 1
                    }
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next <FaArrowRight />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Question Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaQuestionCircle /> Question Navigator
              </h3>
              
              {examData.map((section, sIndex) => (
                <div key={sIndex} className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">{section.section}</h4>
                  <div className="grid grid-cols-5 gap-2">
                    {section.questions.map((q, qIndex) => (
                      <button
                        key={q.id}
                        onClick={() => {
                          setCurrentSection(sIndex);
                          setCurrentQuestion(qIndex);
                        }}
                        className={`w-10 h-10 rounded-lg text-sm font-semibold transition-all ${
                          currentSection === sIndex && currentQuestion === qIndex
                            ? 'bg-indigo-600 text-white ring-2 ring-indigo-300'
                            : answers[q.id]
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : flaggedQuestions.has(q.id)
                            ? 'bg-orange-100 text-orange-800 hover:bg-orange-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        title={`Question ${q.id}`}
                      >
                        {q.id}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              
              {/* Legend */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Legend</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-indigo-600 rounded"></div>
                    <span>Current</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-100 rounded"></div>
                    <span>Answered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-orange-100 rounded"></div>
                    <span>Flagged</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-100 rounded"></div>
                    <span>Not Answered</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Grade12EnglishPractice;
