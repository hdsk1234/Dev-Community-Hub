import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, Lock, User, Sparkles, Loader2, 
  CheckCircle2, Award, ChevronRight, ArrowLeft 
} from 'lucide-react';
import toast from 'react-hot-toast';

// 기존 auth 로직 연동을 위한 임시 훅 (실제 프로젝트에 맞게 수정)
// import { useAuth } from '../components/AuthContext'; 

export const SignupPage = () => {
  const navigate = useNavigate();
  // const { signup } = useAuth(); // 실제 AuthContext 연동 시 사용

  // --- [상태 관리: UI 단계] ---
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);

  // --- [상태 관리: 1단계 폼 (계정)] ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  // --- [상태 관리: 2단계 폼 (프로필 & AI 스캔)] ---
  const [nickname, setNickname] = useState('');
  const [part, setPart] = useState('Frontend');
  const [portfolioInput, setPortfolioInput] = useState('');
  
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);

  // --- [핸들러: AI 스캐너] ---
  const handleAiScan = async () => {
    if (!portfolioInput.trim()) return toast.error('프로젝트 경험이나 기술 스택을 입력해주세요.');
    setIsScanning(true);
    try {
      // 실제 구현 시 Gemini API 라우트로 연결
      const response = await fetch('/api/ai/scan-profile', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ portfolioText: portfolioInput })
      });
      if (!response.ok) throw new Error('AI 분석 서버와 연결 실패');
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      
      setScanResult(data.parsed);
      toast.success('Gemini AI 분석이 완료되었습니다!');
    } catch (error: any) {
      toast.error(error.message || '분석 중 오류 발생');
    } finally {
      setIsScanning(false);
    }
  };

  // --- [핸들러: 회원가입 최종 제출] ---
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname) return toast.error('닉네임을 입력해주세요.');
    if (!scanResult) return toast.error('원활한 팀 매칭을 위해 AI 역량 스캔을 완료해주세요.');

    setIsLoading(true);
    try {
      // 실제 회원가입 로직 연결 부분 (Firebase, Supabase, Custom API 등)
      // await signup(email, password, { nickname, part, aiTitle: scanResult.title });
      
      // 시뮬레이션용 딜레이
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('환영합니다! 회원가입이 완료되었습니다.');
      navigate('/'); // 메인 대시보드로 이동
    } catch (error: any) {
      toast.error(error.message || '회원가입 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-8">
        
        {/* 상단 헤더 영역 */}
        <div className="text-center">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            className="mx-auto h-16 w-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-200 mb-6"
          >
            <Sparkles className="h-8 w-8 text-white" />
          </motion.div>
          <h2 className="text-3xl font-black text-slate-900">
            {step === 1 ? '새로운 여정의 시작' : '개발자 프로필 완성'}
          </h2>
          <p className="mt-3 text-slate-500 font-medium">
            {step === 1 
              ? '사용하실 이메일과 비밀번호를 입력해 주세요.' 
              : 'Gemini AI가 당신의 역량을 분석하여 맞춤형 칭호를 부여합니다.'}
          </p>
        </div>

        {/* 폼 영역 */}
        <div className="bg-white py-10 px-8 shadow-xl shadow-slate-200/50 rounded-3xl border border-slate-100">
          <AnimatePresence mode="wait">
            
            {/* --- [Step 1: 계정 정보] --- */}
            {step === 1 && (
              <motion.form 
                key="step1"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!email || !password || password !== passwordConfirm) {
                    return toast.error('이메일과 비밀번호를 정확히 확인해주세요.');
                  }
                  setStep(2);
                }}
              >
                <div className="space-y-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-400" />
                    </div>
                    <input 
                      type="email" required placeholder="이메일 주소" value={email} onChange={e => setEmail(e.target.value)}
                      className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <input 
                      type="password" required placeholder="비밀번호" value={password} onChange={e => setPassword(e.target.value)}
                      className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <CheckCircle2 className="h-5 w-5 text-slate-400" />
                    </div>
                    <input 
                      type="password" required placeholder="비밀번호 확인" value={passwordConfirm} onChange={e => setPasswordConfirm(e.target.value)}
                      className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <button type="submit" className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-2xl shadow-md text-sm font-black text-white bg-indigo-600 hover:bg-indigo-700 transition-all">
                  다음 단계로 <ChevronRight className="ml-2 w-4 h-4" />
                </button>
                
                <p className="text-center text-sm text-slate-500 font-medium mt-4">
                  이미 계정이 있으신가요? <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-500">로그인하기</Link>
                </p>
              </motion.form>
            )}

            {/* --- [Step 2: 프로필 및 AI 스캐너] --- */}
            {step === 2 && (
              <motion.form 
                key="step2"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
                onSubmit={handleSignupSubmit}
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 ml-1">사용할 닉네임</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><User className="h-4 w-4 text-slate-400" /></div>
                      <input type="text" required value={nickname} onChange={e => setNickname(e.target.value)} className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="닉네임" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 ml-1">주력 파트</label>
                    <select value={part} onChange={e => setPart(e.target.value)} className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none">
                      <option value="Frontend">Frontend</option><option value="Backend">Backend</option><option value="Designer">Designer</option><option value="PM">PM/기획</option>
                    </select>
                  </div>
                </div>

                {/* AI 역량 스캐너 영역 */}
                <div className="bg-gradient-to-br from-slate-900 to-indigo-900 rounded-2xl p-6 text-white shadow-lg mt-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Sparkles className="w-5 h-5 text-indigo-300" />
                    <h3 className="font-bold text-lg">AI 포트폴리오 스캔</h3>
                  </div>
                  
                  {!scanResult ? (
                    <div className="space-y-3">
                      <textarea 
                        value={portfolioInput} onChange={e => setPortfolioInput(e.target.value)}
                        placeholder="자신있는 기술 스택, 참여했던 프로젝트, 또는 깃허브 리드미 내용을 간단히 적어주세요."
                        className="w-full h-24 p-4 bg-white/10 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-400 resize-none text-sm placeholder:text-indigo-200/50"
                      />
                      <button 
                        type="button" onClick={handleAiScan} disabled={isScanning}
                        className="w-full py-3 bg-white text-indigo-900 rounded-xl font-black flex items-center justify-center disabled:opacity-70 transition-all active:scale-95 text-sm"
                      >
                        {isScanning ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />분석 중...</> : '내 역량 스캔하기'}
                      </button>
                    </div>
                  ) : (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/10 rounded-xl p-5 border border-white/20">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg"><Award className="w-6 h-6 text-white" /></div>
                        <div>
                          <span className="text-emerald-300 text-xs font-bold uppercase tracking-widest">{scanResult.role}</span>
                          <h4 className="text-lg font-black">{scanResult.title}</h4>
                        </div>
                      </div>
                      <p className="mt-3 text-xs text-indigo-100 leading-relaxed bg-black/20 p-3 rounded-lg">"{scanResult.reason}"</p>
                      <button type="button" onClick={() => setScanResult(null)} className="mt-3 text-xs text-indigo-300 hover:text-white font-bold transition-colors w-full text-right">다시 분석하기</button>
                    </motion.div>
                  )}
                </div>

                <div className="flex space-x-3 pt-4">
                  <button type="button" onClick={() => setStep(1)} className="px-4 py-4 border border-slate-200 rounded-2xl text-slate-500 hover:bg-slate-50 transition-all">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <button type="submit" disabled={isLoading} className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center disabled:opacity-70">
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : '회원가입 완료'}
                  </button>
                </div>
              </motion.form>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};