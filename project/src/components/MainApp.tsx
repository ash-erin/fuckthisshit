import React from 'react';
import { useAuth } from '../hooks/useAuth';
import AuthPage from './auth/AuthPage';
import AuthenticatedApp from './AuthenticatedApp';
import LoadingSpinner from './LoadingSpinner';

const MainApp: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  // Show authentication page if user is not logged in
  if (!user) {
    return <AuthPage />;
  }

  // Show main authenticated application
  return <AuthenticatedApp />;
};

export default MainApp;