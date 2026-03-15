import { Link } from 'react-router-dom';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaYoutube, FaTelegramPlane, FaGraduationCap, FaBook, FaUsers } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 dark:bg-slate-950 text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img
                src={process.env.PUBLIC_URL + '/logo.jpg'}
                alt="AstraETX Logo"
                className="w-12 h-12 rounded-lg drop-shadow-lg object-cover"
                onError={(e) => {
                  console.error('Footer logo failed to load:', e.target.src);
                  e.target.style.display = 'none';
                }}
              />
              <h3 className="text-xl font-bold">AstraETX</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Ethiopia's leading education platform. Connecting students with quality resources and tutors.
            </p>
            <div className="flex space-x-3">
              <a href="https://www.youtube.com/@astraxacademy" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <FaYoutube className="text-xl" />
              </a>
              <a href="https://t.me/TutorHubEthiopia" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <FaTelegramPlane className="text-xl" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/courses" className="text-gray-300 hover:text-white transition-colors text-sm flex items-center">
                  <FaBook className="mr-2 text-blue-400" />
                  Courses
                </Link>
              </li>
              <li>
                <Link to="/tutors" className="text-gray-300 hover:text-white transition-colors text-sm flex items-center">
                  <FaUsers className="mr-2 text-green-400" />
                  Find Tutors
                </Link>
              </li>
              <li>
                <Link to="/exams" className="text-gray-300 hover:text-white transition-colors text-sm flex items-center">
                  <FaGraduationCap className="mr-2 text-yellow-400" />
                  Exam Prep
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center text-gray-300 text-sm">
                <FaPhone className="mr-3 text-blue-400" />
                <span>0951594353</span>
              </div>
              <div className="flex items-center text-gray-300 text-sm">
                <FaEnvelope className="mr-3 text-green-400" />
                <span>support@astraetx.com</span>
              </div>
              <div className="flex items-start text-gray-300 text-sm">
                <FaMapMarkerAlt className="mr-3 text-red-400 mt-1" />
                <span>
                  Addis Ababa, Ethiopia<br />
                  Bole, Megenagna Area
                </span>
              </div>
              <div className="flex space-x-3 pt-2">
                <a href="https://t.me/TutorHubEthiopia" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">
                  <FaTelegramPlane className="text-xl" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} AstraETX. All rights reserved.
            </div>
            <div className="flex items-center space-x-4 text-gray-400 text-sm">
              <span>Expert Tutors</span>
              <span>•</span>
              <span>Quality Education</span>
              <span>•</span>
              <span>24/7 Support</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-4 pt-4">
          <div className="text-center text-gray-500 text-xs">
            <p>Made with ❤️ in Ethiopia | Empowering Education Excellence</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
