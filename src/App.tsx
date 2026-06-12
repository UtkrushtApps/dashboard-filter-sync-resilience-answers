import React from 'react';
import DashboardPage from './pages/DashboardPage';

const appShellStyle: React.CSSProperties = {
  minHeight: '100vh',
  background: '#f0f2f5',
};

const headerStyle: React.CSSProperties = {
  background: '#1a1a2e',
  color: '#ffffff',
  padding: '16px 32px',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
};

const logoStyle: React.CSSProperties = {
  width: 32,
  height: 32,
  background: '#4f8ef7',
  borderRadius: 8,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 700,
  fontSize: 18,
};

const App: React.FC = () => {
  return (
    <div style={appShellStyle}>
      <header style={headerStyle}>
        <div style={logoStyle}>U</div>
        <span style={{ fontSize: 20, fontWeight: 600, letterSpacing: 0.5 }}>
          Utkrusht Analytics
        </span>
      </header>
      <main>
        <DashboardPage />
      </main>
    </div>
  );
};

export default App;
