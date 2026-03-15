import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  FaLock,
  FaChevronRight,
  FaCrown,
  FaCheckCircle,
  FaGlobe,
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
import PremiumWall from "../components/PremiumWall"; // Adjust path if needed

const questions = [
  // Part I: True / False (6 questions)
  {
    id: 1,
    question: "Ethiopia has the largest proportion of elevated landmass in the African continent and is described as the Roof of East Africa",
    options: { a: "True", b: "False" },
    answer: "a",
    explanation:
      "Ethiopia is often called the 'Roof of Africa' due to its extensive high plateaus and mountains.",
  },
  {
    id: 2,
    question:
      "The economic importance of the Afar depression includes salt extraction, irrigation agriculture and geothermal energy",
    options: { a: "True", b: "False" },
    answer: "a",
    explanation:
      "Afar region is economically significant for salt mining, limited irrigation, and high geothermal potential.",
  },
  {
    id: 3,
    question:
      "The lakes region of the Ethiopian Rift valley area has the highest potential for tourism and geothermal energy production",
    options: { a: "True", b: "False" },
    answer: "a",
    explanation:
      "The central Rift Valley lakes attract tourists and the area has strong geothermal resources.",
  },
  {
    id: 4,
    question:
      "Lowlands of Ethiopia are densely settled with sedentary life and permanent settlements as compared to Highlands",
    options: { a: "True", b: "False" },
    answer: "b",
    explanation:
      "Highlands have denser population and sedentary agriculture; lowlands are mostly pastoral/nomadic.",
  },
  {
    id: 5,
    question:
      "Awash and Gibe rivers are inland drainage systems that flow within the Rift-valley system of Ethiopia",
    options: { a: "True", b: "False" },
    answer: "a",
    explanation:
      "Both rivers are part of the Ethiopian Rift Valley drainage and do not reach the ocean.",
  },
  {
    id: 6,
    question:
      "The Inter-tropical Convergence Zone (ITCZ) is a high pressure area where winds Converge",
    options: { a: "True", b: "False" },
    answer: "b",
    explanation:
      "ITCZ is a low-pressure zone of convergence, not high-pressure.",
  },

  // Part II: Matching (5 questions)
  {
    id: 7,
    question: "Formed from Mesozoic limestone rock",
    options: {
      a: "Kobar Sink",
      b: "Sof Omar cave",
      c: "Tulu-Demtu Mountain",
      d: "Awash River",
      e: "Abay River",
      f: "Wabishebele River",
      g: "Ras-Dejen Mountain",
    },
    answer: "b",
    explanation: "Sof Omar Caves are formed in Mesozoic limestone.",
  },
  {
    id: 8,
    question: "The lowest point in Ethiopia",
    options: {
      a: "Kobar Sink",
      b: "Sof Omar cave",
      c: "Tulu-Demtu Mountain",
      d: "Awash River",
      e: "Abay River",
      f: "Wabishebele River",
      g: "Ras-Dejen Mountain",
    },
    answer: "a",
    explanation:
      "Kobar Sink in the Danakil Depression is approximately 125 m below sea level.",
  },
  {
    id: 9,
    question: "Afro-alpine summit of Senetti plateau",
    options: {
      a: "Kobar Sink",
      b: "Sof Omar cave",
      c: "Tulu-Demtu Mountain",
      d: "Awash River",
      e: "Abay River",
      f: "Wabishebele River",
      g: "Ras-Dejen Mountain",
    },
    answer: "c",
    explanation:
      "Tulu Demtu (4,377 m) is the highest point on the Sanetti Plateau.",
  },
  {
    id: 10,
    question: "The largest river in volumetric discharge",
    options: {
      a: "Kobar Sink",
      b: "Sof Omar cave",
      c: "Tulu-Demtu Mountain",
      d: "Awash River",
      e: "Abay River",
      f: "Wabishebele River",
      g: "Ras-Dejen Mountain",
    },
    answer: "e",
    explanation:
      "Abay (Blue Nile) has the highest volumetric discharge among Ethiopian rivers.",
  },
  {
    id: 11,
    question: "The most exploited river in Ethiopia",
    options: {
      a: "Kobar Sink",
      b: "Sof Omar cave",
      c: "Tulu-Demtu Mountain",
      d: "Awash River",
      e: "Abay River",
      f: "Wabishebele River",
      g: "Ras-Dejen Mountain",
    },
    answer: "d",
    explanation:
      "Awash River is heavily utilized for irrigation, industry, and hydropower.",
  },

  // Part III: Multiple Choice (selected key questions)
  {
    id: 12,
    question:
      "The spatial distribution of temperature in Ethiopia is primarily determined by",
    options: {
      a: "Altitude and latitude",
      b: "Distance from the Sea",
      c: "Latitude and cloud cover",
      d: "Distribution of Land and water",
    },
    answer: "a",
    explanation:
      "Altitude is the dominant factor due to Ethiopia's highland topography.",
  },
  {
    id: 13,
    question: "All are true about Afar triangle except",
    options: {
      a: "It is the widest part of the rift valley",
      b: "It is generally milder and marshy",
      c: "It is the largest part of the rift valley",
      d: "It is lowest part of the rift valley",
    },
    answer: "b",
    explanation:
      "Afar is one of the hottest and driest places on Earth — not mild or marshy.",
  },
  {
    id: 14,
    question: "Wet summer rainfall regions are located in",
    options: {
      a: "Windward side of mountains",
      b: "High altitudes",
      c: "Leeward side of mountains",
      d: "All except B",
    },
    answer: "a",
    explanation: "Orographic rainfall occurs mainly on windward slopes.",
  },
  {
    id: 15,
    question:
      "During which event does the Northern Hemisphere experience the longest daylight of the year?",
    options: {
      a: "The summer solstice",
      b: "The autumn equinox",
      c: "The winter solstice",
      d: "The vernal equinox",
    },
    answer: "a",
    explanation: "Summer solstice (~June 21) has the longest day north of equator.",
  },
  {
    id: 16,
    question: "What atmospheric phenomenon mainly controls the rainfall of Ethiopia?",
    options: {
      a: "El Nino-Southern Oscillation (ENSO)",
      b: "Gulf Stream",
      c: "Polar jet stream",
      d: "Intertropical Convergence Zone",
    },
    answer: "d",
    explanation: "The seasonal migration of the ITCZ drives Ethiopia's rainfall.",
  },
  // You can continue adding the remaining MCQs (17–24) in the same format if needed

  // Part V: Calculation (descriptive – no auto-grading)
  {
    id: 35,
    question:
      "Calculate the temperature for place Y (2000m altitude) if the sea level temperature is 45°C, using the Environmental Lapse Rate (6.5°C per 1km).",
    options: {
      a: "32°C",
      b: "38.5°C",
      c: "25°C",
      d: "45°C",
    },
    answer: "a",
    explanation:
      "The Environmental Lapse Rate is 6.5°C per 1000m. For 2000m, the temperature decreases by 13°C (6.5 * 2). So, 45°C - 13°C = 32°C.",
  },
];

