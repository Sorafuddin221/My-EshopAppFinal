'use client';

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginSection({ onLogin }: { onLogin: (success: boolean) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [mfaRequired, setMfaRequired] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage('');
    if (mfaRequired) {
      // Handle MFA code submission
      try {
        const response = await fetch('/api/auth/verify-mfa', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, mfaCode }),
        });

        const data = await response.json();

        if (response.ok) {
          setMessage('MFA verification successful!');
          // Assuming the backend returns a token on successful MFA verification
          // You might need to store this token in local storage or context
          // For now, redirect to dashboard
          router.push('/dashboard');
        } else {
          setMessage(data.msg || 'MFA verification failed. Please try again.');
        }
      } catch (err) {
        console.error('MFA verification failed:', err);
        setMessage('Network error during MFA verification. Please try again.');
      }
    } else {
      // Handle initial login submission
      const result = await login(email, password);
      if (result.success) {
        setMessage('Login successful!');
        onLogin(true);
        router.push('/dashboard'); // Redirect to dashboard
      } else {
        if (result.message && result.message.includes('MFA required')) {
          setMfaRequired(true);
          setMessage(result.message);
        } else {
          setMessage(result.message || 'Login failed. Please check your credentials.');
        }
      }
    }
  };

  return (
    <div id="login-section" className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Admin Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {message && (
            <div className={`bg-${message.includes('successful') ? 'green' : 'red'}-100 border border-${message.includes('successful') ? 'green' : 'red'}-400 text-${message.includes('successful') ? 'green' : 'red'}-700 px-4 py-3 rounded relative`} role="alert">
              <span className="block sm:inline">{message}</span>
            </div>
          )}
          {!mfaRequired ? (
            <>
              <div>
                <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="mdsorafuddin@gmail.com"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </>
          ) : (
            <div>
              <label htmlFor="mfaCode" className="block text-gray-700 text-sm font-bold mb-2">
                MFA Code
              </label>
              <input
                type="text"
                id="mfaCode"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter MFA code"
                required
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
              />
            </div>
          )}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            >
              {mfaRequired ? 'Verify MFA' : 'Sign In'}
            </button>
          </div>
        </form>
        
      </div>
    </div>
  );
}
