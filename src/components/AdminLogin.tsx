import { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

interface AdminLoginProps {
  onLogin: () => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const { login } = useAdmin();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate loading for better UX
    await new Promise((resolve) => setTimeout(resolve, 500));

    const success = login(password);
    if (success) {
      onLogin();
    } else {
      setError('Incorrect password. Please try again.');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-[#3B82F6] flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Access</h1>
          <p className="text-[#666]">Enter your password to manage the portfolio</p>
        </div>

        {/* Login form */}
        <form
          onSubmit={handleSubmit}
          className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-8"
        >
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="mb-6">
            <label className="block text-[#A0A0A0] text-sm mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg px-4 py-3 text-white pr-12 focus:outline-none focus:border-[#3B82F6] transition-colors"
                placeholder="Enter admin password"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !password}
            className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <span>Access Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>


        </form>

        {/* Back to site */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="text-[#666] hover:text-[#3B82F6] transition-colors text-sm"
          >
            ← Back to Portfolio
          </a>
        </div>
      </div>
    </div>
  );
}
