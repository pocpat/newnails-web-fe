import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './lib/auth';
import ProtectedRoute from './lib/ProtectedRoute';
import WelcomePage from './pages/WelcomePage';
import Layout from './components/Layout';
import { LoginModalProvider } from './lib/LoginModalContext';

const DesignFormPage = React.lazy(() => import('./pages/DesignFormPage'));
const ResultsPage = React.lazy(() => import('./pages/ResultsPage'));
const MyDesignsPage = React.lazy(() => import('./pages/MyDesignsPage'));

function App() {
  return (
    <AuthProvider>
      <Router>
        <LoginModalProvider>
          <Layout>
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="/" element={<WelcomePage />} />
                {/* Protected Routes */}
                <Route
                  path="/design"
                  element={
                    <ProtectedRoute>
                      <DesignFormPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/results"
                  element={
                    <ProtectedRoute>
                      <ResultsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-designs"
                  element={
                    <ProtectedRoute>
                      <MyDesignsPage />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Suspense>
          </Layout>
        </LoginModalProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;
