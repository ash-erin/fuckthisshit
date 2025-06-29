import React, { useState } from 'react';
import DashboardLayout from './DashboardLayout';
import DashboardHome from './DashboardHome';
import ProfilePage from './ProfilePage';
import SettingsPage from './SettingsPage';
import ActivityPage from './ActivityPage';

interface DashboardAppProps {
  initialPage?: string;
  onPageChange?: (page: string) => void;
}

const DashboardApp: React.FC<DashboardAppProps> = ({ 
  initialPage = 'dashboard',
  onPageChange 
}) => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    if (onPageChange) {
      onPageChange(page);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardHome />;
      case 'profile':
        return <ProfilePage />;
      case 'settings':
        return <SettingsPage />;
      case 'activity':
        return <ActivityPage />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <DashboardLayout currentPage={currentPage} onPageChange={handlePageChange}>
      {renderPage()}
    </DashboardLayout>
  );
};

export default DashboardApp;