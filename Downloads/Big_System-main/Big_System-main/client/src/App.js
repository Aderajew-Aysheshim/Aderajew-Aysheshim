import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import NavbarPro from './components/Navbar-Pro';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import MaintenanceGuard from './components/MaintenanceGuard';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import GetStarted from './pages/GetStarted';
import StudentRegistrationWithPayment from './pages/StudentRegistrationWithPayment';
import TutorRegistrationWithPayment from './pages/TutorRegistrationWithPayment';
import StudentRegistration from './pages/StudentRegistration';
import TutorRegistration from './pages/TutorRegistration';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Resources from './pages/Resources';
import Videos from './pages/Videos';
import About from './pages/About';
import Contact from './pages/Contact';
import ExitExams from './pages/ExitExams';
import ExamPreparation from './pages/ExamPreparation';
import ExamPayment from './pages/ExamPayment';
import TakeExam from './pages/TakeExam';
import ExamResults from './pages/ExamResults';

import AdminDashboard from './pages/AdminDashboard';
import ExamPaperManagement from './pages/admin/ExamPaperManagement';
import UploadResource from './pages/UploadResource';
import VerifyTutors from './pages/VerifyTutors';
import ManageResources from './pages/ManageResources';
import CreateExitExam from './pages/CreateExitExam';
import UploadPaymentProof from './pages/UploadPaymentProof';
import PaymentStatus from './pages/PaymentStatus';
import StudentProfile from './pages/StudentProfile';
import AdminLogin from './pages/AdminLogin';
import SubscribePremium from './pages/SubscribePremium';
import CoursePayment from './pages/CoursePayment';
import RegistrationChoice from './pages/RegistrationChoice';
import TutorDashboard from './pages/TutorDashboard';
import TutorDashboardPro from './pages/TutorDashboardPro';
import Tutors from './pages/Tutors';
import TutorProfile from './pages/TutorProfile';
import Messages from './pages/MessagesEnhanced';
import AdminMessages from './pages/AdminMessages';
import AdminTutorManagement from './pages/AdminTutorManagement';
import AdminStudentManagement from './pages/AdminStudentManagement';
import AdminPaymentVerification from './pages/AdminPaymentVerification';
import TutorUploadResource from './pages/TutorUploadResource';
import PsychologyQuiz from './pages/PsychologyQuiz';
import AnthropologyQuiz from './pages/AnthropologyQuiz';
import LiveClassroom from './pages/LiveClassroom';
import AastuFreshmanExams from './pages/AastuFreshmanExams';
import LogicFinalExam from './pages/LogicFinalExam';
import GeographyFinalExam from './pages/GeographyFinalexam.jsx';
import EnglishCommunicationExam from './pages/EnglishCommunicationExam';
import Grade12Exams from './pages/Grade12Exams';
import Grade12MathematicsEntrance from './pages/exams/Grade12MathematicsEntrance';
import Grade12EnglishPractice from './pages/Grade12EnglishPractice';
import BiologyPractice from './pages/BiologyPractice';
import Grade12ExamManagement from './pages/admin/Grade12ExamManagement';
import ExamManagementSystem from './pages/ExamManagementSystem';
import Grade12PaymentSystem from './pages/Grade12PaymentSystem';
import ResourceUpload from './pages/ResourceUpload';

