import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  FaGraduationCap, FaBook, FaCrown, FaAward, FaCertificate, FaCalculator,
  FaAtom, FaBrain, FaFlask, FaMicroscope, FaRunning, FaRocket, FaCalendar
} from 'react-icons/fa';
import {
  FiClock, FiUsers, FiStar, FiTarget, FiBookOpen, FiCheck, FiX,
  FiUnlock, FiZap
} from 'react-icons/fi';

const ExamPreparation = () => {
  const [selectedExam, setSelectedExam] = useState('all');
  const [student, setStudent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudent();
  }, []);

  const fetchStudent = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await axios.get('http://localhost:5000/api/students/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.student) setStudent(response.data.student);
      }
    } catch (error) {
      console.error('Error fetching student:', error);
      localStorage.removeItem('token');
    }
  };

  const handleEnrollment = (exam, isPremium) => {
    if (!student) {
      navigate('/login');
    } else if (isPremium) {
      navigate('/exam-payment', { state: { exam } });
    } else {
      // Mock enrollment logic
      alert(`Enrolled in free version of ${exam.title}`);
    }
  };

  const examTypes = [
    {
      id: 'ngat',
      title: 'NGAT Mock Exam Package',
      description: 'Comprehensive preparation for the National Graduate Admission Test (NGAT). Includes aptitude, quantitative, and verbal reasoning sets.',
      price: 150,
      originalPrice: 220,
      icon: <FaCertificate />,
      color: 'from-blue-600 to-indigo-600',
      difficulty: 'Advanced',
      students: '1.2k+',
      duration: '40+ Practice Sets',
      rating: '4.9',
      features: ['2016 model exams', 'Analytical reasoning sets', 'Verbal logic drills', 'Timed mock simulations'],
      subjects: ['Aptitude', 'Quantitative', 'Verbal', 'Analytical'],
      link: '/ngat-preparation',
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=900&h=600&fit=crop&auto=format",
      subExams: [
        { title: "Verbal Reasoning Mock 1", link: "/ngat-test/verbal-1" },
        { title: "Quantitative Aptitude Mock 1", link: "/ngat-test/quant-1" },
        { title: "Analytical Logic Model", link: "/ngat-test/analytical-1" }
      ]
    },
    {
      id: 'grade12',
      title: 'Grade 12 National Exam Hub',
      description: 'Complete preparation hub for Grade 12 students. Natural and Social stream subjects covered with previous model exams.',
      price: 100,
      originalPrice: 150,
      icon: <FaGraduationCap />,
      color: 'from-purple-600 to-indigo-600',
      difficulty: 'Grade 12',
      students: '4.5k+',
      duration: 'Lifetime Access',
      rating: '4.8',
      features: ['All stream subjects', '2016 ministry models', 'Chapter-wise quizzes', 'Detailed solutions'],
      subjects: ['Math', 'Physics', 'Biology', 'Chemistry', 'English', 'Aptitude'],
      link: '/grade12-exams',
      image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=900&h=600&fit=crop&auto=format",
      subExams: [
        { title: "Natural Stream Model 2016", link: "/grade12-exams/natural-2016" },
        { title: "Social Stream Model 2016", link: "/grade12-exams/social-2016" },
        { title: "Scholastic Aptitude Set", link: "/grade12-exams/aptitude" }
      ]
    },
    {
      id: 'exit',
      title: 'University Exit Exam Masterclass',
      description: 'Stream-specific preparation for graduating students. Law, Engineering, Medicine, and Business ministry models available.',
      price: 200,
      originalPrice: 300,
      icon: <FaAward />,
      color: 'from-emerald-600 to-teal-600',
      difficulty: 'Professional',
      students: '2.1k+',
      duration: 'Course Specific',
      rating: '4.7',
      features: ['Departmental model exams', 'Past papers archive', 'Video review lessons', 'Exam blueprints'],
      subjects: ['Engineering', 'Health Science', 'Law', 'Business'],
      link: '/exit-exams',
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=900&h=600&fit=crop&auto=format",
      subExams: [
        { title: "Civil Engineering Exit Mock", link: "/exit-exams/civil" },
        { title: "Computer Science Exit Mock", link: "/exit-exams/cs" },
        { title: "Medicine & Health Licensing", link: "/exit-exams/health" }
      ]
    },
    {
      id: 'freshman',
      title: 'AASTU Freshman Final Exams',
      description: 'The definitive resources for AASTU and ASTU freshman courses. Logic, Math, Physics, and IT exam archives.',
      price: 250,
      originalPrice: 350,
      icon: <FaBook />,
      color: 'from-orange-500 to-red-600',
      difficulty: 'Targeted',
      students: '3.3k+',
      duration: 'Full Semester',
      rating: '4.9',
      features: ['AASTU/ASTU past papers', 'Handwritten short notes', 'Interactive GPA calculator', 'Digital textbooks'],
      subjects: ['Logic', 'Math 101', 'Physics', 'Psychology', 'Geography'],
      link: '/aastu-exams',
      image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=900&h=600&fit=crop&auto=format",
      subExams: [
        { title: "FLEn 1003 Final Exam PDF", link: "/aastu-exams/logic" },
        { title: "Math 1001 Model Solutions", link: "/aastu-exams/math" },
        { title: "General Physics Review", link: "/aastu-exams/physics" }
      ]
    }
  ];

  const filteredExams = selectedExam === 'all'
    ? examTypes
    : examTypes.filter(exam => exam.id === selectedExam);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 text-slate-900 font-sans selection:bg-blue-500/30 pt-16 pb-12">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-600/10 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-green-400/10 to-blue-600/10 blur-3xl rounded-full"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="text-center lg:text-left lg:pl-32 mb-16">
          <div className="inline-flex items-center lg:ml-24 gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200/50 backdrop-blur-sm text-sm font-bold text-blue-700 mb-8">
            <FaAward className="text-yellow-500 w-4 h-4" />
            <span>EXAM PREPARATION CENTER</span>
            <FiZap className="text-blue-500 w-4 h-4" />
          </div>

          <h1 className="text-3xl md:text-5xl font-black leading-tight mb-4">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Master Your
            </span>
            <br />
            <span className="text-slate-900">Exams</span>
          </h1>

          <p className="max-w-4xl lg:mx-0 text-lg md:text-2xl text-slate-600 font-medium mb-12 leading-relaxed">
            {student ? `Welcome back, ${student.first_name || 'Student'}! ` : ''}
            Comprehensive exam preparation for Grade 12, University Exit, and Freshman Placement exams.
            Choose between free basic access or premium full preparation packages.
          </p>

          <div className="flex flex-wrap justify-center lg:justify-start lg:pl-32 gap-3 mb-10">
            {[
              { id: 'all', label: 'Exams', icon: <FiBookOpen /> },
              { id: 'ngat', label: 'NGAT', icon: <FaCertificate /> },
              { id: 'grade12', label: 'Grade 12', icon: <FaGraduationCap /> },
              { id: 'exit', label: 'Exit', icon: <FaAward /> },
              { id: 'freshman', label: 'Freshman', icon: <FaBook /> }
            ].map(filter => (
              <button
                key={filter.id}
                onClick={() => setSelectedExam(filter.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs transition-all ${selectedExam === filter.id
                  ? 'bg-blue-600 text-white shadow-md scale-105'
                  : 'bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-600 border border-slate-200'
                  }`}
              >
                {filter.icon}
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Access Section: Freshman */}
        {(selectedExam === 'all' || selectedExam === 'freshman') && (
          <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-3xl p-6 md:p-12 text-white mb-16 animate-fadeIn">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-black mb-4">
                AASTU Freshman Final Exams
              </h2>
              <p className="text-green-100 text-lg">
                Direct access to all AASTU freshman course final exams - January 2026 Schedule
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <FaBook className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Past Papers</h3>
                    <p className="text-green-100 text-sm">65+ papers available</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/aastu-exams')}
                  className="w-full bg-white text-green-600 font-bold py-3 rounded-xl hover:bg-green-50 transition-colors"
                >
                  Access Past Papers
                </button>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <FaBrain className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Practice Exams</h3>
                    <p className="text-green-100 text-sm">Interactive mock tests</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/aastu-exams')}
                  className="w-full bg-white text-green-600 font-bold py-3 rounded-xl hover:bg-green-50 transition-colors"
                >
                  Start Practice
                </button>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <FaCalculator className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Dashboard</h3>
                    <p className="text-green-100 text-sm">Track your progress</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/aastu-exams')}
                  className="w-full bg-white text-green-600 font-bold py-3 rounded-xl hover:bg-green-50 transition-colors"
                >
                  View Dashboard
                </button>
              </div>
            </div>

            <div className="text-center mt-8">
              <button
                onClick={() => navigate('/aastu-exams')}
                className="bg-white text-green-600 font-black px-8 py-4 rounded-2xl hover:bg-green-50 transition-all transform hover:scale-105 shadow-xl"
              >
                Launch Full Freshman Exam Portal →
              </button>
            </div>
          </div>
        )}

        {/* Quick Access Section: Grade 12 */}
        {selectedExam === 'grade12' && (
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-6 md:p-12 text-white mb-16 animate-fadeIn">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-black mb-4">
                Grade 12 National Exam Prep
              </h2>
              <p className="text-purple-100 text-lg">
                Complete preparation hub specifically designed for the EUEE 2017/2018 candidates.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <FaGraduationCap className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Model Exams</h3>
                    <p className="text-purple-100 text-sm">2016 MoE Model Exams</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/grade12-exams')}
                  className="w-full bg-white text-purple-600 font-bold py-3 rounded-xl hover:bg-purple-50 transition-colors"
                >
                  Start Model Exam
                </button>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <FaAtom className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Subject Hubs</h3>
                    <p className="text-purple-100 text-sm">Natural/Social Streams</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/grade12-exams')}
                  className="w-full bg-white text-purple-600 font-bold py-3 rounded-xl hover:bg-purple-50 transition-colors"
                >
                  Choose Subject
                </button>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <FaCalculator className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Score Predictor</h3>
                    <p className="text-purple-100 text-sm">Target 600/700</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/grade12-exams')}
                  className="w-full bg-white text-purple-600 font-bold py-3 rounded-xl hover:bg-purple-50 transition-colors"
                >
                  Calculate Score
                </button>
              </div>
            </div>

            <div className="text-center mt-8">
              <button
                onClick={() => navigate('/grade12-exams')}
                className="bg-white text-purple-600 font-black px-8 py-4 rounded-2xl hover:bg-purple-50 transition-all transform hover:scale-105 shadow-xl"
              >
                Launch Grade 12 Hub →
              </button>
            </div>
          </div>
        )}

        {/* Quick Access Section: Exit Exam */}
        {selectedExam === 'exit' && (
          <div className="bg-gradient-to-r from-blue-700 to-indigo-700 rounded-3xl p-6 md:p-12 text-white mb-16 animate-fadeIn">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-black mb-4">
                National Exit Examination
              </h2>
              <p className="text-blue-100 text-lg">
                Professional certification prep for Civil, Health, Law, Technology, and Business graduates.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <FaAward className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Mock Exams</h3>
                    <p className="text-blue-100 text-sm">Department-Specific Models</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/exit-exams')}
                  className="w-full bg-white text-blue-700 font-bold py-3 rounded-xl hover:bg-blue-50 transition-colors"
                >
                  Take Mock Exam
                </button>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <FaCalendar className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Past Papers</h3>
                    <p className="text-blue-100 text-sm">2015 & 2016 Archives</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/exit-exams')}
                  className="w-full bg-white text-blue-700 font-bold py-3 rounded-xl hover:bg-blue-50 transition-colors"
                >
                  Browse Archives
                </button>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <FiUsers className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Community</h3>
                    <p className="text-blue-100 text-sm">Study Groups by Field</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/exit-exams')}
                  className="w-full bg-white text-blue-700 font-bold py-3 rounded-xl hover:bg-blue-50 transition-colors"
                >
                  Join Groups
                </button>
              </div>
            </div>

            <div className="text-center mt-8">
              <button
                onClick={() => navigate('/exit-exams')}
                className="bg-white text-blue-700 font-black px-8 py-4 rounded-2xl hover:bg-blue-50 transition-all transform hover:scale-105 shadow-xl"
              >
                Launch Exit Exam Hub →
              </button>
            </div>
          </div>
        )}

        {/* Quick Access Section: NGAT */}
        {selectedExam === 'ngat' && (
          <div className="bg-gradient-to-r from-teal-500 to-emerald-600 rounded-3xl p-6 md:p-12 text-white mb-16 animate-fadeIn">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-black mb-4">
                Graduate Assessment (NGAT)
              </h2>
              <p className="text-teal-100 text-lg">
                Master the aptitude test for postgraduate program admission in Ethiopia.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <FaCertificate className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Aptitude Tests</h3>
                    <p className="text-teal-100 text-sm">Verbal & Quantitative Review</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/ngat-preparation')}
                  className="w-full bg-white text-teal-600 font-bold py-3 rounded-xl hover:bg-teal-50 transition-colors"
                >
                  Practice Aptitude
                </button>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <FaBrain className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Critical Thinking</h3>
                    <p className="text-teal-100 text-sm">Logic & Analytical Reasoning</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/ngat-preparation')}
                  className="w-full bg-white text-teal-600 font-bold py-3 rounded-xl hover:bg-teal-50 transition-colors"
                >
                  Sharpen Logic
                </button>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <FiClock className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Timed Mocks</h3>
                    <p className="text-teal-100 text-sm">Real Exam Simulation</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/ngat-preparation')}
                  className="w-full bg-white text-teal-600 font-bold py-3 rounded-xl hover:bg-teal-50 transition-colors"
                >
                  Start Simulation
                </button>
              </div>
            </div>

            <div className="text-center mt-8">
              <button
                onClick={() => navigate('/ngat-preparation')}
                className="bg-white text-teal-600 font-black px-8 py-4 rounded-2xl hover:bg-teal-50 transition-all transform hover:scale-105 shadow-xl"
              >
                Launch NGAT Prep →
              </button>
            </div>
          </div>
        )}

        {/* Exam Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredExams.map((exam) => (
            <ExamCard
              key={exam.id}
              exam={exam}
              onEnrollment={handleEnrollment}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Exam Card Component (Internal for cleaner mapping)
const ExamCard = ({ exam, onEnrollment }) => {
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-500 flex flex-col hover:-translate-y-1">
      {/* Visual Header */}
      <div className="relative h-32 overflow-hidden">
        <img
          src={exam.image}
          alt={exam.title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-4 right-4 z-20">
          <div className="bg-white/20 backdrop-blur-md p-2 rounded-xl border border-white/30 text-white shadow-lg">
            {exam.icon}
          </div>
        </div>
        <div className="absolute bottom-4 left-4 z-20 text-white">
          <div className="text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg inline-block mb-2 border border-white/30">
            {exam.difficulty}
          </div>
          <h3 className="text-2xl font-black leading-tight shadow-sm">{exam.title}</h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Description */}
        <p className="text-slate-600 mb-6 text-sm leading-relaxed line-clamp-2">
          {exam.description}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6 border-b border-slate-100 pb-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <FiClock className="w-4 h-4 text-blue-500" />
              <span className="font-bold text-slate-900 text-sm">{exam.duration}</span>
            </div>
            <div className="text-[10px] text-slate-400">Duration</div>
          </div>
          <div className="text-center border-l border-slate-100">
            <div className="flex items-center justify-center gap-1 mb-1">
              <FiStar className="w-4 h-4 text-yellow-500" />
              <span className="font-bold text-slate-900 text-sm">{exam.rating}</span>
            </div>
            <div className="text-[10px] text-slate-400">Rating</div>
          </div>
          <div className="text-center border-l border-slate-100">
            <div className="flex items-center justify-center gap-1 mb-1">
              <FiUsers className="w-4 h-4 text-green-500" />
              <span className="font-bold text-slate-900 text-sm">{exam.students}</span>
            </div>
            <div className="text-[10px] text-slate-400">Active</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col">
              <span className="text-sm text-slate-500 line-through">{exam.originalPrice} ETB</span>
              <span className="text-2xl font-black text-slate-900">{exam.price} ETB</span>
            </div>
            <div className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
              SAVE {Math.round(((exam.originalPrice - exam.price) / exam.originalPrice) * 100)}%
            </div>
          </div>

          <button
            onClick={() => navigate(exam.link)}
            className={`w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r ${exam.color} hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2 group-hover:scale-[1.02] active:scale-95`}
          >
            <FaRocket className="w-4 h-4" />
            Start Preparation
          </button>

          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full py-2 text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors flex items-center justify-center gap-2"
          >
            {showDetails ? 'Hide Features' : 'View Features'}
            <FiTarget className={`transition-transform ${showDetails ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Collapsible Details */}
        <div className={`grid transition-all duration-300 overflow-hidden ${showDetails ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'}`}>
          <div className="min-h-0 space-y-4">
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-2">Subject Coverage</h4>
              <div className="flex flex-wrap gap-1">
                {exam.subjects.slice(0, 5).map((s, i) => (
                  <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded-full border border-slate-200">{s}</span>
                ))}
                {exam.subjects.length > 5 && <span className="text-[10px] text-slate-400 px-2 py-1">+{exam.subjects.length - 5} more</span>}
              </div>
            </div>

            {exam.subExams && (
              <div className="bg-slate-50 rounded-xl p-3">
                <h4 className="font-bold text-slate-900 text-xs mb-2 flex items-center gap-2">
                  <FaBook className="text-blue-500" /> Included Exams
                </h4>
                <div className="space-y-2">
                  {exam.subExams.slice(0, 3).map((sub, i) => (
                    <div key={i} onClick={() => navigate(sub.link)} className="flex justify-between items-center text-xs p-2 bg-white rounded-lg border border-slate-200 cursor-pointer hover:border-blue-300 transition-colors">
                      <span className="truncate max-w-[150px] font-medium">{sub.title}</span>
                      <FiCheck className="text-green-500" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamPreparation;
