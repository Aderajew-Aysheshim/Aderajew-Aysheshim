import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaTrash, FaBook } from 'react-icons/fa';

const CreateExitExam = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    department: '',
    examType: 'mock',
    difficulty: 'medium',
    duration: 120,
    passingScore: 50,
    accessLevel: 'free',
    year: new Date().getFullYear()
  });

  const [questions, setQuestions] = useState([{
    questionText: '',
    options: [
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false }
    ],
    correctAnswer: '',
    explanation: '',
    points: 1
  }]);

  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const subjects = [
    // General Education
    'mathematics', 'physics', 'chemistry', 'biology', 'english',

    // Engineering - Civil & Environmental
    'civil-engineering', 'environmental-engineering', 'construction-management',
    'water-resources', 'hydraulic-engineering',

    // Engineering - Electrical & Computer
    'electrical-engineering', 'computer-engineering', 'biomedical-engineering',
    'electronics-communication', 'control-engineering',

    
    'mechanical-engineering', 'industrial-engineering', 'automotive-engineering',
    'manufacturing-engineering', 'mechatronics-engineering',

    // Engineering - Chemical & Bio
    'chemical-engineering', 'bio-engineering', 'food-engineering', 'process-engineering',

    // Architecture
    'architecture', 'urban-planning', 'landscape-architecture',

    // Applied Sciences
    'applied-mathematics', 'applied-physics', 'applied-chemistry', 'applied-biology',
    'statistics', 'computer-science', 'information-technology', 'software-engineering',

    // Business & Economics
    'accounting-finance', 'management', 'economics', 'marketing', 'business-administration',

    // Common Engineering Courses
    'engineering-mathematics', 'engineering-drawing', 'engineering-mechanics',
    'thermodynamics', 'fluid-mechanics', 'material-science', 'engineering-economics',

    'other'
  ];

  const departments = [
    // Civil & Environmental Engineering
    'Civil Engineering',
    'Environmental Engineering',
    'Construction Technology and Management',
    'Water Resources Engineering',
    'Hydraulic Engineering',

    // Electrical & Computer Engineering
    'Electrical Engineering (Power)',
    'Electrical Engineering (Control)',
    'Computer Engineering',
    'Biomedical Engineering',
    'Electronics and Communication Engineering',

    // Mechanical & Industrial Engineering
    'Mechanical Engineering',
    'Industrial Engineering',
    'Automotive Engineering',
    'Manufacturing Engineering',
    'Mechatronics Engineering',

    // Chemical & Bio-Engineering
    'Chemical Engineering',
    'Bio-Engineering',
    'Food Engineering',
    'Process Engineering',

    // Architecture
    'Architecture',
    'Urban Planning',
    'Landscape Architecture',

    // Applied Sciences
    'Applied Mathematics',
    'Applied Physics',
    'Applied Chemistry',
    'Applied Biology',
    'Statistics',
    'Computer Science',
    'Information Technology',
    'Software Engineering',

    // Business & Economics
    'Accounting and Finance',
    'Management',
    'Economics',
    'Marketing',
    'Business Administration',

    // General
    'General Education',
    'Other'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex].text = value;
    setQuestions(newQuestions);
  };

  const handleCorrectAnswerChange = (qIndex, optionLetter) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].correctAnswer = optionLetter;
    newQuestions[qIndex].options.forEach((opt, idx) => {
      opt.isCorrect = String.fromCharCode(65 + idx) === optionLetter;
    });
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, {
      questionText: '',
      options: [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false }
      ],
      correctAnswer: '',
      explanation: '',
      points: 1
    }]);
  };

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (questions.some(q => !q.questionText || !q.correctAnswer)) {
      setMessage({ text: 'Please fill in all questions and select correct answers', type: 'error' });
      return;
    }

    if (questions.some(q => q.options.some(o => !o.text))) {
      setMessage({ text: 'Please fill in all answer options', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage({ text: '', type: '' });

    const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

    const examData = {
      ...formData,
      questions,
      totalQuestions: questions.length,
      totalPoints
    };

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/admin/exit-exams',
        examData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage({ text: 'Exit exam created successfully!', type: 'success' });
      setTimeout(() => navigate('/admin/dashboard'), 2000);
    } catch (error) {
      setMessage({
        text: error.response?.data?.error || 'Failed to create exam',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="text-primary-500 hover:text-primary-600 font-medium mb-4"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Exit Exam</h1>
          <p className="text-gray-600">Create mock exams and practice tests for students</p>
        </div>

        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${message.type === 'success'
            ? 'bg-green-50 text-green-800 border border-green-200'
            : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Information</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Exam Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Computer Science Exit Exam Mock Test 2024"
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Describe the exam..."
                  className="input"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="input"
                    required
                  >
                    <option value="">Select Subject</option>
                    {subjects.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject.charAt(0).toUpperCase() + subject.slice(1).replace('-', ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department *
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="input"
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Exam Type *
                  </label>
                  <select
                    name="examType"
                    value={formData.examType}
                    onChange={handleChange}
                    className="input"
                  >
                    <option value="mock">Mock Exam</option>
                    <option value="practice">Practice Test</option>
                    <option value="past-paper">Past Paper</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty *
                  </label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleChange}
                    className="input"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Access Level *
                  </label>
                  <select
                    name="accessLevel"
                    value={formData.accessLevel}
                    onChange={handleChange}
                    className="input"
                  >
                    <option value="free">Free</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes) *
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    min="30"
                    max="300"
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Passing Score (%) *
                  </label>
                  <input
                    type="number"
                    name="passingScore"
                    value={formData.passingScore}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year
                  </label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Questions */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Questions</h2>
              <button
                type="button"
                onClick={addQuestion}
                className="btn btn-primary flex items-center space-x-2"
              >
                <FaPlus />
                <span>Add Question</span>
              </button>
            </div>

            <div className="space-y-8">
              {questions.map((question, qIndex) => (
                <div key={qIndex} className="border-2 border-gray-200 rounded-lg p-6 relative">
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(qIndex)}
                      className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  )}

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Question {qIndex + 1} *
                    </label>
                    <textarea
                      value={question.questionText}
                      onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
                      rows="2"
                      placeholder="Enter question text..."
                      className="input"
                      required
                    />
                  </div>

                  <div className="space-y-3 mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Answer Options *
                    </label>
                    {question.options.map((option, oIndex) => {
                      const optionLetter = String.fromCharCode(65 + oIndex);
                      return (
                        <div key={oIndex} className="flex items-center space-x-3">
                          <input
                            type="radio"
                            name={`correct-${qIndex}`}
                            checked={question.correctAnswer === optionLetter}
                            onChange={() => handleCorrectAnswerChange(qIndex, optionLetter)}
                            className="h-5 w-5 text-primary-500"
                          />
                          <span className="font-medium text-gray-700 w-8">{optionLetter}.</span>
                          <input
                            type="text"
                            value={option.text}
                            onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                            placeholder={`Option ${optionLetter}`}
                            className="input flex-1"
                            required
                          />
                        </div>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Explanation (Optional)
                      </label>
                      <textarea
                        value={question.explanation}
                        onChange={(e) => handleQuestionChange(qIndex, 'explanation', e.target.value)}
                        rows="2"
                        placeholder="Explain the correct answer..."
                        className="input"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Points *
                      </label>
                      <input
                        type="number"
                        value={question.points}
                        onChange={(e) => handleQuestionChange(qIndex, 'points', parseInt(e.target.value))}
                        min="1"
                        max="10"
                        className="input"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-700">
                  <strong>{questions.length}</strong> questions •
                  <strong> {questions.reduce((sum, q) => sum + q.points, 0)}</strong> total points
                </p>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary text-lg px-8"
              >
                {loading ? 'Creating...' : 'Create Exam'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateExitExam;
