import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  FaLock,
  FaChevronRight,
  FaCrown,
  FaCheckCircle,
  FaBook,
  FaArrowLeft,
  FaClock,
  FaHistory,
  FaCheck,
  FaTimesCircle,
  FaPlay,
  FaRedo,
  FaBookOpen,
  FaLightbulb,
} from "react-icons/fa";
import PremiumWall from "../components/PremiumWall";

const questions = [
  // Reading Comprehension Questions
  {
    id: 1,
    question: "The author describes wearing garlic (line 1) as an example of",
    options: {
      a: "an arcane practice considered odd and superstitious today.",
      b: "the ludicrous nature of complementary and alternative medicine.",
      c: "a scientifically tested medical practice.",
      d: "a socially unacceptable style of jewelry."
    },
    answer: "a",
    explanation: "The author contrasts the past practice of wearing garlic with modern views, implying it is now seen as odd and superstitious."
  },
  {
    id: 2,
    question: "The author's primary purpose in the passage is to:",
    options: {
      a: "confirm the safety and effectiveness of alternative medicine approaches.",
      b: "convey the excitement of crossing new medical frontiers.",
      c: "describe the recent increase in the use of alternative therapies.",
      d: "criticize the use of alternative therapies that have not been scientifically tested."
    },
    answer: "c",
    explanation: "The passage focuses on trends, statistics, and reasons for the growing popularity of CAM in the U.S."
  },
  {
    id: 3,
    question: "The statistic comparing total visits to alternative medicine practitioners with those to primary care physicians is used to illustrate the",
    options: {
      a: "popularity of alternative medicine.",
      b: "declining quality of primary care.",
      c: "high cost of alternative treatments.",
      d: "public's distrust of conventional doctors."
    },
    answer: "a",
    explanation: "The large number of visits to alternative providers shows how widespread CAM has become."
  },
  {
    id: 4,
    question: "The author most likely uses the Harvard survey results to imply that:",
    options: {
      a: "as people age they always become more conservative.",
      b: "people born before 1945 view alternative therapies with disdain.",
      c: "the survey did not question baby boomers on the topic.",
      d: "many young adults are open-minded to alternative therapies."
    },
    answer: "d",
    explanation: "The survey shows that younger generations are more likely to use CAM, suggesting openness to non-traditional healthcare."
  },
  {
    id: 5,
    question: "The author suggests that crossing the line into mainstream medicine involves",
    options: {
      a: "performing stringently controlled research on alternative therapies.",
      b: "accepting the spiritual dimension of preventing and treating illness.",
      c: "approving of any treatments that a patient is interested in trying.",
      d: "recognizing the popularity of alternative therapies."
    },
    answer: "a",
    explanation: "The passage states that some therapies enter mainstream medicine 'as scientific investigation has confirmed their safety and efficacy.'"
  },
  {
    id: 6,
    question: "The information in paragraph 4 indicates that Americans believe that conventional healthcare",
    options: {
      a: "offers the best relief from the effects of chronic diseases.",
      b: "should not use technology in treating illness.",
      c: "combines caring for the body with caring for the spirit.",
      d: "falls short of their expectations in some aspects."
    },
    answer: "d",
    explanation: "The text says some turn to CAM because they are frustrated by managed care's time constraints."
  },
  {
    id: 7,
    question: "What is the possible title of this passage?",
    options: {
      a: "Herbs as alternative medicine.",
      b: "The public's growing interest in alternative medicine practices in twenty-first century in United States.",
      c: "American people spend large amount of money for alternative medicine.",
      d: "The public abandoned conventional medicine."
    },
    answer: "b",
    explanation: "The passage discusses rising usage, spending, and reasons for the trend, making this the most comprehensive title."
  },
  {
    id: 8,
    question: "In the last paragraph, the author refers to garlic use again in order to",
    options: {
      a: "cite an example of the fraudulent claims of herbal supplements.",
      b: "suggest that claims about some herbs may be legitimate.",
      c: "mock people who take garlic capsules.",
      d: "reason why some Americans are drawn to alternative health methods."
    },
    answer: "b",
    explanation: "The author mentions observational studies linking garlic to cancer prevention, implying some herbal benefits might be real."
  },

  // Vocabulary Questions
  {
    id: 9,
    question: "What does 'conventional' mean in paragraph 2, line 2?",
    options: {
      a: "traditional, mainstream, standard",
      b: "alternative, different, unusual",
      c: "modern, new, innovative",
      d: "medical, clinical, scientific"
    },
    answer: "a",
    explanation: "'Conventional medicine' refers to standard Western medical practice."
  },
  {
    id: 10,
    question: "What does 'complement' mean in paragraph 2, line 1?",
    options: {
      a: "something that completes or enhances something else",
      b: "something that replaces or substitutes",
      c: "something that contradicts or opposes",
      d: "something that complicates or confuses"
    },
    answer: "a",
    explanation: "'Complementary' medicine is used alongside conventional treatment."
  },
  {
    id: 11,
    question: "What does 'alienated' mean in paragraph 4, line 5?",
    options: {
      a: "feeling isolated, estranged, or disconnected",
      b: "feeling welcomed, accepted, or included",
      c: "feeling confused, puzzled, or uncertain",
      d: "feeling satisfied, content, or pleased"
    },
    answer: "a",
    explanation: "Some patients feel alienated by the impersonal, technology-focused approach of conventional medicine."
  },

  // Vocabulary in Context Questions
  {
    id: 12,
    question: "Entertainment-focused websites... use carefully crafted titles and easily digestible content often ______ by algorithms to be maximally attention-catching.",
    options: { a: "diligent", b: "honed", c: "virtual", d: "ostracized" },
    answer: "b",
    explanation: "'Honed' means refined or perfected, which fits the context of content optimized by algorithms."
  },
  {
    id: 13,
    question: "Progressively, the massive obese will ______ themselves from society.",
    options: { a: "diligent", b: "ostracize", c: "procrastinate", d: "invaluable" },
    answer: "b",
    explanation: "'Ostracize' means to exclude or cast out from society."
  },
  {
    id: 14,
    question: "Everyone faces the challenge of tracking more and more ______ meetings, contacts, and to-dos.",
    options: { a: "virtual", b: "routine", c: "endeavor", d: "alleviate" },
    answer: "a",
    explanation: "'Virtual' meetings have become increasingly common in modern work environments."
  },
  {
    id: 15,
    question: "This reduces our mind's instinct to ______ and delivers an injection of motivation.",
    options: { a: "procrastinate", b: "brutalized", c: "subservient", d: "fancy" },
    answer: "a",
    explanation: "Procrastination is the tendency to delay or postpone tasks."
  },
  {
    id: 16,
    question: "Such contacts have been ______ in developing mutual understanding.",
    options: { a: "invaluable", b: "scornful", c: "routine", d: "armoured" },
    answer: "a",
    explanation: "'Invaluable' means extremely useful or priceless."
  },

  // Grammar Questions - Tense
  {
    id: 17,
    question: "Kevin Adams ______ trains.",
    options: { a: "love", b: "loves", c: "loving", d: "loved" },
    answer: "b",
    explanation: "Present simple tense for a habitual action with third person singular subject."
  },
  {
    id: 18,
    question: "He first ______ one when he was four.",
    options: { a: "see", b: "sees", c: "saw", d: "seeing" },
    answer: "c",
    explanation: "Past simple tense for a completed action in the past."
  },
  {
    id: 19,
    question: "He ______ it was great.",
    options: { a: "think", b: "thinks", c: "thinking", d: "thought" },
    answer: "d",
    explanation: "Past simple tense for a thought in the past."
  },
  {
    id: 20,
    question: "He ______ to a different railway station every week nowadays.",
    options: { a: "go", b: "goes", c: "going", d: "went" },
    answer: "b",
    explanation: "Present simple tense for a regular habitual action with adverb 'nowadays'."
  },
  {
    id: 21,
    question: "He ______ down the engine number of every train he sees.",
    options: { a: "write", b: "writes", c: "writing", d: "wrote" },
    answer: "b",
    explanation: "Present simple tense for a habitual action."
  },
  {
    id: 22,
    question: "He ______ this since he was eight.",
    options: { a: "do", b: "does", c: "doing", d: "has been doing" },
    answer: "d",
    explanation: "Present perfect continuous for an action that started in the past and continues to the present."
  },
  {
    id: 23,
    question: "By the time he was fifteen, he ______ over 10,000 different engine numbers.",
    options: { a: "collect", b: "collects", c: "had collected", d: "collecting" },
    answer: "c",
    explanation: "Past perfect for an action completed before another past action."
  },
  {
    id: 24,
    question: "Once, while he ______ in a station in Cheshire...",
    options: { a: "stand", b: "stands", c: "standing", d: "was standing" },
    answer: "d",
    explanation: "Past continuous for an ongoing action in the past when interrupted."
  },

  // Conditional Questions
  {
    id: 25,
    question: "If you ______ with us, you ______ an awesome movie.",
    options: { a: "had come / would have seen", b: "came / would see", c: "come / will see", d: "have come / would see" },
    answer: "a",
    explanation: "Third conditional for a hypothetical past situation."
  },
  {
    id: 26,
    question: "If you ______ me the ending, you ______ it for me.",
    options: { a: "tell / will spoil", b: "told / would spoil", c: "tells / spoils", d: "telling / spoiling" },
    answer: "a",
    explanation: "First conditional for a possible future situation."
  },
  {
    id: 27,
    question: "What ______ your childhood ______ like if you ______ in a different family?",
    options: { a: "would be / have been / had been born", b: "will be / be / were born", c: "is / been / are born", d: "would have been / been / had been born" },
    answer: "a",
    explanation: "Second conditional for a hypothetical present situation based on a past condition."
  },
  {
    id: 28,
    question: "If I ______ you, I ______ to do better.",
    options: { a: "am / will try", b: "was / would try", c: "were / would try", d: "have been / would have tried" },
    answer: "c",
    explanation: "Second conditional - 'were' is used for hypothetical situations."
  }
];

