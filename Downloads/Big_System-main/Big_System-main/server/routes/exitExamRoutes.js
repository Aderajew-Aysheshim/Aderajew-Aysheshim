const express = require('express');
const router = express.Router();
const ExitExam = require('../models/ExitExam');
const ExamAttempt = require('../models/ExamAttempt');
const { protect, restrictTo, checkPremium } = require('../middleware/auth');

// @route   GET /api/exit-exams
// @desc    Get all exit exams
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { subject, department, examType, difficulty, accessLevel } = req.query;

    let query = { isActive: true };

    if (subject) query.subject = subject;
    if (department) query.department = department;
    if (examType) query.examType = examType;
    if (difficulty) query.difficulty = difficulty;
    if (accessLevel) query.accessLevel = accessLevel;

    const exams = await ExitExam.find(query)
      .select('-questions') // Don't send questions in list view
      .sort('-createdAt');

    res.json({ success: true, count: exams.length, exams });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/exit-exams/free
// @desc    Get all free exit exams
// @access  Public
router.get('/free', async (req, res) => {
  try {
    const exams = await ExitExam.find({ accessLevel: 'free', isActive: true })
      .select('-questions')
      .sort('-createdAt');

    res.json({ success: true, count: exams.length, exams });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/exit-exams/premium
// @desc    Get all premium exit exams
// @access  Private (Premium users)
router.get('/premium', protect, checkPremium, async (req, res) => {
  try {
    const exams = await ExitExam.find({ accessLevel: 'premium', isActive: true })
      .select('-questions')
      .sort('-createdAt');

    res.json({ success: true, count: exams.length, exams });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/exit-exams/mock
// @desc    Get all mock exams
// @access  Public
router.get('/mock', async (req, res) => {
  try {
    const exams = await ExitExam.find({ examType: 'mock', isActive: true })
      .select('-questions')
      .sort('-createdAt');

    res.json({ success: true, count: exams.length, exams });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/exit-exams/:id
// @desc    Get single exit exam with questions
// @access  Public/Private (based on access level)
router.get('/:id', protect, async (req, res) => {
  try {
    const exam = await ExitExam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    // Check if premium exam requires subscription
    if (exam.accessLevel === 'premium') {
      if (req.user.subscriptionStatus !== 'premium' ||
        (req.user.subscriptionExpiry && req.user.subscriptionExpiry < new Date())) {
        return res.status(403).json({
          error: 'Premium subscription required to access this exam'
        });
      }
    }

    res.json({ success: true, exam });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/exit-exams/:id/start
// @desc    Start an exam attempt
// @access  Private (Student)
router.post('/:id/start', protect, restrictTo('student'), async (req, res) => {
  try {
    const exam = await ExitExam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    // Check access level
    if (exam.accessLevel === 'premium' && req.user.subscriptionStatus !== 'premium') {
      return res.status(403).json({ error: 'Premium subscription required' });
    }

    // Return exam without correct answers
    const examData = {
      ...exam.toObject(),
      questions: exam.questions.map(q => ({
        _id: q._id,
        questionText: q.questionText,
        options: q.options.map(o => ({ text: o.text })),
        points: q.points
      }))
    };

    res.json({
      success: true,
      exam: examData,
      startedAt: new Date()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/exit-exams/:id/submit
// @desc    Submit exam answers
// @access  Private (Student)
router.post('/:id/submit', protect, restrictTo('student'), async (req, res) => {
  try {
    const { answers, startedAt, completedAt } = req.body;

    const exam = await ExitExam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    // Calculate score
    let score = 0;
    const gradedAnswers = answers.map(answer => {
      const question = exam.questions.id(answer.questionId);
      const isCorrect = question.correctAnswer === answer.selectedAnswer;
      const pointsEarned = isCorrect ? question.points : 0;
      score += pointsEarned;

      return {
        questionId: answer.questionId,
        selectedAnswer: answer.selectedAnswer,
        isCorrect,
        pointsEarned
      };
    });

    const percentage = (score / exam.totalPoints) * 100;
    const passed = percentage >= exam.passingScore;
    const timeSpent = Math.round((new Date(completedAt) - new Date(startedAt)) / 60000);

    // Save attempt
    const attempt = await ExamAttempt.create({
      student: req.user._id,
      exam: exam._id,
      answers: gradedAnswers,
      score,
      percentage: percentage.toFixed(2),
      passed,
      timeSpent,
      startedAt,
      completedAt
    });

    // Update exam statistics
    exam.attempts += 1;
    exam.averageScore = ((exam.averageScore * (exam.attempts - 1)) + percentage) / exam.attempts;
    await exam.save();

    res.json({
      success: true,
      attempt: {
        score,
        percentage: percentage.toFixed(2),
        passed,
        timeSpent,
        totalQuestions: exam.totalQuestions,
        correctAnswers: gradedAnswers.filter(a => a.isCorrect).length
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/exit-exams/:id/results/:attemptId
// @desc    Get detailed exam results
// @access  Private (Student)
router.get('/:id/results/:attemptId', protect, restrictTo('student'), async (req, res) => {
  try {
    const attempt = await ExamAttempt.findById(req.params.attemptId)
      .populate('exam');

    if (!attempt) {
      return res.status(404).json({ error: 'Attempt not found' });
    }

    if (attempt.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Add correct answers and explanations
    const detailedResults = attempt.answers.map(answer => {
      const question = attempt.exam.questions.id(answer.questionId);
      return {
        ...answer.toObject(),
        questionText: question.questionText,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        options: question.options
      };
    });

    res.json({
      success: true,
      attempt: {
        ...attempt.toObject(),
        detailedAnswers: detailedResults
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/exit-exams/my-attempts
// @desc    Get student's exam attempts
// @access  Private (Student)
router.get('/student/my-attempts', protect, restrictTo('student'), async (req, res) => {
  try {
    const attempts = await ExamAttempt.find({ student: req.user._id })
      .populate('exam', 'title subject department examType')
      .sort('-createdAt');

    res.json({ success: true, count: attempts.length, attempts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/exit-exams/departments
// @desc    Get all departments
// @access  Public
router.get('/meta/departments', async (req, res) => {
  try {
    const departments = await ExitExam.distinct('department');
    res.json({ success: true, departments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
