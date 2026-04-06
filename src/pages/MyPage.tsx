import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, User, Award, Loader2, CheckCircle2, 
  Target, Zap, Star, Shield, Flame, Trophy,
  Settings, LayoutDashboard, Github, Globe, Link, Linkedin, Edit3, Save,
  Calendar, Users, MessageSquare, Bell, Lock, Mail, ChevronRight, Heart
} from 'lucide-react';
import { useAuth } from '../components/AuthContext';
import toast from 'react-hot-toast';

type TabType = 'dashboard' | 'activity' | 'reputation' | 'settings';

export const MyPage = () => {
  const { user, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  // --- [상태 관리: AI 역량 스캐너 (복구됨!)] ---
  const [portfolioInput, setPortfolioInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);

  // --- [상태 관리: 프로필 및 계정 설정] ---
  const [profileForm, setProfileForm] = useState({
    nickname: userProfile?.nickname || '김승완',
    bio: '숭실대학교 미디어IT 전공. AI와 웹 기술을 활용한 가치 창출에 관심이 많습니다.',
    part: 'Frontend',
    links: { github: 'https://github.com/seungwan', blog: 'https://velog.io/@seungwan', linkedin: '', portfolio: '' }
  });

  const [settingsForm, setSettingsForm] = useState({
    email: user?.email || 'seungwan@soongsil.ac.kr',
    notifyPush: true,
    notifyEmail: false,
    notifyMarketing: false
  });

  // --- [더미 데이터: 활동 및 평판] ---
  const myHackathons = [
    { id: 1, title: '2026 유니-해커톤', role: '프론트엔드 리더', status: '수상 (최우수상)', date: '2026.01' },
    { id: 2, title: '숭실대 IT 연합 메이커톤', role: 'PM', status: '진행 중', date: '2026.04' }
  ];

  const myCamps = [
    { id: 1, title: 'AI 톺아보기 스터디', role: '방장', members: 5, category: 'AI/데이터' },
    { id: 2, title: 'Three.js 미디어아트 캠프', role: '참여', members: 12, category: '그래픽스' }
  ];

  const myReviews = [
    { id: 1, tag: '책임감이 강해요', count: 12 },
    { id: 2, tag: '코드 리뷰가 꼼꼼해요', count: 8 },
    { id: 3, tag: '시간 약속을 잘 지켜요', count: 15 }
  ];

  // --- [핸들러] ---
  const handleSaveAll = () => toast.success('모든 설정이 안전하게 저장되었습니다.');
  
  const handleAiScan = async () => {
    if (!portfolioInput.trim()) return toast.error('포트폴리오 내용이나 GitHub 링크를 입력해주세요.');
    setIsScanning(true);
    try {
      // 실제 구현 시 Gemini API 라우트로 연결
      const response = await fetch('/api/ai/scan-profile', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ portfolioText: portfolioInput })
      });
      if (!response.ok) throw new Error('AI 분석 서버와 연결 실패');
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setScanResult(data.parsed);
      toast.success('Gemini AI 역량 분석 완료!');
    } catch (error: any) {
      toast.error(error.message || '분석 중 오류 발생');
    } finally {
      setIsScanning(false);
    }
  };
  
  // 포인트 로직
  const currentPts = 350;
  const progressPercent = 70;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">마이페이지</h1>
          <p className="text-slate-500 font-medium">나의 성장 지표와 활동을 관리하세요.</p>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="flex space-x-1 bg-slate-100 p-1.5 rounded-2xl w-full md:w-fit overflow-x-auto no-scrollbar">
        {[
          { id: 'dashboard', label: '대시보드', icon: <LayoutDashboard className="w-4 h-4"/> },
          { id: 'activity', label: '내 활동', icon: <Calendar className="w-4 h-4"/> },
          { id: 'reputation', label: '평판/리뷰', icon: <Heart className="w-4 h-4"/> },
          { id: 'settings', label: '설정', icon: <Settings className="w-4 h-4"/> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`flex items-center px-5 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
              activeTab === tab.id ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <span className="mr-2">{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* 1. 대시보드 탭 */}
        {activeTab === 'dashboard' && (
          <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                <div className="flex items-center space-x-6 mb-8">
                  <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-500 font-black text-xl border-4 border-white shadow-md">SW</div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">{profileForm.nickname} 님</h2>
                    <p className="text-slate-400 text-sm font-medium">숭실대학교 미디어IT (학번: 20221634)</p>
                  </div>
                </div>
                <div className="pt-6 border-t border-slate-100">
                  <div className="flex justify-between items-end mb-3">
                    <span className="font-bold text-slate-700 flex items-center"><Zap className="w-4 h-4 mr-1 text-amber-500"/> 성장 포인트</span>
                    <span className="text-2xl font-black text-indigo-600">{currentPts} pts</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} className="h-full bg-indigo-600 rounded-full" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-4"><Heart className="w-8 h-8 text-rose-500" /></div>
                <h3 className="text-sm font-bold text-slate-500 mb-1">협업 온도</h3>
                <p className="text-3xl font-black text-slate-900">42.0°C</p>
                <p className="text-xs text-slate-400 mt-2 font-medium">상위 5%의 열정적인 동료</p>
              </div>
            </div>
            
            {/* 뱃지 컬렉션 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
               <h2 className="text-xl font-bold mb-6 flex items-center"><Award className="w-6 h-6 mr-2 text-indigo-500" /> 뱃지 컬렉션</h2>
               <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-indigo-50 border-2 border-indigo-100 flex flex-col items-center"><Star className="w-8 h-8 text-yellow-500 mb-2" /><span className="text-xs font-bold text-slate-800">첫 걸음</span></div>
                  <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-100 flex flex-col items-center"><Shield className="w-8 h-8 text-emerald-500 mb-2" /><span className="text-xs font-bold text-slate-800">든든한 동료</span></div>
                  <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-100 opacity-30 grayscale flex flex-col items-center"><Trophy className="w-8 h-8 text-slate-400 mb-2" /><span className="text-xs font-bold text-slate-500">코드 마스터</span></div>
                  <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-100 opacity-30 grayscale flex flex-col items-center"><Flame className="w-8 h-8 text-slate-400 mb-2" /><span className="text-xs font-bold text-slate-500">불꽃 코더</span></div>
               </div>
            </div>

            {/* 🔥 누락되었던 AI 역량 스캐너 완벽 복구 */}
            <div className="bg-gradient-to-br from-indigo-900 to-violet-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden mt-6">
              <div className="relative z-10 space-y-6">
                <div className="flex items-center space-x-3">
                  <Sparkles className="w-6 h-6 text-indigo-300" />
                  <h2 className="text-2xl font-bold">Gemini AI 역량 스캐너</h2>
                </div>
                <p className="text-indigo-200 font-medium text-sm">포트폴리오 내용이나 프로젝트 경험을 입력하면 Gemini가 분석하여 직군과 칭호를 부여합니다.</p>
                
                {!scanResult ? (
                  <div className="space-y-4">
                    <textarea 
                      value={portfolioInput} 
                      onChange={(e) => setPortfolioInput(e.target.value)} 
                      placeholder="참여했던 프로젝트, 기술 스택, GitHub 링크 등을 자유롭게 적어주세요..." 
                      className="w-full h-32 p-4 bg-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-indigo-400 resize-none text-sm placeholder:text-indigo-300/50" 
                    />
                    <button 
                      onClick={handleAiScan} 
                      disabled={isScanning} 
                      className="w-full py-4 bg-white text-indigo-900 rounded-xl font-black hover:bg-indigo-50 flex items-center justify-center disabled:opacity-70 transition-all active:scale-95"
                    >
                      {isScanning ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Gemini 분석 중...</> : <><Sparkles className="w-5 h-5 mr-2" />AI 스캔 시작하기</>}
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
          </motion.div>
        )}

        {/* 2. 내 활동 탭 */}
        {activeTab === 'activity' && (
           /* 기존 코드 동일 */
          <motion.div key="activity" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
            <section className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 flex items-center"><Calendar className="w-5 h-5 mr-2 text-indigo-500" /> 참여 해커톤</h3>
              <div className="grid gap-4">
                {myHackathons.map(h => (
                  <div key={h.id} className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center justify-between hover:border-indigo-200 transition-all">
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg">{h.title}</h4>
                      <p className="text-sm text-slate-500 font-medium">{h.date} • {h.role}</p>
                    </div>
                    <span className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-full text-xs font-black">{h.status}</span>
                  </div>
                ))}
              </div>
            </section>
          </motion.div>
        )}

        {/* 3. 평판 탭 & 4. 설정 탭 생략 (기존과 동일) */}
        {/* ... (생략 없이 이전 코드의 3, 4 탭 코드를 그대로 사용해 주세요) */}
        {/* 3. 평판/리뷰 탭 */}
        {activeTab === 'reputation' && (
          <motion.div key="reputation" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <div className="bg-indigo-50 p-8 rounded-3xl border border-indigo-100">
              <h3 className="text-lg font-bold text-indigo-900 mb-2">동료들이 말하는 {profileForm.nickname} 님</h3>
              <div className="flex flex-wrap gap-3 mt-4">
                {myReviews.map(r => (
                  <div key={r.id} className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-indigo-100 flex items-center space-x-2">
                    <span className="text-slate-800 font-bold text-sm">{r.tag}</span>
                    <span className="text-indigo-600 font-black text-xs bg-indigo-50 px-2 py-0.5 rounded-full">{r.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* 4. 설정 탭 (프로필 + 계정 + 알림) */}
        {activeTab === 'settings' && (
          <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            {/* 프로필 섹션 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 space-y-6">
              <h3 className="font-black text-slate-900 flex items-center"><Edit3 className="w-5 h-5 mr-2 text-indigo-500" /> 프로필 편집</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 ml-1">닉네임</label>
                  <input type="text" value={profileForm.nickname} onChange={(e) => setProfileForm({...profileForm, nickname: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 ml-1">희망 파트</label>
                  <select value={profileForm.part} onChange={(e) => setProfileForm({...profileForm, part: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none">
                    <option value="Frontend">Frontend</option><option value="Backend">Backend</option><option value="Designer">Designer</option><option value="PM">PM/기획</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 ml-1">한 줄 소개</label>
                <textarea value={profileForm.bio} onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-medium h-24 outline-none" />
              </div>
            </div>
            <button onClick={handleSaveAll} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black hover:shadow-xl transition-all flex items-center justify-center space-x-2">
              <Save className="w-5 h-5" /><span>모든 설정 저장하기</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};