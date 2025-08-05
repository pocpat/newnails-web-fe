import React from 'react';
import './Layout.css'; // We'll create this file next
import Header from './Header';


// A simple placeholder for the Footer component
const Footer = () => (
  <footer className="app-footer">
    © {new Date().getFullYear()} DiPSY. All Rights Reserved.
  </footer>
);


const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="app-layout ">
      <Header />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;













// =================== OLD ========================

// import Header from './Header';
// import Footer from './Footer';




// const Layout = ({ children }: { children: React.ReactNode }) => {
//   return (
//     <>
//       <Header />
//       <main>{children}</main>
//       <Footer />
//     </>
//   );
// };

// export default Layout;
