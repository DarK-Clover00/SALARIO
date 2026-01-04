
import React, { useState } from 'react';
import { Wallet, Mail, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';
import { User as UserType } from '../types';

interface AuthProps {
  onLogin: (user: UserType) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulated auth delay
    setTimeout(() => {
      const storedUsers: UserType[] = JSON.parse(localStorage.getItem('salario_users') || '[]');

      if (isLogin) {
        const user = storedUsers.find(u => u.email === formData.email && u.password === formData.password);
        if (user) {
          onLogin(user);
        } else {
          setError('Invalid credentials.');
          setLoading(false);
        }
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match.');
          setLoading(false);
          return;
        }

        if (storedUsers.some(u => u.email === formData.email)) {
          setError('Email already registered.');
          setLoading(false);
          return;
        }

        const newUser: UserType = {
          id: Math.random().toString(36).substr(2, 9),
          username: formData.username,
          email: formData.email,
          password: formData.password
        };

        storedUsers.push(newUser);
        localStorage.setItem('salario_users', JSON.stringify(storedUsers));
        onLogin(newUser);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-6 relative overflow-hidden">
      {/* Decorative Circles */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 md:w-96 h-64 md:h-96 bg-emerald-100/50 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 md:w-96 h-64 md:h-96 bg-blue-100/50 rounded-full blur-3xl"></div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-3xl shadow-2xl shadow-slate-200/50 overflow-hidden relative z-10 border border-white">
        {/* Visual Panel - Hidden on Mobile */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-emerald-600 text-white relative">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 backdrop-blur-md p-2 rounded-xl">
              <Wallet className="w-8 h-8" />
            </div>
            <span className="text-2xl font-bold tracking-tight">SALARIO</span>
          </div>

          <div className="space-y-6">
            <h1 className="text-5xl font-bold leading-tight">Payroll management simplified.</h1>
            <p className="text-emerald-100/80 text-lg">
              Automate calculations, generate payslips, and keep your employees happy.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
              <p className="text-3xl font-bold">100%</p>
              <p className="text-sm opacity-80">Secure</p>
            </div>
            <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
              <p className="text-3xl font-bold">AI</p>
              <p className="text-sm opacity-80">Support</p>
            </div>
          </div>
        </div>

        {/* Form Panel */}
        <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto space-y-8">
            <div className="text-center lg:text-left">
              {/* Show logo on mobile only */}
              <div className="lg:hidden flex justify-center mb-6">
                 <div className="bg-emerald-600 p-2 rounded-xl text-white">
                   <Wallet className="w-8 h-8" />
                 </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
              <p className="text-slate-500 mt-2 text-sm md:text-base">
                {isLogin 
                  ? 'Sign in to access your dashboard.' 
                  : 'Start managing your payroll today.'}
              </p>
            </div>

            {error && (
              <div className="flex items-center space-x-2 p-4 bg-red-50 text-red-600 border border-red-100 rounded-2xl animate-in shake duration-300">
                <AlertCircle size={20} className="shrink-0" />
                <p className="text-xs font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Username</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      required
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                      className="w-full h-12 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full h-12 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    required
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full h-12 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      required
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      className="w-full h-12 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 flex items-center justify-center space-x-2 transition-all active:scale-95 disabled:opacity-50 mt-2"
              >
                <span>{loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}</span>
                {!loading && <ArrowRight size={20} />}
              </button>
            </form>

            <div className="text-center pt-4">
              <p className="text-slate-500 text-sm">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button 
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                  }}
                  className="ml-2 text-emerald-600 font-bold hover:underline"
                >
                  {isLogin ? 'Sign Up' : 'Log In'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
