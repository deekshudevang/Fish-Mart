import React from 'react';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import { useUser } from '../context/UserContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const { loginWithGoogle } = useUser();
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      await loginWithGoogle(credentialResponse.credential);
      navigate('/'); // Redirect to home on success
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center pt-12 px-4">
      {/* Logo Section */}
      <Link to="/" className="flex items-center space-x-3 mb-8 group">
        <span className="text-4xl">🐠</span>
        <span className="text-3xl font-display font-bold text-gradient-cyan">
          Exotic Fish Mart
        </span>
      </Link>

      {/* Login Card (Amazon Style) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[350px] bg-white rounded-lg p-8 shadow-xl"
      >
        <h1 className="text-3xl font-medium mb-6 text-gray-900">Sign in</h1>
        
        <p className="text-sm text-gray-700 mb-6 leading-relaxed">
          Unlock a world of majestic aquatic life. Connect your Google account to start your collection.
        </p>

        <div className="flex flex-col space-y-4">
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={() => console.error('Login Failed')}
              useOneTap
              theme="outline"
              shape="rectangular"
              width="286"
              text="continue_with"
            />
          </div>

          <p className="text-xs text-gray-500 mt-6 leading-tight">
            By continuing, you agree to Exotic Fish Mart's <span className="text-blue-600 hover:underline cursor-pointer">Conditions of Use</span> and <span className="text-blue-600 hover:underline cursor-pointer">Privacy Notice</span>.
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-400 font-medium">New to our Mart?</span>
          </div>
          <Link
            to="/"
            className="mt-4 w-full block text-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            Explore our collection
          </Link>
        </div>
      </motion.div>

      {/* Footer */}
      <div className="mt-8 flex space-x-6 text-xs text-blue-600">
        <span className="hover:underline cursor-pointer">Conditions of Use</span>
        <span className="hover:underline cursor-pointer">Privacy Notice</span>
        <span className="hover:underline cursor-pointer">Help</span>
      </div>
      <p className="mt-4 text-[11px] text-gray-500">
        © 2024-2026, Exotic Fish Mart, Inc. or its affiliates
      </p>
    </div>
  );
}
