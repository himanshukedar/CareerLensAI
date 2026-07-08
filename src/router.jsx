import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Signup from './pages/signup';
import Dashboard from './pages/dashboard';
import { RoadmapList, RoadmapDetail } from './pages/roadmap';
import Profile from './pages/profile';
import ProfileAnalysis from './pages/profileanalysis';
import MockInterview from './pages/mockinterview';
import SkillEvaluation from './pages/skillevaluation';
import AssessmentHistory from './pages/AssessmentHistory';
import CertificateSuggestions from './pages/CertificateSuggestions';
import VideoCall from './pages/VideoCall';
import ProtectedRoute from './components/ProtectedRoute';
import ProfileGuard from './components/ProfileGuard';
import Layout from './components/Layout';

import StudentJobs from './pages/StudentJobs';
import StudentMessages from './pages/StudentMessages';
import RecruiterDashboard from './pages/recruiterdashboard';
import RecruiterJobs from './pages/recruiterjobs';
import RecruiterScan from './pages/recruiterscan';
import RecruiterMessages from './pages/recruitermessages';
import AdminDashboard from './pages/admindashboard';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/',
    element: <ProtectedRoute><Layout /></ProtectedRoute>,
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'recruiter-dashboard',
        element: <RecruiterDashboard />,
      },
      {
        path: 'recruiter-jobs',
        element: <RecruiterJobs />,
      },
      {
        path: 'recruiter-scan',
        element: <RecruiterScan />,
      },
      {
        path: 'recruiter-messages',
        element: <RecruiterMessages />,
      },
      {
        path: 'admin-dashboard',
        element: <AdminDashboard />,
      },
      {
        path: 'jobs',
        element: <StudentJobs />,
      },
      {
        path: 'messages',
        element: <StudentMessages />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
      {
        path: 'profile-analysis',
        element: <ProfileGuard><ProfileAnalysis /></ProfileGuard>,
      },
      {
        path: 'mock-interview',
        element: <ProfileGuard><MockInterview /></ProfileGuard>,
      },
      {
        path: 'assessment-history',
        element: <ProfileGuard><AssessmentHistory /></ProfileGuard>,
      },
      {
        path: 'skill-evaluation',
        element: <ProfileGuard><SkillEvaluation /></ProfileGuard>,
      },
      {
        path: 'certificates',
        element: <ProfileGuard><CertificateSuggestions /></ProfileGuard>,
      },
      {
        path: 'roadmap',
        element: <ProfileGuard><RoadmapList /></ProfileGuard>,
      },
      {
        path: 'roadmap/:id',
        element: <ProfileGuard><RoadmapDetail /></ProfileGuard>,
      },
      {
        path: 'video-call/:roomId',
        element: <VideoCall />,
      }
    ]
  }
]);

export default router;