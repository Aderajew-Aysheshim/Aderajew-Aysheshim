import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaClock, FaArrowLeft, FaArrowRight, FaCheckCircle, FaTimesCircle, FaRedo, FaFlag, FaQuestionCircle, FaBook, FaMicroscope, FaDna, FaLeaf, FaPaw } from 'react-icons/fa';

// Biology questions data organized by units/chapters
const biologyQuestions = {
  unit1: [
    {
      id: 1,
      question: "Which of the following is the smallest unit of life?",
      options: [
        "Cell",
        "Tissue",
        "Organ",
        "Organism"
      ],
      correctAnswer: 0,
      explanation: "The cell is the basic structural and functional unit of all living organisms. It is the smallest unit that can carry out all life processes."
    },
    {
      id: 2,
      question: "What is the primary function of the cell membrane?",
      options: [
        "Energy production",
        "Genetic material storage",
        "Regulating what enters and exits the cell",
        "Protein synthesis"
      ],
      correctAnswer: 2,
      explanation: "The cell membrane acts as a selective barrier, controlling the movement of substances in and out of the cell while maintaining the cell's internal environment."
    },
    {
      id: 3,
      question: "Which organelle is known as the 'powerhouse of the cell'?",
      options: [
        "Nucleus",
        "Mitochondria",
        "Ribosome",
        "Endoplasmic reticulum"
      ],
      correctAnswer: 1,
      explanation: "Mitochondria are called the powerhouse of the cell because they generate most of the cell's supply of adenosine triphosphate (ATP), used as a source of chemical energy."
    }
  ],
  unit2: [
    {
      id: 4,
      question: "What is the process by which plants make their own food?",
      options: [
        "Respiration",
        "Photosynthesis",
        "Transpiration",
        "Fermentation"
      ],
      correctAnswer: 1,
      explanation: "Photosynthesis is the process by which green plants, algae, and some bacteria convert light energy into chemical energy stored in glucose."
    },
    {
      id: 5,
      question: "Which gas is essential for photosynthesis?",
      options: [
        "Nitrogen",
        "Oxygen",
        "Carbon dioxide",
        "Hydrogen"
      ],
      correctAnswer: 2,
      explanation: "Carbon dioxide is essential for photosynthesis as it provides the carbon atoms needed to build glucose molecules during the Calvin cycle."
    },
    {
      id: 6,
      question: "What is the relationship between plants and animals in an ecosystem?",
      options: [
        "Competition",
        "Predation",
        "Mutualism",
        "Producer-consumer"
      ],
      correctAnswer: 3,
      explanation: "Plants are producers that create their own food through photosynthesis, while animals are consumers that obtain energy by eating plants or other animals."
    }
  ],
  unit3: [
    {
      id: 7,
      question: "What is the basic unit of heredity?",
      options: [
        "Chromosome",
        "Gene",
        "DNA",
        "Protein"
      ],
      correctAnswer: 1,
      explanation: "A gene is the basic physical and functional unit of heredity. Genes are made up of DNA and act as instructions to make molecules called proteins."
    },
    {
      id: 8,
      question: "How many chromosomes do human somatic cells normally contain?",
      options: [
        "23",
        "46",
        "69",
        "92"
      ],
      correctAnswer: 1,
      explanation: "Human somatic (body) cells normally contain 46 chromosomes, arranged in 23 pairs. This includes 22 pairs of autosomes and one pair of sex chromosomes."
    },
    {
      id: 9,
      question: "What is the probability of having a male child in humans?",
      options: [
        "25%",
        "50%",
        "75%",
        "100%"
      ],
      correctAnswer: 1,
      explanation: "In humans, sex is determined by the combination of sex chromosomes. The probability of having a male (XY) or female (XX) child is approximately 50% each."
    }
  ],
  unit4: [
    {
      id: 10,
      question: "Who proposed the theory of evolution by natural selection?",
      options: [
        "Gregor Mendel",
        "Charles Darwin",
        "Louis Pasteur",
        "Alexander Fleming"
      ],
      correctAnswer: 1,
      explanation: "Charles Darwin proposed the theory of evolution by natural selection in his 1859 book 'On the Origin of Species,' explaining how species change over time."
    },
    {
      id: 11,
      question: "What is the term for the survival of the fittest?",
      options: [
        "Artificial selection",
        "Natural selection",
        "Sexual selection",
        "Random selection"
      ],
      correctAnswer: 1,
      explanation: "Natural selection is the process where organisms better adapted to their environment tend to survive and produce more offspring, often described as 'survival of the fittest.'"
    },
    {
      id: 12,
      question: "What evidence supports the theory of evolution?",
      options: [
        "Fossil records only",
        "Genetic similarities only",
        "Comparative anatomy only",
        "All of the above"
      ],
      correctAnswer: 3,
      explanation: "Multiple lines of evidence support evolution, including fossil records, genetic similarities between species, comparative anatomy, embryology, and biogeography."
    }
  ],
  unit5: [
    {
      id: 13,
      question: "What is innate behavior?",
      options: [
        "Learned behavior",
        "Instinctive behavior",
        "Social behavior",
        "Imprinted behavior"
      ],
      correctAnswer: 1,
      explanation: "Innate behavior is instinctive behavior that is genetically programmed and present from birth, without prior learning or experience."
    },
    {
      id: 14,
      question: "Which of the following is an example of classical conditioning?",
      options: [
        "A dog learning to fetch",
        "Pavlov's dogs salivating at a bell",
        "A bird building a nest",
        "A spider spinning a web"
      ],
      correctAnswer: 1,
      explanation: "Classical conditioning, demonstrated by Pavlov's experiments, involves learning to associate a neutral stimulus with an automatic response."
    },
    {
      id: 15,
      question: "What is the main purpose of animal communication?",
      options: [
        "Entertainment",
        "Survival and reproduction",
        "Exercise",
        "Competition only"
      ],
      correctAnswer: 1,
      explanation: "Animal communication primarily serves survival and reproduction purposes, including finding mates, warning of predators, marking territory, and coordinating group activities."
    }
  ]
};

