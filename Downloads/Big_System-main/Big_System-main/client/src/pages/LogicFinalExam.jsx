import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  FaLock, FaChevronRight, FaCrown, FaCheckCircle, FaBrain,
  FaArrowLeft, FaClock, FaHistory, FaCheck, FaTimesCircle,
  FaPlay, FaRedo, FaBookOpen, FaLightbulb
} from "react-icons/fa";
import PremiumWall from "../components/PremiumWall";

const questions = [
  { id: 1, question: "Which one of the following is wrong about philosophy?", options: { a: "Denial of common sense knowledge", b: "Outright rejection of religious, cultural and social worldviews", c: "Attempt to justify knowledge", d: "Practical and normative knowledge" }, answer: "b", explanation: "Philosophy critically examines beliefs but does not reject them outright." },
  { id: 2, question: "For any passage to be an argumentative passage:", options: { a: "Must contain evidence", b: "Must show hidden whims", c: "Must contain a claim and conclusion", d: "A and C" }, answer: "d", explanation: "Arguments require premises and a conclusion." },
  { id: 3, question: "No traffic accident has ever occurred in Addis Ababa... This argument is:", options: { a: "Inductive, Uncogent", b: "Deductive, Unsound", c: "Inductive, Cogent", d: "Deductive, Sound" }, answer: "b", explanation: "The argument is deductive but based on a false premise." },
  { id: 4, question: "The definition of prime number uses which technique?", options: { a: "Sub-class", b: "Etymological", c: "Genus and Difference", d: "Operational" }, answer: "c", explanation: "It defines by class and distinguishing property." },
  { id: 5, question: "Which argument commits the fallacy of ambiguity?", options: { a: "Abolish government", b: "Suitor example", c: "Tax argument", d: "Rich people righteousness" }, answer: "b", explanation: "The word 'suitor' is used with two meanings." },
  { id: 6, question: "Defining mountain by listing examples is:", options: { a: "Etymological", b: "Enumerative", c: "Subclass", d: "Operational" }, answer: "b", explanation: "It lists members of the class." },
  { id: 7, question: "Every Ethiopian believes... Who are you to be an exception?", options: { a: "Bandwagon", b: "Pity", c: "Force", d: "Against the person" }, answer: "a", explanation: "Appeal to popularity." },
  { id: 8, question: "David is lighter than John... therefore David is lighter than Henry:", options: { a: "Inductive Weak", b: "Deductive Valid", c: "Deductive Invalid", d: "Inductive Strong" }, answer: "b", explanation: "The conclusion follows necessarily." },
  { id: 9, question: "Trump free speech argument commits which fallacy?", options: { a: "False cause", b: "Straw man", c: "Accident", d: "Missing the point" }, answer: "c", explanation: "A general rule is misapplied." },
  { id: 10, question: "Abolishing exams to reduce stress is:", options: { a: "Suppressed evidence", b: "Begging the question", c: "Missing the point", d: "Oversimplified" }, answer: "c", explanation: "Conclusion does not address the real issue." },
  { id: 11, question: "Which is not a metaphysical question?", options: { a: "What is reality?", b: "Does God exist?", c: "Nature of existence", d: "How do we know?" }, answer: "d", explanation: "This is epistemology." },
  { id: 12, question: "No proof cell phones cause cancer, therefore they don't:", options: { a: "Ad hominem", b: "Appeal to ignorance", c: "Missing the point", d: "Appeal to authority" }, answer: "b", explanation: "Lack of proof is taken as proof." },
  { id: 13, question: "Political activist punishment analogy is:", options: { a: "Appeal to ignorance", b: "Slippery slope", c: "Weak analogy", d: "Suppressed evidence" }, answer: "c", explanation: "The analogy is weak." },
  { id: 14, question: "Which argument is deductively invalid?", options: { a: "Wealth and happiness", b: "Surgeons and allergists", c: "Men philosophers", d: "Physicians and lawyers" }, answer: "c", explanation: "Conclusion does not logically follow." },
  { id: 15, question: "Freedom of expression reply commits:", options: { a: "Accident", b: "Missing the point", c: "Straw man", d: "Red herring" }, answer: "b", explanation: "The harassment issue is ignored." },
  { id: 16, question: "Mechanic vs physician argument is:", options: { a: "Straw man", b: "Missing the point", c: "Weak analogy", d: "False dilemma" }, answer: "c", explanation: "The comparison is weak." },
  { id: 17, question: "Incorrect about Straw Man and Red Herring:", options: { a: "Red herring draws conclusion", b: "Straw man distorts", c: "Both divert attention", d: "Both emotional" }, answer: "a", explanation: "Red herring avoids the conclusion." },
  { id: 18, question: "If a deductive argument is unsound:", options: { a: "Invalid", b: "False premises", c: "Both", d: "None" }, answer: "d", explanation: "Unsound may still be valid." },
  { id: 19, question: "Correct about philosophy branches:", options: { a: "Epistemology = reality", b: "Metaphysics = ethics", c: "Axiology = knowledge", d: "Ontology = being" }, answer: "d", explanation: "Ontology studies existence." },
  { id: 20, question: "Which statement is true?", options: { a: "Irrelevant premises imply fallacy", b: "Chain causes = slippery slope", c: "Failure to prove = ignorance always", d: "Composition always transfers" }, answer: "a", explanation: "Logical irrelevance defines fallacy." },
  { id: 21, question: "Helping poor countries argument is:", options: { a: "Appeal to people", b: "Appeal to pity", c: "No fallacy", d: "Red herring" }, answer: "b", explanation: "It appeals to emotion." },
  { id: 22, question: "Fallibility principle implies:", options: { a: "Recognize own limits", b: "Commitment to truth", c: "Clarity to reason", d: "All" }, answer: "a", explanation: "Fallibility means admitting possible error." },
  { id: 23, question: "Critical thinkers are NOT characterized by:", options: { a: "Desire for clarity", b: "Intellectual honesty", c: "Welcoming criticism", d: "Lack of bias awareness" }, answer: "d", explanation: "They are aware of their biases." },
  { id: 24, question: "Concerned with nature of reality:", options: { a: "Empiricism", b: "Metaphysics", c: "Epistemology", d: "Axiology" }, answer: "b", explanation: "Metaphysics studies reality." },
  { id: 25, question: "Diverting the original argument is:", options: { a: "False cause", b: "Red herring", c: "Oversimplified", d: "Straw man" }, answer: "b", explanation: "Red herring distracts from the issue." },
  { id: 26, question: "Argumentum ad baculum is:", options: { a: "Appeal to pity", b: "Threat-based argument", c: "Circular reasoning", d: "Distraction" }, answer: "b", explanation: "It appeals to force or threat." },
  { id: 27, question: "Argumentum ad misericordiam means:", options: { a: "Appeal to pity", b: "Appeal to force", c: "Appeal to authority", d: "Appeal to ignorance" }, answer: "a", explanation: "It exploits feelings of pity." },
  { id: 28, question: "Petitio principii is:", options: { a: "Appeal to emotion", b: "Circular reasoning", c: "Distraction", d: "Weak analogy" }, answer: "b", explanation: "The conclusion is assumed in premises." },
  { id: 29, question: "Red herring fallacy:", options: { a: "Attacks person", b: "Changes topic", c: "Uses analogy", d: "Uses threat" }, answer: "b", explanation: "It diverts attention." },
  { id: 30, question: "Unsupported assertions are:", options: { a: "Facts", b: "Beliefs without evidence", c: "Definitions", d: "Analogies" }, answer: "b", explanation: "They lack supporting evidence." },
  { id: 31, question: "Illustration means:", options: { a: "Defining terms", b: "Giving examples", c: "Giving orders", d: "Arguing logically" }, answer: "b", explanation: "Examples make ideas clear." },
  { id: 32, question: "An uncogent argument is:", options: { a: "Valid", b: "Strong", c: "Weak or false premise", d: "Sound" }, answer: "c", explanation: "Inductive but weak or false." },
  { id: 33, question: "Precising definition is used to:", options: { a: "Remove vagueness", b: "Add emotion", c: "Attack opponent", d: "List examples" }, answer: "a", explanation: "It reduces vagueness." },
  { id: 34, question: "Enumerative definition:", options: { a: "Lists members", b: "Explains cause", c: "Defines by function", d: "Uses theory" }, answer: "a", explanation: "It lists members individually." },
  { id: 35, question: "Lexical definition is also called:", options: { a: "Theoretical", b: "Dictionary definition", c: "Operational", d: "Precising" }, answer: "b", explanation: "It reports standard usage." },
  { id: 36, question: "Crust of bread is better than nothing... fallacy:", options: { a: "Equivocation", b: "Amphiboly", c: "Begging the question", d: "Accident" }, answer: "a", explanation: "The word 'nothing' is ambiguous." },
  { id: 37, question: "Green pen causing A grade is:", options: { a: "Begging question", b: "Ad hominem", c: "False cause", d: "Red herring" }, answer: "c", explanation: "False causal connection." },
  { id: 38, question: "Religious fanatics argument is:", options: { a: "Begging the question", b: "Red herring", c: "No fallacy", d: "Slippery slope" }, answer: "a", explanation: "Circular reasoning." },
  { id: 39, question: "An argument whose conclusion rests on similarity is:", options: { a: "Valid argument", b: "Inductive argument", c: "Sound argument", d: "Cogent argument" }, answer: "b", explanation: "Arguments from analogy are inductive." },
  { id: 40, question: "The definition 'A painter's easel is an easel used by a painter' is criticized as:", options: { a: "Negative", b: "Too broad", c: "Vague", d: "Circular" }, answer: "d", explanation: "The term is defined using itself." },
  { id: 41, question: "Green pen causes A grade is which fallacy?", options: { a: "Begging the question", b: "Ad hominem", c: "False cause", d: "Red herring" }, answer: "c", explanation: "Mistaken causal connection." },
  { id: 42, question: "Religious fanatics argument commits:", options: { a: "Begging the question", b: "Red herring", c: "No fallacy", d: "Slippery slope" }, answer: "a", explanation: "Circular reasoning is used." },
  { id: 43, question: "Argumentum ad baculum emphasizes:", options: { a: "Emotion", b: "Threat or force", c: "Authority", d: "Ignorance" }, answer: "b", explanation: "It appeals to fear or force." },
  { id: 44, question: "Argumentum ad misericordiam is:", options: { a: "Appeal to pity", b: "Appeal to popularity", c: "Appeal to authority", d: "Appeal to ignorance" }, answer: "a", explanation: "It exploits pity or guilt." },
  { id: 45, question: "Red herring fallacy does what?", options: { a: "Distorts argument", b: "Attacks person", c: "Diverts attention", d: "Uses analogy" }, answer: "c", explanation: "It distracts from the issue." },
  { id: 46, question: "Egocentrism means:", options: { a: "Group-centered thinking", b: "Self-centered thinking", c: "Open-mindedness", d: "Logical thinking" }, answer: "b", explanation: "Egocentrism centers reality on oneself." },
  { id: 47, question: "The principle of rebuttal requires:", options: { a: "Ignoring objections", b: "Answering objections", c: "Attacking opponent", d: "Using emotion" }, answer: "b", explanation: "Good arguments respond to criticisms." },
  { id: 48, question: "Which is a barrier to critical thinking?", options: { a: "Clarity", b: "Egocentrism", c: "Fair-mindedness", d: "Reason" }, answer: "b", explanation: "Egocentrism blocks objective thinking." },
  { id: 49, question: "Enumerative definition means:", options: { a: "Defining by cause", b: "Listing members", c: "Defining by function", d: "Defining theoretically" }, answer: "b", explanation: "It lists members individually." },
  { id: 50, question: "The study of being and existence is:", options: { a: "Epistemology", b: "Axiology", c: "Ontology", d: "Logic" }, answer: "c", explanation: "Ontology studies existence." }
];

