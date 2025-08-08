import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './lib/auth';
import ProtectedRoute from './lib/ProtectedRoute';
import WelcomePage from './pages/WelcomePage';
import DesignFormPage from './pages/DesignFormPage';
import ResultsPage from './pages/ResultsPage';
import MyDesignsPage from './pages/MyDesignsPage'; // Import the new page
import LoginModal from './pages/LoginModal';
import Layout from './components/Layout';
import { LoginModalProvider } from './lib/LoginModalContext';

function App() {
  return (
    <AuthProvider>
      <Router>
          <LoginModalProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            {/* <Route path="/login" element={<LoginModal />} />*/}
            {/* Protected Routes */}
            <Route path="/design" element={<ProtectedRoute><DesignFormPage /></ProtectedRoute>} />
            <Route path="/results" element={<ProtectedRoute><ResultsPage /></ProtectedRoute>} />
            <Route path="/my-designs" element={<ProtectedRoute><MyDesignsPage /></ProtectedRoute>} />
          </Routes>
        </Layout>
       </LoginModalProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;