const unitIcons = {
  unit1: <FaMicroscope />,
  unit2: <FaLeaf />,
  unit3: <FaDna />,
  unit4: <FaBook />,
  unit5: <FaPaw />
};

const unitNames = {
  unit1: 'Microbiology',
  unit2: 'Ecology',
  unit3: 'Genetics',
  unit4: 'Evolution',
  unit5: 'Behavior'
};

const BiologyPractice = () => {
  const navigate = useNavigate();
  
  const [currentUnit, setCurrentUnit] = useState('unit1');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes per unit

  const currentQuestions = biologyQuestions[currentUnit] || [];
  const currentQuestion = currentQuestions[currentQuestionIndex];

  useEffect(() => {
    // Reset when changing units
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setQuizCompleted(false);
    setTimeLeft(1800);
  }, [currentUnit]);

  useEffect(() => {
    if (timeLeft > 0 && !quizCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !quizCompleted) {
      setQuizCompleted(true);
    }
  }, [timeLeft, quizCompleted]);

  const handleAnswerSelect = (optionIndex) => {
    if (quizCompleted || showExplanation) return;
    
    setSelectedAnswer(optionIndex);
    
    // Save user's answer
    const questionId = currentQuestion.id;
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));

    // Check if correct
    const isCorrect = optionIndex === currentQuestion.correctAnswer;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const handleShowExplanation = () => {
    setShowExplanation(true);
  };

  const handleUnitSelect = (unit) => {
    setCurrentUnit(unit);
  };

  const calculateScore = () => {
    let correct = 0;
    let total = currentQuestions.length;
    
    currentQuestions.forEach(q => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    
    return { correct, total, percentage: (correct / total) * 100 };
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setUserAnswers({});
    setScore(0);
    setQuizCompleted(false);
    setTimeLeft(1800);
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">🔬 Biology Practice</h1>
          <p className="text-xl text-gray-600">No questions available for this unit.</p>
          <button 
            onClick={() => navigate('/grade12-exams')}
            className="mt-6 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Back to Grade 12
          </button>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    const scoreData = calculateScore();
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">🎯 Quiz Completed!</h1>
              <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-2">{unitNames[currentUnit]} Unit</h2>
                <div className="text-xl mb-2">Score: {scoreData.correct} / {scoreData.total}</div>
                <p className="text-xl">Percentage: {scoreData.percentage.toFixed(1)}%</p>
                <div className="mt-4">
                  {scoreData.percentage >= 80 ? (
                    <p className="text-lg">🏆 Excellent work!</p>
                  ) : scoreData.percentage >= 60 ? (
                    <p className="text-lg">👍 Good job!</p>
                  ) : (
                    <p className="text-lg">📚 Keep practicing!</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={resetQuiz} 
                className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <FaRedo /> Restart Unit
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
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
                <h1 className="text-2xl font-bold text-gray-800">🔬 Biology Practice by Chapter</h1>
                <p className="text-sm text-gray-600">2000-2009 Entrance Exam Preparation</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="flex items-center gap-2 text-lg font-semibold text-green-600">
                  <FaClock /> {formatTime(timeLeft)}
                </div>
                <p className="text-xs text-gray-500">Time Remaining</p>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-800">
                  {score}/{currentQuestionIndex + 1}
                </div>
                <p className="text-xs text-gray-500">Current Score</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Unit Selector */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Select Chapter:</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {Object.keys(biologyQuestions).map(unit => (
              <button
                key={unit}
                onClick={() => handleUnitSelect(unit)}
                className={`p-3 rounded-lg font-semibold transition-all ${
                  currentUnit === unit
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center justify-center gap-2 mb-1">
                  {unitIcons[unit]}
                </div>
                <div className="text-sm">
                  Unit {unit.replace('unit', '')}
                </div>
                <div className="text-xs">
                  {unitNames[unit]}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">Progress</span>
            <span className="text-sm text-gray-600">
              Question {currentQuestionIndex + 1} of {currentQuestions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-green-500 to-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / currentQuestions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Question Content */}
          <div className="lg:col-span-3">
            {/* Question Card */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                    Question {currentQuestion.id}
                  </span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {unitNames[currentUnit]}
                  </span>
                </div>
              </div>
              
              <div className="mb-8">
                <p className="text-lg text-gray-800 leading-relaxed">{currentQuestion.question}</p>
              </div>

              <div className="space-y-3 mb-6">
                {currentQuestion.options.map((option, index) => {
                  let optionClass = 'w-full text-left p-4 rounded-lg border-2 transition-all';
                  
                  if (selectedAnswer === index) {
                    optionClass += ' border-green-500 bg-green-50 shadow-md';
                    if (showExplanation) {
                      if (index === currentQuestion.correctAnswer) {
                        optionClass += ' bg-green-100';
                      } else {
                        optionClass += ' bg-red-50 border-red-500';
                      }
                    }
                  } else if (showExplanation && index === currentQuestion.correctAnswer) {
                    optionClass += ' border-green-500 bg-green-100';
                  } else {
                    optionClass += ' border-gray-200 hover:border-gray-300 hover:bg-gray-50';
                  }
                  
                  return (
                    <button
                      key={index}
                      className={optionClass}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={showExplanation || quizCompleted}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          selectedAnswer === index
                            ? 'bg-green-600 text-white'
                            : showExplanation && index === currentQuestion.correctAnswer
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-200 text-gray-700'
                        }`}>
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className="text-gray-800">{option}</span>
                        {showExplanation && index === currentQuestion.correctAnswer && (
                          <FaCheckCircle className="text-green-600 ml-auto" />
                        )}
                        {showExplanation && selectedAnswer === index && index !== currentQuestion.correctAnswer && (
                          <FaTimesCircle className="text-red-600 ml-auto" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              {showExplanation && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center gap-2">
                    <FaQuestionCircle /> Explanation:
                  </h3>
                  <p className="text-gray-700 mb-3">{currentQuestion.explanation}</p>
                  {selectedAnswer === currentQuestion.correctAnswer ? (
                    <p className="text-green-700 font-semibold flex items-center gap-2">
                      <FaCheckCircle /> Correct! Well done.
                    </p>
                  ) : (
                    <p className="text-red-700 font-semibold flex items-center gap-2">
                      <FaTimesCircle /> Incorrect. The correct answer is option {String.fromCharCode(65 + currentQuestion.correctAnswer)}.
                    </p>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between">
                <button 
                  className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  <FaArrowLeft /> Previous
                </button>
                
                <div className="flex gap-3">
                  {!showExplanation && selectedAnswer !== null && (
                    <button 
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                      onClick={handleShowExplanation}
                    >
                      Show Explanation
                    </button>
                  )}
                  
                  <button 
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleNextQuestion}
                    disabled={!selectedAnswer && !showExplanation}
                  >
                    {currentQuestionIndex < currentQuestions.length - 1 ? (
                      <>Next <FaArrowRight /></>
                    ) : (
                      'Finish'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h3 className="font-bold text-gray-800 mb-4">Question Navigator</h3>
              
              <div className="grid grid-cols-3 gap-2 mb-6">
                {currentQuestions.map((q, index) => (
                  <button
                    key={q.id}
                    onClick={() => {
                      setCurrentQuestionIndex(index);
                      setSelectedAnswer(null);
                      setShowExplanation(false);
                    }}
                    className={`w-12 h-12 rounded-lg text-sm font-semibold transition-all ${
                      currentQuestionIndex === index
                        ? 'bg-green-600 text-white ring-2 ring-green-300'
                        : userAnswers[q.id] !== undefined
                        ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    title={`Question ${q.id}`}
                  >
                    {q.id}
                  </button>
                ))}
              </div>
              
              {/* Legend */}
              <div className="border-t pt-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Legend</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-600 rounded"></div>
                    <span>Current</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-100 rounded"></div>
                    <span>Answered</span>
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

export default BiologyPractice;