import MathematicsPastPaper from './pages/exams/MathematicsPastPaper';
import PhysicsPastPaper from './pages/exams/PhysicsPastPaper';
import ChemistryPastPaper from './pages/exams/ChemistryPastPaper';
import EnglishPastPaper from './pages/exams/EnglishPastPaper';
import PsychologyPastPaper from './pages/exams/PsychologyPastPaper';
import EntrepreneurshipPastPaper from './pages/exams/EntrepreneurshipPastPaper';
import AnthropologyPastPaper from './pages/exams/AnthropologyPastPaper';
import PhysicalFitnessPastPaper from './pages/exams/PhysicalFitnessPastPaper';
import AppliedSciencePastPaper from './pages/exams/AppliedSciencePastPaper';
import PhilosophyPastPaper from './pages/exams/PhilosophyPastPaper';
import SocialSciencePastPaper from './pages/exams/SocialSciencePastPaper';
import GeographyPastPaper from './pages/exams/GeographyPastPaper';
import LogicPastPaper from './pages/exams/LogicPastPaper';
import EnglishCommunicationPastPaper from './pages/exams/EnglishCommunicationPastPaper';
import ExpertNetwork from './pages/ExpertNetwork';
import FindPhysicalTutor from './pages/FindPhysicalTutor';
import TelegramChatWidget from './components/TelegramChatWidget';
import './styles/globals.css';
import './utils/websocket';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 font-sans selection:bg-blue-500/30">
      <MaintenanceGuard>
        {!isAdminRoute && <NavbarPro />}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/get-started" element={<GetStarted />} />
            <Route path="/register" element={<RegistrationChoice />} />
            <Route path="/student-registration" element={<StudentRegistrationWithPayment />} />
            <Route path="/tutor-registration" element={<TutorRegistrationWithPayment />} />
            <Route path="/student-register" element={<StudentRegistration />} />
            <Route path="/tutor-register" element={<TutorRegistration />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/login" element={<Login />} />
            { }
            <Route path="/dashboard" element={
              <ProtectedRoute requiredUserType="student">
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/student-profile" element={
              <ProtectedRoute requiredUserType="student">
                <StudentProfile />
              </ProtectedRoute>
            } />
            <Route path="/messages" element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            } />
            <Route path="/courses" element={<Courses />} />
            <Route path="/expert-network" element={<ExpertNetwork />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            { }
            <Route path="/tutor-dashboard" element={
              <ProtectedRoute requiredUserType="tutor">
                <TutorDashboard />
              </ProtectedRoute>
            } />
            <Route path="/tutor/dashboard" element={
              <ProtectedRoute requiredUserType="tutor">
                <TutorDashboardPro />
              </ProtectedRoute>
            } />
            <Route path="/tutor-upload-resource" element={
              <ProtectedRoute requiredUserType="tutor">
                <TutorUploadResource />
              </ProtectedRoute>
            } />
            <Route path="/tutors" element={<Tutors />} />
            <Route path="/tutor-profile/:id" element={<TutorProfile />} />

            { }
            <Route path="/exit-exams" element={<ExitExams />} />
            <Route path="/exams" element={<ExamPreparation />} />
            <Route path="/exam-payment" element={<ExamPayment />} />
            <Route path="/exit-exams/:id" element={<TakeExam />} />
            <Route path="/ngat/test/:id" element={<TakeExam />} />
            <Route path="/aastu-exams/:id" element={<TakeExam />} />
            <Route path="/grade12-exams/:id" element={<TakeExam />} />
            <Route path="/exit-exams/:id/results" element={<ExamResults />} />

            { }
            <Route path="/mock-exam/psychology" element={<PsychologyQuiz />} />
            <Route path="/mock-exam/anthropology" element={<AnthropologyQuiz />} />
            <Route path="/aastu-exams" element={<AastuFreshmanExams />} />
            <Route path="/aastu-exams/logic-final" element={<LogicFinalExam />} />
            <Route path="/aastu-exams/geography-final" element={<GeographyFinalExam />} />
            <Route path="/aastu-exams/english-communication" element={<EnglishCommunicationExam />} />

            { }
            <Route path="/grade12-exams" element={<Grade12Exams />} />
            <Route path="/grade12-exams/mathematics-entrance" element={<Grade12MathematicsEntrance />} />
            <Route path="/grade12-exams/english-practice" element={<Grade12EnglishPractice />} />
            <Route path="/grade12-exams/biology-practice" element={<BiologyPractice />} />

            { }
            <Route path="/aastu-papers/mathematics" element={<MathematicsPastPaper />} />
            <Route path="/aastu-papers/physics" element={<PhysicsPastPaper />} />
            <Route path="/aastu-papers/chemistry" element={<ChemistryPastPaper />} />
            <Route path="/aastu-papers/english" element={<EnglishPastPaper />} />
            <Route path="/aastu-papers/psychology" element={<PsychologyPastPaper />} />
            <Route path="/aastu-papers/entrepreneurship" element={<EntrepreneurshipPastPaper />} />
            <Route path="/aastu-papers/anthropology" element={<AnthropologyPastPaper />} />
            <Route path="/aastu-papers/physical-fitness" element={<PhysicalFitnessPastPaper />} />
            <Route path="/aastu-papers/applied-science" element={<AppliedSciencePastPaper />} />
            <Route path="/aastu-papers/philosophy" element={<PhilosophyPastPaper />} />
            <Route path="/aastu-papers/social-science" element={<SocialSciencePastPaper />} />
            <Route path="/aastu-papers/geography" element={<GeographyPastPaper />} />
            <Route path="/aastu-papers/logic" element={<LogicPastPaper />} />
            <Route path="/aastu-papers/english-communication" element={<EnglishCommunicationPastPaper />} />

            { }
            <Route path="/subscribe-premium" element={<SubscribePremium />} />
            <Route path="/upload-payment" element={<UploadPaymentProof />} />
            <Route path="/payment-status" element={<PaymentStatus />} />
            <Route path="/course-payment" element={<CoursePayment />} />

            { }
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute requiredUserType="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/exam-papers" element={
              <ProtectedRoute requiredUserType="admin">
                <ExamPaperManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/grade12-exams" element={
              <ProtectedRoute requiredUserType="admin">
                <Grade12ExamManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/upload-resource" element={
              <ProtectedRoute requiredUserType="admin">
                <UploadResource />
              </ProtectedRoute>
            } />
            <Route path="/admin/verify-tutors" element={
              <ProtectedRoute requiredUserType="admin">
                <VerifyTutors />
              </ProtectedRoute>
            } />
            <Route path="/admin/manage-resources" element={
              <ProtectedRoute requiredUserType="admin">
                <ManageResources />
              </ProtectedRoute>
            } />
            <Route path="/admin/create-exit-exam" element={
              <ProtectedRoute requiredUserType="admin">
                <CreateExitExam />
              </ProtectedRoute>
            } />
            <Route path="/admin/payment-verification" element={
              <ProtectedRoute requiredUserType="admin">
                <AdminPaymentVerification />
              </ProtectedRoute>
            } />
            <Route path="/admin/messages" element={
              <ProtectedRoute requiredUserType="admin">
                <AdminMessages />
              </ProtectedRoute>
            } />
            <Route path="/admin/manage-tutors" element={
              <ProtectedRoute requiredUserType="admin">
                <AdminTutorManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/manage-students" element={
              <ProtectedRoute requiredUserType="admin">
                <AdminStudentManagement />
              </ProtectedRoute>
            } />

            { }
            <Route path="/exam-management" element={<ExamManagementSystem />} />
            <Route path="/grade12-payment-system" element={<Grade12PaymentSystem />} />
            <Route path="/upload-resource" element={<ResourceUpload />} />

            { }
            <Route path="/classroom/:roomId" element={<LiveClassroom />} />

            { }
            <Route path="/find-physical-tutor" element={<FindPhysicalTutor />} />
          </Routes>
        </main>
        {!isAdminRoute && <Footer />}
        <TelegramChatWidget />
      </MaintenanceGuard>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;