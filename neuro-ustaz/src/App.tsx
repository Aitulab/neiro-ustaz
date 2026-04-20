import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AIWorkspacePage from './pages/AIWorkspacePage';
import CommunityPage from './pages/CommunityPage';
import SupportPage from './pages/SupportPage';
import TasksPage from './pages/TasksPage';
import ProfilePage from './pages/ProfilePage';
import AuthPage from './pages/AuthPage';
import ToolsPage from './pages/ToolsPage';
import NpaPage from './pages/NpaPage';
import GuidePage from './pages/GuidePage';

import ProtectedRoute from './components/layout/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          
          {/* Protected Routes */}
          <Route path="/assistant" element={<ProtectedRoute><AIWorkspacePage /></ProtectedRoute>} />
          <Route path="/workspace" element={<Navigate to="/assistant" replace />} />
          <Route path="/tasks" element={<ProtectedRoute><TasksPage /></ProtectedRoute>} />
          <Route path="/community" element={<ProtectedRoute><CommunityPage /></ProtectedRoute>} />
          <Route path="/tools" element={<ProtectedRoute><ToolsPage /></ProtectedRoute>} />
          <Route path="/npa" element={<ProtectedRoute><NpaPage /></ProtectedRoute>} />
          <Route path="/guide" element={<GuidePage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
