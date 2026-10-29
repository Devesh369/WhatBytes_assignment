import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/ui/toast-provider';
import { useRouter } from './hooks/useRouter';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ShadcnDashboardPage } from './pages/ShadcnDashboardPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { NextJsGuidePage } from './pages/NextJsGuidePage';
import { TestSuitePage } from './pages/TestSuitePage';
import { MultiStepFormPage } from './pages/MultiStepFormPage';

function AppContent() {
  const { pathname } = useRouter();

  // The primary Shadcn Dashboard uses its dedicated fixed sidebar & top navbar layout
  if (pathname === '/' || pathname === '/dashboard') {
    return <ShadcnDashboardPage />;
  }

  const renderCurrentView = () => {
    switch (pathname) {
      case '/multi-step-form':
        return <MultiStepFormPage />;
      case '/login':
        return <LoginPage />;
      case '/signup':
        return <SignupPage />;
      case '/auth-portal':
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
        return <ShadcnDashboardPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-zinc-900 font-sans text-slate-900 dark:text-slate-100 selection:bg-indigo-100 selection:text-indigo-900">
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
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
}
