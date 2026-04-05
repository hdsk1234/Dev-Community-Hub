import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';
import { motion } from 'motion/react';
import { LogIn, Mail, Lock, Chrome, AlertCircle } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🔥 에러 코드 한글 변환 로직
  const getErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case 'auth/invalid-email':
        return '유효하지 않은 이메일 형식입니다.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return '이메일 또는 비밀번호가 일치하지 않습니다.';
      case 'auth/too-many-requests':
        return '너무 많은 로그인 시도가 있었습니다. 잠시 후 다시 시도해주세요.';
      default:
        return '로그인 중 오류가 발생했습니다.';
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err: any) {
      setError(getErrorMessage(err.code)); // 한글 에러 메시지 세팅
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError('구글 로그인에 실패했습니다.');
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-indigo-100">
          <LogIn className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-black text-slate-900">반가워요!</h1>
        <p className="text-slate-500">DevHub 계정으로 로그인하세요.</p>
      </div>

      {/* 에러 발생 시 메시지 표시 */}
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-center gap-2"
        >
          <AlertCircle className="w-4 h-4" />
          <span className="font-bold">{error}</span>
        </motion.div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-bold text-slate-700">이메일</label>
          <div className="relative">
            <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${error ? 'text-red-400' : 'text-slate-400'}`} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              // 에러 시 테두리 색상 변경 로직만 추가
              className={`w-full pl-12 pr-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 outline-none transition-all ${
                error ? 'border-red-200 focus:ring-red-500' : 'border-slate-200 focus:ring-indigo-500'
              }`}
              placeholder="example@email.com"
              required
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-bold text-slate-700">비밀번호</label>
          <div className="relative">
            <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${error ? 'text-red-400' : 'text-slate-400'}`} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              // 에러 시 테두리 색상 변경 로직만 추가
              className={`w-full pl-12 pr-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 outline-none transition-all ${
                error ? 'border-red-200 focus:ring-red-500' : 'border-slate-200 focus:ring-indigo-500'
              }`}
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50"
        >
          {loading ? '로그인 중...' : '로그인'}
        </button>
      </form>

      <div className="mt-6">
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-slate-500 font-medium">또는</span>
          </div>
        </div>

        {/* 구글 버튼 - 원본 색상/스타일 유지 */}
        <button
          onClick={handleGoogleLogin}
          className="w-full py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-slate-50 transition-all"
        >
          <Chrome className="w-5 h-5" />
          <span>Google로 계속하기</span>
        </button>
      </div>

      <p className="mt-8 text-center text-sm text-slate-500">
        계정이 없으신가요?{' '}
        <Link to="/signup" className="text-indigo-600 font-bold hover:underline">
          회원가입
        </Link>
      </p>
    </div>
  );
};