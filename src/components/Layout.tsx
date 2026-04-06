// src/components/Layout.tsx
import React from 'react';
import '../styles/components.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout">
      <header className="header">
        <h1>Photo Gallery</h1>
      </header>
      <main>
        {children}
      </main>
    </div>
  );
};

export default Layout;
