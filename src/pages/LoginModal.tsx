import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { Colors } from '../lib/colors';

interface LoginModalProps {
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onClose(); // Close modal on success
    } catch (err: any) {
      setError('Invalid email or password.');
    }
  };

  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).classList.contains('modal-overlay')) {
      onClose();
    }
  };

  return (
    <>
      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .login-modal {
          background: white;
          border-radius: 20px;
          padding: 2.5rem 3rem;
          width: 90%;
          max-width: 400px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          font-family: 'Inter', sans-serif;
          position: relative;
          animation: fadeIn 0.3s ease-in-out;
        }

        .login-title {
          font-size: 2rem;
          font-weight: bold;
          text-align: center;
          margin-bottom: 1.5rem;
          color: ${Colors.darkCherry};
          font-family: 'PottaOne', cursive;
        }

        .login-input {
          width: 100%;
          padding: 12px 16px;
          margin-bottom: 1rem;
          border-radius: 12px;
          border: 1px solid #ddd;
          font-size: 1rem;
        }

        .login-button {
          width: 100%;
          padding: 12px 0;
          background-color: ${Colors.teal};
          color: white;
          font-weight: bold;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: background-color 0.3s ease;
          font-size: 1rem;
        }

        .login-button:hover {
          background-color: ${Colors.darkCherry};
        }

        .login-error {
          color: red;
          text-align: center;
          font-size: 0.9rem;
          margin-top: 0.5rem;
        }

        .login-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: transparent;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>

      <div className="modal-overlay" onClick={handleClickOutside}>
        <div className="login-modal">
          <button className="login-close" onClick={onClose} aria-label="Close modal">×</button>

          <h1 className="login-title">Welcome Back 💅</h1>

          <input
            type="email"
            placeholder="Email"
            value={email}
            className="login-input"
            onChange={(e) => setEmail(e.target.value)}
            
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            className="login-input"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleSignIn} className="login-button">
            Sign In
          </button>

          {error && <p className="login-error">{error}</p>}
        </div>
      </div>
    </>
  );
};

export default LoginModal;