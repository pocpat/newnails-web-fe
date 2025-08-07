import React, {useState} from 'react';
import './Layout.css'; 
import Header from './Header';
import LoginModal from '../pages/LoginModal';
import { useLoginModal } from '../lib/LoginModalContext';


// A simple placeholder for the Footer component
const Footer = () => (
  <footer className="app-footer">
    © {new Date().getFullYear()} DiPSY. All Rights Reserved.
  </footer>
);


const Layout = ({ children }: { children: React.ReactNode }) => {
    const { isLoginModalOpen, setIsLoginModalOpen } = useLoginModal();

  return (
    <div className="app-layout ">
      <Header />
      <main className={`main-content ${isLoginModalOpen ? 'blurred' : ''}`}>
        {children}
      </main>
      <Footer />
       {isLoginModalOpen && <LoginModal onClose={() => setIsLoginModalOpen(false)} />}
    </div>
  );
};

export default Layout;











