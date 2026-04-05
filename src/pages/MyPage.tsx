import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, User, Award, Loader2, CheckCircle2, Target, Zap } from 'lucide-react';
import { useAuth } from '../components/AuthContext';
import toast from 'react-hot-toast';

interface AiScanResult { role: string; title: string; reason: string; }

export const MyPage = () => {
  const { user, userProfile } = useAuth();
  
  // AI 스캐너 상태
  const [portfolioInput, setPortfolioInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<AiScanResult | null>(null);

  // 🔥 누락되었던 포인트 및 티어 시스템 복구 로직
  // (실제 프로필에 포인트가 없으면 시연용으로 350pts 세팅)
  const currentPts = userProfile?.points ?? 350; 
  
  const getTierInfo = (pts: number) => {
    if (pts >= 1000) return { name: '마스터', currentMax: 1000, nextTier: null };
    if (pts >= 500) return { name: '에이스', currentMax: 1000, nextTier: '마스터' };
    return { name: '루키', currentMax: 500, nextTier: '에이스' };
  };

  const tier = getTierInfo(currentPts);
  const progressPercent = tier.nextTier === null ? 100 : (currentPts / tier.currentMax) * 100;
  const ptsRemaining = tier.nextTier === null ? 0 : tier.currentMax - currentPts;

  const handleAiScan = async () => {
    if (!portfolioInput.trim()) return toast.error('포트폴리오 내용이나 GitHub 링크를 입력해주세요.');
    setIsScanning(true);
    try {
      const response = await fetch('/api/ai/scan-profile', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ portfolioText: portfolioInput })
      });
      if (!response.ok) throw new Error('AI 분석 서버와 연결 실패');
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setScanResult(data.parsed);
      toast.success('AI 역량 분석 완료!');
    } catch (error: any) {
      toast.error(error.message || '분석 중 오류 발생');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h1 className="text-3xl font-black text-slate-900">마이페이지</h1>
      
      {/* 1. 프로필 & 포인트 대시보드 (복구 완료) */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-8">
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 shadow-inner">
            <User className="w-10 h-10" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-1">
              <h2 className="text-2xl font-bold text-slate-900">{userProfile?.nickname || '개발자'} 님</h2>
              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-black rounded-full uppercase tracking-wider">
                {tier.name}
              </span>
            </div>
            <p className="text-slate-500 font-medium">{user?.email}</p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100">
          <div className="flex items-end justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <span className="font-bold text-slate-700">성장 포인트</span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-indigo-600">{currentPts.toLocaleString()}</span>
              <span className="text-slate-400 font-medium ml-1">pts</span>
            </div>
          </div>
          
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-3 shadow-inner">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full"
            />
          </div>
          
          {tier.nextTier ? (
            <p className="text-right text-sm text-slate-500 font-medium flex items-center justify-end">
              <Target className="w-4 h-4 mr-1 text-slate-400" />
              다음 등급 <strong className="text-slate-700 mx-1">{tier.nextTier}</strong>까지 <strong className="text-indigo-500 ml-1">{ptsRemaining.toLocaleString()} pts</strong> 남음
            </p>
          ) : (
            <p className="text-right text-sm text-emerald-500 font-bold flex items-center justify-end">
              <Award className="w-4 h-4 mr-1" /> 최고 등급 달성!
            </p>
          )}
        </div>
      </div>

      {/* 2. AI 역량 스캐너 (기존 융합) */}
      <div className="bg-gradient-to-br from-indigo-900 to-violet-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-6">
          <div className="flex items-center space-x-3">
            <Sparkles className="w-6 h-6 text-indigo-300" />
            <h2 className="text-2xl font-bold">AI 역량 스캐너</h2>
          </div>
          <p className="text-indigo-200 font-medium">포트폴리오 내용을 입력하면 Gemini AI가 직군과 인증 칭호를 부여합니다.</p>
          {!scanResult ? (
            <div className="space-y-4">
              <textarea value={portfolioInput} onChange={(e) => setPortfolioInput(e.target.value)} placeholder="GitHub 리드미 텍스트 등..." className="w-full h-32 p-4 bg-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-indigo-400 resize-none" />
              <button onClick={handleAiScan} disabled={isScanning} className="w-full py-4 bg-white text-indigo-900 rounded-xl font-black hover:bg-indigo-50 flex items-center justify-center disabled:opacity-70 transition-all active:scale-95">
                {isScanning ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />분석 중...</> : <><Sparkles className="w-5 h-5 mr-2" />스캔 시작하기</>}
              </button>
            </div>
          ) : (
            <AnimatePresence>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/10 rounded-2xl p-6 backdrop-blur-md border border-white/20">
                <div className="flex justify-between pb-4 border-b border-white/10 mb-4">
                  <span className="text-emerald-300 font-bold flex items-center"><CheckCircle2 className="w-5 h-5 mr-2" />분석 완료</span>
                  <button onClick={() => setScanResult(null)} className="text-xs text-indigo-300 hover:text-white font-bold transition-colors">다시 스캔</button>
                </div>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg"><Award className="w-8 h-8 text-white" /></div>
                  <div>
                    <span className="text-indigo-200 text-sm font-bold uppercase tracking-widest">{scanResult.role}</span>
                    <h3 className="text-2xl font-black">{scanResult.title}</h3>
                  </div>
                </div>
                <div className="p-4 bg-black/20 rounded-xl">
                  <p className="text-sm font-medium text-indigo-100 leading-relaxed">"{scanResult.reason}"</p>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};