export default function EnglishCommunicationExam() {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const [revealedAnswers, setRevealedAnswers] = useState({});
  const [isPremium, setIsPremium] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3600);
  const [examStarted, setExamStarted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkPremiumStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setIsPremium(false);
          setLoadingProfile(false);
          return;
        }
        const response = await axios.get('http://localhost:5000/api/students/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsPremium(response.data.student.subscriptionStatus === 'premium');
      } catch (error) {
        console.error("Error checking premium status:", error);
        setIsPremium(false);
      } finally {
        setLoadingProfile(false);
      }
    };
    checkPremiumStatus();
  }, []);

  useEffect(() => {
    let timer;
    if (examStarted && timeLeft > 0 && !submitted) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setSubmitted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [examStarted, timeLeft, submitted]);

  const handleChange = (qid, option) => {
    if (submitted) return;
    setAnswers({ ...answers, [qid]: option });
  };

  const toggleReveal = (qid) => {
    setRevealedAnswers(prev => ({ ...prev, [qid]: !prev[qid] }));
  };

  const startExam = () => {
    setExamStarted(true);
    setTimeLeft(3600);
  };

  const resetExam = () => {
    setAnswers({});
    setSubmitted(false);
    setShowAnswers(false);
    setRevealedAnswers({});
    setCurrentQuestion(0);
    setTimeLeft(3600);
    setExamStarted(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const demoLimit = 10;
  const displayQuestions = isPremium ? questions : questions.slice(0, demoLimit);
  const score = displayQuestions.filter((q) => answers[q.id] === q.answer).length;
  const percentage = Math.round((score / displayQuestions.length) * 100);

  if (loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-blue-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300 font-semibold">Loading English Communication Exam...</p>
        </div>
      </div>
    );
  }

  if (!examStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FaBook className="text-3xl text-white" />
            </div>
            <h1 className="text-4xl font-black text-white mb-4">English Communication Exam</h1>
            <p className="text-slate-300 text-lg">Department of English Language & Communication Skills</p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <span className="text-slate-300">Total Questions:</span>
              <span className="text-white font-bold">{isPremium ? questions.length : `${demoLimit} (Demo)`}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <span className="text-slate-300">Time Limit:</span>
              <span className="text-white font-bold">60 Minutes</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <span className="text-slate-300">Passing Score:</span>
              <span className="text-white font-bold">70%</span>
            </div>
          </div>

          {!isPremium && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3 mb-2">
                <FaLock className="text-yellow-500" />
                <span className="text-yellow-500 font-semibold">Demo Version</span>
              </div>
              <p className="text-slate-300 text-sm">
                You're viewing the first {demoLimit} questions.
                <Link to="/subscribe-premium" className="text-blue-400 hover:text-blue-300 ml-1">
                  Upgrade to Premium
                </Link> for the complete exam.
              </p>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex-1 py-4 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <FaArrowLeft />
              Back
            </button>
            <button
              onClick={startExam}
              className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <FaPlay />
              Start Exam
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 pt-20 pb-32">
      {/* Timer Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <FaBook className="text-blue-400 text-xl" />
            <span className="text-white font-bold">English Communication Exam</span>
            {isPremium && (
              <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-bold rounded-full flex items-center gap-1">
                <FaCrown className="text-xs" />
                PRO
              </span>
            )}
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-slate-300">
              <FaClock />
              <span className={`font-mono text-lg ${timeLeft < 300 ? 'text-red-400' : 'text-white'}`}>
                {formatTime(timeLeft)}
              </span>
            </div>

            {submitted && (
              <div className="flex items-center gap-2">
                <span className="text-slate-300">Score:</span>
                <span className={`font-bold text-lg ${percentage >= 70 ? 'text-green-400' : 'text-red-400'}`}>
                  {score}/{displayQuestions.length} ({percentage}%)
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="h-1 bg-slate-800">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${((3600 - timeLeft) / 3600) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6">
        {/* Question Navigation */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 mb-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Question Navigation</h3>
            <span className="text-slate-300 text-sm">
              {Object.keys(answers).length} of {displayQuestions.length} answered
            </span>
          </div>

          {/* Color Legend */}
          <div className="flex items-center gap-4 mb-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-600 rounded"></div>
              <span className="text-slate-300">Current</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-600 rounded"></div>
              <span className="text-slate-300">Correct</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-600 rounded"></div>
              <span className="text-slate-300">Incorrect</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-slate-700 rounded"></div>
              <span className="text-slate-300">Unanswered</span>
            </div>
          </div>
          <div className="grid grid-cols-10 gap-2">
            {displayQuestions.map((q, idx) => {
              const isAnswered = answers[q.id];
              const isCorrect = isAnswered && answers[q.id] === q.answer;
              const isIncorrect = isAnswered && answers[q.id] !== q.answer;

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestion(idx)}
                  className={`w-10 h-10 rounded-lg text-sm font-bold transition-all relative ${currentQuestion === idx
                    ? 'bg-blue-600 text-white'
                    : isCorrect
                      ? 'bg-green-600 text-white'
                      : isIncorrect
                        ? 'bg-red-600 text-white'
                        : isAnswered
                          ? 'bg-yellow-600 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                >
                  {idx + 1}
                  {isCorrect && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full flex items-center justify-center">
                      <FaCheck className="text-xs text-white" />
                    </div>
                  )}
                  {isIncorrect && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full flex items-center justify-center">
                      <FaTimesCircle className="text-xs text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Current Question */}
        {displayQuestions[currentQuestion] && (
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 mb-6 border border-white/20">
            <div className="flex items-start gap-6 mb-6">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                {currentQuestion + 1}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-4 leading-relaxed">
                  {displayQuestions[currentQuestion].question}
                </h2>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              {Object.entries(displayQuestions[currentQuestion].options).map(([key, value]) => {
                const isSelected = answers[displayQuestions[currentQuestion].id] === key;
                const isCorrect = displayQuestions[currentQuestion].answer === key;
                const showResult = submitted;

                return (
                  <label
                    key={key}
                    className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${isSelected
                      ? showResult
                        ? isCorrect
                          ? 'bg-green-500/20 border-green-500'
                          : 'bg-red-500/20 border-red-500'
                        : 'bg-blue-500/20 border-blue-500'
                      : showResult && isCorrect
                        ? 'bg-green-500/10 border-green-500/50'
                        : 'bg-white/5 border-slate-600 hover:border-slate-500'
                      } ${submitted ? 'cursor-default' : 'hover:bg-white/10'}`}
                  >
                    <input
                      type="radio"
                      name={`question-${displayQuestions[currentQuestion].id}`}
                      value={key}
                      checked={isSelected}
                      onChange={() => handleChange(displayQuestions[currentQuestion].id, key)}
                      disabled={submitted}
                      className="sr-only"
                    />
                    <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center transition-all ${isSelected
                      ? showResult
                        ? isCorrect
                          ? 'bg-green-500 border-green-500'
                          : 'bg-red-500 border-red-500'
                        : 'bg-blue-500 border-blue-500'
                      : 'border-slate-400'
                      }`}>
                      {isSelected && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                      {showResult && isCorrect && !isSelected && (
                        <FaCheck className="text-green-500 text-xs" />
                      )}
                    </div>
                    <div className="flex-1">
                      <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">
                        Option {key.toUpperCase()}
                      </span>
                      <span className="text-white font-medium">{value}</span>
                    </div>
                  </label>
                );
              })}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <button
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold rounded-xl transition-all flex items-center gap-2"
              >
                <FaArrowLeft />
                Previous
              </button>

              <button
                onClick={() => setCurrentQuestion(Math.min(displayQuestions.length - 1, currentQuestion + 1))}
                disabled={currentQuestion === displayQuestions.length - 1}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold rounded-xl transition-all flex items-center gap-2"
              >
                Next
                <FaChevronRight />
              </button>
            </div>

            {/* Explanation Section */}
            {answers[displayQuestions[currentQuestion].id] && (
              <div className="mt-8 pt-6 border-t border-slate-600">
                <button
                  onClick={() => toggleReveal(displayQuestions[currentQuestion].id)}
                  className="flex items-center gap-2 text-blue-400 hover:text-blue-300 font-semibold mb-4 transition-all"
                >
                  <FaLightbulb />
                  {revealedAnswers[displayQuestions[currentQuestion].id] || showAnswers ? 'Hide' : 'Show'} Explanation
                  <FaChevronRight className={`transition-transform ${revealedAnswers[displayQuestions[currentQuestion].id] || showAnswers ? 'rotate-90' : ''}`} />
                </button>

                {(showAnswers || revealedAnswers[displayQuestions[currentQuestion].id]) && (
                  <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                    <div className="flex items-center gap-3 mb-4">
                      {answers[displayQuestions[currentQuestion].id] === displayQuestions[currentQuestion].answer ? (
                        <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm font-bold rounded-full flex items-center gap-2">
                          <FaCheckCircle />
                          Correct Answer!
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-red-500/20 text-red-400 text-sm font-bold rounded-full flex items-center gap-2">
                          <FaTimesCircle />
                          Incorrect Answer
                        </span>
                      )}
                      <span className="text-slate-300">
                        Correct Answer: <span className="text-blue-400 font-bold">{displayQuestions[currentQuestion].answer.toUpperCase()}</span>
                      </span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      <span className="text-blue-400 font-semibold">Explanation: </span>
                      {displayQuestions[currentQuestion].explanation}
                    </p>

                    {/* Study Tips */}
                    <div className="mt-4 p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                      <div className="flex items-center gap-2 text-blue-400 font-semibold mb-2">
                        <FaLightbulb />
                        Study Tip:
                      </div>
                      <p className="text-blue-300 text-sm">
                        {answers[displayQuestions[currentQuestion].id] === displayQuestions[currentQuestion].answer
                          ? "Great job! This type of question tests your understanding of English communication concepts."
                          : "Review the explanation carefully. Understanding these concepts will improve your English communication skills."
                        }
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Premium Wall */}
        {!isPremium && <PremiumWall limit={demoLimit} total={questions.length} />}

        {/* Control Panel */}
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl p-4 border border-slate-700 shadow-2xl">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-all"
              >
                <FaArrowLeft />
              </button>

              {!submitted ? (
                <button
                  onClick={() => setSubmitted(true)}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all flex items-center gap-2"
                >
                  <FaCheck />
                  Submit Exam
                </button>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-slate-400 text-xs uppercase tracking-wider">Final Score</div>
                    <div className={`text-xl font-bold ${percentage >= 70 ? 'text-green-400' : 'text-red-400'}`}>
                      {score}/{displayQuestions.length} ({percentage}%)
                    </div>
                  </div>

                  <button
                    onClick={() => setShowAnswers(!showAnswers)}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all flex items-center gap-2"
                  >
                    <FaBookOpen />
                    {showAnswers ? 'Hide' : 'Show'} All Answers
                  </button>

                  <button
                    onClick={resetExam}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all flex items-center gap-2"
                  >
                    <FaRedo />
                    Retake Exam
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results Summary */}
        {submitted && (
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 mb-8 border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <FaHistory />
              Exam Results
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center p-4 bg-slate-800/50 rounded-xl">
                <div className="text-3xl font-bold text-white mb-2">{score}</div>
                <div className="text-slate-400 text-sm">Correct Answers</div>
              </div>
              <div className="text-center p-4 bg-slate-800/50 rounded-xl">
                <div className={`text-3xl font-bold mb-2 ${percentage >= 70 ? 'text-green-400' : 'text-red-400'}`}>
                  {percentage}%
                </div>
                <div className="text-slate-400 text-sm">Final Score</div>
              </div>
              <div className="text-center p-4 bg-slate-800/50 rounded-xl">
                <div className={`text-lg font-bold mb-2 ${percentage >= 70 ? 'text-green-400' : 'text-red-400'}`}>
                  {percentage >= 70 ? 'PASSED' : 'FAILED'}
                </div>
                <div className="text-slate-400 text-sm">Result</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