export default function GeographyFinalExam() {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const [revealedAnswers, setRevealedAnswers] = useState({});
  const [isPremium, setIsPremium] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes
  const [examStarted, setExamStarted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkPremiumStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setIsPremium(false);
          setLoadingProfile(false);
          return;
        }
        const response = await axios.get(
          "http://localhost:5000/api/students/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setIsPremium(response.data.student.subscriptionStatus === "premium");
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
        setTimeLeft((prev) => {
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

  const handleChange = (qid, value) => {
    if (submitted) return;
    setAnswers({ ...answers, [qid]: value });
  };

  const toggleReveal = (qid) => {
    setRevealedAnswers((prev) => ({ ...prev, [qid]: !prev[qid] }));
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
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(
      2,
      "0"
    )}`;
  };

  const demoLimit = 10;
  const displayQuestions = isPremium ? questions : questions.slice(0, demoLimit);
  const score = displayQuestions.filter(
    (q) => answers[q.id] === q.answer
  ).length;
  const percentage = Math.round(
    (score / displayQuestions.length) * 100
  );

  if (loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-blue-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300 font-semibold">
            Loading Geography Final Exam...
          </p>
        </div>
      </div>
    );
  }

  if (!examStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FaGlobe className="text-3xl text-white" />
            </div>
            <h1 className="text-4xl font-black text-white mb-4">
              Geography Final Exam
            </h1>
            <p className="text-slate-300 text-lg">
              Physical Geography of Ethiopia • Final Assessment
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <span className="text-slate-300">Total Questions:</span>
              <span className="text-white font-bold">
                {isPremium ? questions.length : `${demoLimit} (Demo)`}
              </span>
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
                <span className="text-yellow-500 font-semibold">
                  Demo Version
                </span>
              </div>
              <p className="text-slate-300 text-sm">
                You're viewing the first {demoLimit} questions.{" "}
                <Link
                  to="/subscribe-premium"
                  className="text-blue-400 hover:text-blue-300 ml-1"
                >
                  Upgrade to Premium
                </Link>{" "}
                for full access.
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
              className="flex-1 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
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
            <FaGlobe className="text-green-400 text-xl" />
            <span className="text-white font-bold">Geography Final Exam</span>
            <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full flex items-center gap-1">
              <FaLightbulb className="text-xs" />
              Study Mode
            </span>
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
              <span
                className={`font-mono text-lg ${timeLeft < 300 ? "text-red-400" : "text-white"
                  }`}
              >
                {formatTime(timeLeft)}
              </span>
            </div>

            {submitted && (
              <div className="flex items-center gap-2">
                <span className="text-slate-300">Score:</span>
                <span
                  className={`font-bold text-lg ${percentage >= 70 ? "text-green-400" : "text-red-400"
                    }`}
                >
                  {score}/{displayQuestions.length} ({percentage}%)
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="h-1 bg-slate-800">
          <div
            className="h-full bg-green-500 transition-all duration-300"
            style={{ width: `${((3600 - timeLeft) / 3600) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6">
        {/* Question Navigation */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 mb-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-300 text-sm">
              {Object.keys(answers).length} of {displayQuestions.length} answered
            </span>
          </div>

          {/* Color Legend */}
          <div className="flex items-center gap-4 mb-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-600 rounded"></div>
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
                    ? "bg-green-600 text-white"
                    : isCorrect
                      ? "bg-green-600 text-white"
                      : isIncorrect
                        ? "bg-red-600 text-white"
                        : isAnswered
                          ? "bg-yellow-600 text-white"
                          : "bg-slate-700 text-slate-300 hover:bg-slate-600"
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
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                {currentQuestion + 1}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-4 leading-relaxed">
                  {displayQuestions[currentQuestion].question}
                </h2>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              {Object.entries(displayQuestions[currentQuestion].options).map(
                ([key, value]) => {
                  const isSelected =
                    answers[displayQuestions[currentQuestion].id] === key;
                  const isCorrect =
                    displayQuestions[currentQuestion].answer === key;
                  const showResult = submitted;

                  return (
                    <label
                      key={key}
                      className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${isSelected
                        ? showResult
                          ? isCorrect
                            ? "bg-green-500/20 border-green-500"
                            : "bg-red-500/20 border-red-500"
                          : "bg-green-500/20 border-green-500"
                        : showResult && isCorrect
                          ? "bg-green-500/10 border-green-500/50"
                          : "bg-white/5 border-slate-600 hover:border-slate-500"
                        } ${submitted ? "cursor-default" : "hover:bg-white/10"}`}
                    >
                      <input
                        type="radio"
                        name={`question-${displayQuestions[currentQuestion].id}`}
                        value={key}
                        checked={isSelected}
                        onChange={() =>
                          handleChange(
                            displayQuestions[currentQuestion].id,
                            key
                          )
                        }
                        disabled={submitted}
                        className="sr-only"
                      />
                      <div
                        className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center transition-all ${isSelected
                          ? showResult
                            ? isCorrect
                              ? "bg-green-500 border-green-500"
                              : "bg-red-500 border-red-500"
                            : "bg-green-500 border-green-500"
                          : "border-slate-400"
                          }`}
                      >
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
                        <span className="text-white font-medium">
                          {value}
                        </span>
                      </div>
                    </label>
                  );
                }
              )}
            </div>

            {/* Navigation */}
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
                onClick={() =>
                  setCurrentQuestion(
                    Math.min(displayQuestions.length - 1, currentQuestion + 1)
                  )
                }
                disabled={currentQuestion === displayQuestions.length - 1}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold rounded-xl transition-all flex items-center gap-2"
              >
                Next
                <FaChevronRight />
              </button>
            </div>

            {/* Explanation */}
            {answers[displayQuestions[currentQuestion].id] &&
              displayQuestions[currentQuestion].answer && (
                <div className="mt-8 pt-6 border-t border-slate-600">
                  <button
                    onClick={() =>
                      toggleReveal(displayQuestions[currentQuestion].id)
                    }
                    className="flex items-center gap-2 text-green-400 hover:text-green-300 font-semibold mb-4 transition-all"
                  >
                    <FaLightbulb />
                    {revealedAnswers[displayQuestions[currentQuestion].id] ||
                      showAnswers
                      ? "Hide"
                      : "Show"}{" "}
                    Explanation
                    <FaChevronRight
                      className={`transition-transform ${revealedAnswers[displayQuestions[currentQuestion].id] ||
                        showAnswers
                        ? "rotate-90"
                        : ""
                        }`}
                    />
                  </button>

                  {(showAnswers ||
                    revealedAnswers[displayQuestions[currentQuestion].id]) && (
                      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                        <div className="flex items-center gap-3 mb-4">
                          {answers[displayQuestions[currentQuestion].id] ===
                            displayQuestions[currentQuestion].answer ? (
                            <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm font-bold rounded-full flex items-center gap-2">
                              <FaCheckCircle />
                              Correct!
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-red-500/20 text-red-400 text-sm font-bold rounded-full flex items-center gap-2">
                              <FaTimesCircle />
                              Incorrect
                            </span>
                          )}
                          <span className="text-slate-300">
                            Correct Answer:{" "}
                            <span className="text-green-400 font-bold">
                              {displayQuestions[currentQuestion].answer.toUpperCase()}
                            </span>
                          </span>
                        </div>
                        <p className="text-slate-300 leading-relaxed">
                          <span className="text-green-400 font-semibold">
                            Explanation:{" "}
                          </span>
                          {displayQuestions[currentQuestion].explanation}
                        </p>

                        {/* Study Tips */}
                        <div className="mt-4 p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                          <div className="flex items-center gap-2 text-green-400 font-semibold mb-2">
                            <FaLightbulb />
                            Study Tip:
                          </div>
                          <p className="text-green-300 text-sm">
                            {answers[displayQuestions[currentQuestion].id] === displayQuestions[currentQuestion].answer
                              ? "Excellent! You have a solid grasp of Ethiopian geography. This knowledge is essential for understanding the country's physical landscape."
                              : "Review the key geographical features of this region. Understanding the relationship between altitude and climate is crucial for this topic."
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

        {/* Bottom Controls */}
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl p-4 border border-slate-700 shadow-2xl flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-all"
            >
              <FaArrowLeft />
            </button>

            {!submitted ? (
              <button
                onClick={() => setSubmitted(true)}
                className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all flex items-center gap-2"
              >
                <FaCheck />
                Submit Exam
              </button>
            ) : (
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-slate-400 text-xs uppercase tracking-wider">
                    Final Score
                  </div>
                  <div
                    className={`text-xl font-bold ${percentage >= 70 ? "text-green-400" : "text-red-400"
                      }`}
                  >
                    {score}/{displayQuestions.length} ({percentage}%)
                  </div>
                </div>

                <button
                  onClick={() => setShowAnswers(!showAnswers)}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all flex items-center gap-2"
                >
                  <FaBookOpen />
                  {showAnswers ? "Hide" : "Show"} All Answers
                </button>

                <button
                  onClick={resetExam}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all flex items-center gap-2"
                >
                  <FaRedo />
                  Retake
                </button>
              </div>
            )}
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
                <div className="text-slate-400 text-sm">Correct</div>
              </div>
              <div className="text-center p-4 bg-slate-800/50 rounded-xl">
                <div
                  className={`text-3xl font-bold mb-2 ${percentage >= 70 ? "text-green-400" : "text-red-400"
                    }`}
                >
                  {percentage}%
                </div>
                <div className="text-slate-400 text-sm">Score</div>
              </div>
              <div className="text-center p-4 bg-slate-800/50 rounded-xl">
                <div
                  className={`text-lg font-bold mb-2 ${percentage >= 70 ? "text-green-400" : "text-red-400"
                    }`}
                >
                  {percentage >= 70 ? "PASSED" : "FAILED"}
                </div>
                <div className="text-slate-400 text-sm">Status</div>
              </div>
            </div>

            {percentage >= 70 ? (
              <div className="mt-6 p-4 bg-green-500/20 border border-green-500/50 rounded-xl">
                <div className="flex items-center gap-3 text-green-400 font-semibold mb-2">
                  <FaCheckCircle />
                  Congratulations!
                </div>
                <p className="text-green-300 text-sm">
                  Excellent performance on Ethiopian Geography.
                </p>
              </div>
            ) : (
              <div className="mt-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl">
                <div className="flex items-center gap-3 text-red-400 font-semibold mb-2">
                  <FaTimesCircle />
                  Keep practicing
                </div>
                <p className="text-red-300 text-sm">
                  Review explanations and try again.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}