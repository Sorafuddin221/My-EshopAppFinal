'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab: 'signIn' | 'signUp';
}

export default function AuthModal({ isOpen, onClose, initialTab }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [signInMessage, setSignInMessage] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpUsername, setSignUpUsername] = useState(''); // New state for username
  const [signUpMessage, setSignUpMessage] = useState('');

  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    setActiveTab(initialTab);
    setSignInMessage('');
    setSignUpMessage('');
  }, [initialTab]);

  if (!isOpen) return null;

  if (!auth) {
    return null; // Or a loading spinner, or some other fallback UI
  }

  const { login, register } = auth;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignInMessage('');
    const result = await login(signInEmail, signInPassword);
    if (result.success) {
      setSignInMessage('Login successful!');
      onClose(); // Close modal on successful login
      router.push('/dashboard'); // Redirect to dashboard
    } else {
      setSignInMessage(result.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpMessage('');
    const result = await register(signUpEmail, signUpPassword, signUpUsername);
    if (result.success) {
      setSignUpMessage(result.message || 'Registration successful! Please wait for admin approval.');
      setSignUpEmail('');
      setSignUpPassword('');
      setActiveTab('signIn'); // Switch to sign in tab after successful registration
    } else {
      setSignUpMessage(result.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Left side: Image/Text */}
        <div className="md:w-1/2 p-8 text-white flex flex-col justify-center items-center rounded-l-lg" style={{ background: "linear-gradient(rgba(240, 117, 72, 0.8), rgba(240, 117, 72, 0.8)), url('https://placehold.co/1000x1000/1e293b/FFFFFF?text=Blurb+Store') center/cover no-repeat" }}>
          <h3 className="text-3xl font-bold mb-4">GALLERY IMG</h3>
          <p className="text-center text-sm">
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.
          </p>
        </div>
        {/* Right side: Form */}
        <div className="md:w-1/2 p-8 relative">
          {/* Close Button */}
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200">
            <FontAwesomeIcon icon={faTimes} className="text-xl" />
          </button>
          <div className="flex border-b mb-6">
            <button
              id="signInTab"
              onClick={() => setActiveTab('signIn')}
              className={`flex-1 text-center py-4 text-gray-800 font-semibold transition-colors duration-200 ${activeTab === 'signIn' ? 'border-b-2 border-red-500' : 'border-transparent hover:text-gray-800'}`}
            >
              SIGN IN
            </button>
            <button
              id="signUpTab"
              onClick={() => setActiveTab('signUp')}
              className={`flex-1 text-center py-4 text-gray-800 font-semibold transition-colors duration-200 ${activeTab === 'signUp' ? 'border-b-2 border-red-500' : 'border-transparent hover:text-gray-800'}`}
            >
              SIGN UP
            </button>
          </div>

          {/* Sign In Form */}
          <div id="signInForm" className={`${activeTab === 'signIn' ? 'block' : 'hidden'} space-y-6`}>
            <form onSubmit={handleSignIn} method="post">
              <div>
                <label htmlFor="signin-email" className="text-sm font-medium text-gray-700">Email address</label>
                <input
                  type="email"
                  id="signin-email"
                  name="signin-email"
                  placeholder="john.doe@example.com"
                  className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="signin-password" className="text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  id="signin-password"
                  name="signin-password"
                  placeholder="*******"
                  className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-red-500 border-gray-300 rounded focus:ring-red-500" />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember Me
                  </label>
                </div>
                <a href="#" className="text-sm text-gray-500 hover:underline">Lost your password?</a>
              </div>
              {signInMessage && <p className="text-sm text-center mt-4" style={{ color: signInMessage.includes('successful') ? 'green' : 'red' }}>{signInMessage}</p>}
              <button type="submit" className="w-full bg-red-500 text-white font-bold py-3 rounded-md shadow-md hover:bg-red-600 transition-colors duration-200">
                LOG IN
              </button>
            </form>
          </div>

          {/* Sign Up Form */}
          <div id="signUpForm" className={`${activeTab === 'signUp' ? 'block' : 'hidden'} space-y-6`}>
            <form onSubmit={handleSignUp} method="post">
              <div>
                <label htmlFor="signup-username" className="text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  id="signup-username"
                  name="signup-username"
                  placeholder="john.doe"
                  className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={signUpUsername}
                  onChange={(e) => setSignUpUsername(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="signup-email" className="text-sm font-medium text-gray-700">Email address</label>
                <input
                  type="email"
                  id="signup-email"
                  name="signup-email"
                  placeholder="john.doe@example.com"
                  className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="signup-password" className="text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  id="signup-password"
                  name="signup-password"
                  placeholder="*******"
                  className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  required
                />
              </div>
              {signUpMessage && <p className="text-sm text-center mt-4" style={{ color: signUpMessage.includes('successful') ? 'green' : 'red' }}>{signUpMessage}</p>}
              <button type="submit" className="w-full bg-gray-800 text-white font-bold py-3 rounded-md shadow-md hover:bg-gray-900 transition-colors duration-200">
                SIGN UP
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}