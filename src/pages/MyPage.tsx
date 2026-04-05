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
                  <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-500 font-black text-xl border-4 border-white shadow-md">
                    SW
                  </div>
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
                <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-4">
                  <Heart className="w-8 h-8 text-rose-500" />
                </div>
                <h3 className="text-sm font-bold text-slate-500 mb-1">협업 온도</h3>
                <p className="text-3xl font-black text-slate-900">42.0°C</p>
                <p className="text-xs text-slate-400 mt-2 font-medium">상위 5%의 열정적인 동료</p>
              </div>
            </div>
            
            {/* 뱃지 컬렉션 요약 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
               <h2 className="text-xl font-bold mb-6 flex items-center"><Award className="w-6 h-6 mr-2 text-indigo-500" /> 뱃지 컬렉션</h2>
               <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-indigo-50 border-2 border-indigo-100 flex flex-col items-center"><Star className="w-8 h-8 text-yellow-500 mb-2" /><span className="text-xs font-bold text-slate-800">첫 걸음</span></div>
                  <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-100 flex flex-col items-center"><Shield className="w-8 h-8 text-emerald-500 mb-2" /><span className="text-xs font-bold text-slate-800">든든한 동료</span></div>
                  <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-100 opacity-30 grayscale flex flex-col items-center"><Trophy className="w-8 h-8 text-slate-400 mb-2" /><span className="text-xs font-bold text-slate-500">코드 마스터</span></div>
                  <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-100 opacity-30 grayscale flex flex-col items-center"><Flame className="w-8 h-8 text-slate-400 mb-2" /><span className="text-xs font-bold text-slate-500">불꽃 코더</span></div>
               </div>
            </div>
          </motion.div>
        )}

        {/* 2. 내 활동 탭 */}
        {activeTab === 'activity' && (
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
            <section className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 flex items-center"><Users className="w-5 h-5 mr-2 text-indigo-500" /> 나의 캠프</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myCamps.map(c => (
                  <div key={c.id} className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-md transition-all">
                    <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded uppercase">{c.category}</span>
                    <h4 className="font-bold text-slate-900 mt-2">{c.title}</h4>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xs text-slate-400 font-medium">{c.members}명 참여 중</span>
                      <span className="text-xs font-bold text-slate-700">{c.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </motion.div>
        )}

        {/* 3. 평판/리뷰 탭 */}
        {activeTab === 'reputation' && (
          <motion.div key="reputation" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <div className="bg-indigo-50 p-8 rounded-3xl border border-indigo-100">
              <h3 className="text-lg font-bold text-indigo-900 mb-2">동료들이 말하는 {profileForm.nickname} 님</h3>
              <p className="text-indigo-700/70 text-sm mb-6">동료 평가 데이터를 기반으로 분석된 키워드입니다.</p>
              <div className="flex flex-wrap gap-3">
                {myReviews.map(r => (
                  <div key={r.id} className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-indigo-100 flex items-center space-x-2 animate-in slide-in-from-bottom-2">
                    <span className="text-slate-800 font-bold text-sm">{r.tag}</span>
                    <span className="text-indigo-600 font-black text-xs bg-indigo-50 px-2 py-0.5 rounded-full">{r.count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center"><MessageSquare className="w-5 h-5 mr-2 text-indigo-500" /> 상세 피드백</h3>
              <p className="text-slate-400 text-sm text-center py-12 italic">"아직 공개된 상세 피드백이 없습니다."</p>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center bg-slate-50 px-4 rounded-2xl border border-slate-100"><Github className="w-4 h-4 text-slate-400 mr-3" /><input type="text" placeholder="GitHub" className="w-full py-4 bg-transparent outline-none text-sm" value={profileForm.links.github} /></div>
                <div className="flex items-center bg-slate-50 px-4 rounded-2xl border border-slate-100"><Globe className="w-4 h-4 text-slate-400 mr-3" /><input type="text" placeholder="Blog" className="w-full py-4 bg-transparent outline-none text-sm" value={profileForm.links.blog} /></div>
              </div>
            </div>

            {/* 계정 보안 섹션 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 space-y-6">
              <h3 className="font-black text-slate-900 flex items-center"><Lock className="w-5 h-5 mr-2 text-indigo-500" /> 계정 보안</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <div className="flex items-center space-x-3"><Mail className="w-5 h-5 text-slate-400"/><div className="text-sm font-bold text-slate-600">이메일 변경</div></div>
                  <button className="text-indigo-600 font-black text-xs hover:underline">변경</button>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <div className="flex items-center space-x-3"><Lock className="w-5 h-5 text-slate-400"/><div className="text-sm font-bold text-slate-600">비밀번호 재설정</div></div>
                  <button className="text-indigo-600 font-black text-xs hover:underline">재설정</button>
                </div>
              </div>
            </div>

            {/* 알림 설정 섹션 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 space-y-6">
              <h3 className="font-black text-slate-900 flex items-center"><Bell className="w-5 h-5 mr-2 text-indigo-500" /> 서비스 알림</h3>
              <div className="space-y-4">
                {[
                  { id: 'notifyPush', label: '브라우저 푸시 알림', desc: '팀 합류 신청 및 메시지 알림' },
                  { id: 'notifyEmail', label: '이메일 수신 동의', desc: '해커톤 추천 및 뉴스레터' }
                ].map(n => (
                  <div key={n.id} className="flex items-center justify-between">
                    <div><h4 className="text-sm font-bold text-slate-700">{n.label}</h4><p className="text-xs text-slate-400">{n.desc}</p></div>
                    <button 
                      onClick={() => setSettingsForm(prev => ({...prev, [n.id]: !(prev as any)[n.id]}))}
                      className={`w-12 h-6 rounded-full transition-all relative ${settingsForm[n.id as keyof typeof settingsForm] ? 'bg-indigo-600' : 'bg-slate-200'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settingsForm[n.id as keyof typeof settingsForm] ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                ))}
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