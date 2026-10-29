import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { useRouter } from './hooks/useRouter';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { NextJsGuidePage } from './pages/NextJsGuidePage';
import { TestSuitePage } from './pages/TestSuitePage';

function AppContent() {
  const { pathname } = useRouter();

  const renderCurrentView = () => {
    switch (pathname) {
      case '/login':
        return <LoginPage />;
      case '/signup':
        return <SignupPage />;
      case '/dashboard':
        return <DashboardPage />;
      case '/profile':
        return <ProfilePage />;
      case '/settings':
        return <SettingsPage />;
      case '/nextjs-code':
        return <NextJsGuidePage />;
      case '/test-suite':
        return <TestSuitePage />;
      default:
        // Default entry routes to /login
        return <LoginPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar />
      <main className="flex-1">
        {renderCurrentView()}
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