export default function LogicFinalExam() {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const [revealedAnswers, setRevealedAnswers] = useState({});
  const [isPremium, setIsPremium] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3600);
  const [examStarted, setExamStarted] = useState(false);
  const [examMode, setExamMode] = useState('study'); // 'study' or 'exam'
  const [showHints, setShowHints] = useState(false);
  const [hintsUsed, setHintsUsed] = useState({});
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
          <p className="text-slate-300 font-semibold">Loading Logic Final Exam...</p>
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
              <FaBrain className="text-3xl text-white" />
            </div>
            <h1 className="text-4xl font-black text-white mb-4">Logic Final Exam</h1>
            <p className="text-slate-300 text-lg">Department of Social Sciences • Critical Thinking Assessment</p>
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
            <FaBrain className="text-blue-400 text-xl" />
            <span className="text-white font-bold">Logic Final Exam</span>
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

            {/* Explanation Section - Show immediately after answering */}
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
                          ? "Great job! This type of logical reasoning will help you in critical thinking scenarios."
                          : "Review the logical structure of this argument. Practice identifying premises and conclusions to improve your reasoning skills."
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
                <div className="text-slate-400 text-sm">Status</div>
              </div>
            </div>

            <div className="bg-slate-800/30 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-300">Progress</span>
                <span className="text-white font-semibold">{score} / {displayQuestions.length}</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-1000 ${percentage >= 70 ? 'bg-green-500' : 'bg-red-500'}`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>

            {percentage >= 70 ? (
              <div className="mt-6 p-4 bg-green-500/20 border border-green-500/50 rounded-xl">
                <div className="flex items-center gap-3 text-green-400 font-semibold mb-2">
                  <FaCheckCircle />
                  Congratulations! You passed the exam.
                </div>
                <p className="text-green-300 text-sm">
                  Excellent work on your Logic and Critical Thinking assessment. You've demonstrated strong analytical skills.
                </p>
              </div>
            ) : (
              <div className="mt-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl">
                <div className="flex items-center gap-3 text-red-400 font-semibold mb-2">
                  <FaTimesCircle />
                  You need more practice to pass this exam.
                </div>
                <p className="text-red-300 text-sm">
                  Review the explanations and retake the exam when you're ready. Focus on logical reasoning and critical thinking principles.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}