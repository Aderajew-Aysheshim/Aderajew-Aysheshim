import React, { useState, useEffect } from 'react';
import { FaBook, FaFilePdf, FaUsers, FaClock, FaChartBar, FaTrophy, FaStar, FaDownload, FaEye, FaCalendarAlt, FaGraduationCap } from 'react-icons/fa';

const FreshmanExamDashboard = () => {
  const [stats, setStats] = useState({
    totalPapers: 65,
    totalCourses: 14,
    totalStudents: 2847,
    avgScore: 78.5,
    popularCourse: 'Mathematics',
    recentUploads: 12
  });

  const [recentActivity, setRecentActivity] = useState([
    { course: 'Mathematics', action: 'New paper uploaded', time: '2 hours ago', type: 'upload' },
    { course: 'Physics', action: 'Exam completed by 23 students', time: '3 hours ago', type: 'exam' },
    { course: 'Chemistry', action: '5 papers downloaded', time: '5 hours ago', type: 'download' },
    { course: 'English', action: 'Mock exam started', time: '6 hours ago', type: 'exam' },
    { course: 'Psychology', action: 'New solution added', time: '8 hours ago', type: 'update' }
  ]);

  const courseStats = [
    { name: 'Mathematics', papers: 12, students: 456, avgScore: 82, color: 'from-blue-500 to-indigo-600' },
    { name: 'Physics', papers: 10, students: 342, avgScore: 76, color: 'from-green-500 to-emerald-600' },
    { name: 'Chemistry', papers: 8, students: 298, avgScore: 79, color: 'from-purple-500 to-pink-600' },
    { name: 'English', papers: 6, students: 512, avgScore: 85, color: 'from-yellow-500 to-orange-600' },
    { name: 'Psychology', papers: 4, students: 234, avgScore: 81, color: 'from-red-500 to-rose-600' },
    { name: 'Entrepreneurship', papers: 4, students: 189, avgScore: 77, color: 'from-teal-500 to-cyan-600' }
  ];

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-2xl p-6 border border-blue-500/30 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <FaFilePdf className="text-3xl text-blue-400" />
            <span className="text-2xl font-bold text-blue-400">{stats.totalPapers}</span>
          </div>
          <h3 className="text-white font-semibold mb-1">Total Papers</h3>
          <p className="text-slate-400 text-sm">Across all courses</p>
        </div>

        <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-2xl p-6 border border-green-500/30 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <FaBook className="text-3xl text-green-400" />
            <span className="text-2xl font-bold text-green-400">{stats.totalCourses}</span>
          </div>
          <h3 className="text-white font-semibold mb-1">Active Courses</h3>
          <p className="text-slate-400 text-sm">Freshman programs</p>
        </div>

        <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl p-6 border border-purple-500/30 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <FaUsers className="text-3xl text-purple-400" />
            <span className="text-2xl font-bold text-purple-400">{stats.totalStudents.toLocaleString()}</span>
          </div>
          <h3 className="text-white font-semibold mb-1">Active Students</h3>
          <p className="text-slate-400 text-sm">Using the platform</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 rounded-2xl p-6 border border-yellow-500/30 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <FaChartBar className="text-3xl text-yellow-400" />
            <span className="text-2xl font-bold text-yellow-400">{stats.avgScore}%</span>
          </div>
          <h3 className="text-white font-semibold mb-1">Average Score</h3>
          <p className="text-slate-400 text-sm">Across all exams</p>
        </div>
      </div>

      {/* Course Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-xl">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <FaTrophy className="text-yellow-400" />
            Course Performance
          </h3>
          <div className="space-y-4">
            {courseStats.map((course, index) => (
              <div key={course.name} className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${course.color} flex items-center justify-center text-white font-bold`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-white font-semibold">{course.name}</h4>
                    <span className="text-slate-400 text-sm">{course.papers} papers</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${course.color} transition-all duration-500`}
                        style={{ width: `${course.avgScore}%` }}
                      ></div>
                    </div>
                    <span className="text-white font-semibold text-sm">{course.avgScore}%</span>
                  </div>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-slate-400 text-xs">{course.students} students</span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={`text-xs ${i < Math.floor(course.avgScore / 20) ? 'text-yellow-400' : 'text-slate-600'}`} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-xl">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <FaClock className="text-blue-400" />
            Recent Activity
          </h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-colors">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${activity.type === 'upload' ? 'bg-blue-600/20 text-blue-400' :
                    activity.type === 'exam' ? 'bg-green-600/20 text-green-400' :
                      activity.type === 'download' ? 'bg-purple-600/20 text-purple-400' :
                        'bg-yellow-600/20 text-yellow-400'
                  }`}>
                  {activity.type === 'upload' ? <FaFilePdf /> :
                    activity.type === 'exam' ? <FaGraduationCap /> :
                      activity.type === 'download' ? <FaDownload /> :
                        <FaEye />}
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-semibold">{activity.course}</h4>
                  <p className="text-slate-400 text-sm">{activity.action}</p>
                  <p className="text-slate-500 text-xs mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-2xl p-8 border border-indigo-500/30 backdrop-blur-xl">
        <div className="text-center">
          <FaCalendarAlt className="text-5xl text-indigo-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">This Month's Activity</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div>
              <div className="text-3xl font-bold text-indigo-400 mb-2">{stats.recentUploads}</div>
              <p className="text-slate-300">New Papers Added</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400 mb-2">1,247</div>
              <p className="text-slate-300">Exams Completed</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-pink-400 mb-2">3,892</div>
              <p className="text-slate-300">Downloads</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreshmanExamDashboard;
