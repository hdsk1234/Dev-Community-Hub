import React from 'react';
import { useAuth } from '../components/AuthContext';
import { motion } from 'motion/react';
import { User, Trophy, Code2, Thermometer, Mail, Calendar, Settings, ChevronRight } from 'lucide-react';
import { Navigate } from 'react-router-dom';

export const MyPage = () => {
  const { user, userProfile, loading } = useAuth();

  if (loading) return <div className="flex justify-center py-20">로딩 중...</div>;
  if (!user) return <Navigate to="/login" />;

  const stats = [
    { label: '참여 해커톤', value: '3개', icon: Code2, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: '현재 랭킹', value: '128위', icon: Trophy, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: '매너 온도', value: `${userProfile?.mannerTemp || 36.5}°C`, icon: Thermometer, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  const myHackathons = [
    { id: 1, title: '2026 글로벌 AI 챌린지', status: '진행 중', date: '2026.03.15 - 03.25' },
    { id: 2, title: 'K-디지털 해커톤', status: '종료', date: '2026.01.10 - 01.20' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header */}
      <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-200/50">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-indigo-200">
              {userProfile?.nickname?.[0] || user.email?.[0].toUpperCase()}
            </div>
            <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full border border-slate-200 shadow-lg hover:bg-slate-50 transition-all">
              <Settings className="w-5 h-5 text-slate-600" />
            </button>
          </div>
          
          <div className="flex-1 text-center md:text-left space-y-2">
            <h1 className="text-3xl font-black text-slate-900">{userProfile?.nickname || '사용자'}</h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-slate-500 text-sm">
              <div className="flex items-center gap-1.5">
                <Mail className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>가입일: {userProfile?.createdAt?.toDate ? userProfile.createdAt.toDate().toLocaleDateString() : '최근'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`${stat.bg} p-6 rounded-2xl flex items-center gap-4`}
            >
              <div className={`p-3 bg-white rounded-xl ${stat.color} shadow-sm`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                <p className={`text-xl font-black ${stat.color}`}>{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* My Hackathons */}
        <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-200/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Code2 className="w-6 h-6 text-indigo-600" />
              내 해커톤
            </h2>
            <button className="text-sm font-bold text-indigo-600 hover:underline">전체보기</button>
          </div>
          <div className="space-y-4">
            {myHackathons.map((h) => (
              <div key={h.id} className="p-4 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-all group cursor-pointer">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{h.title}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${h.status === '진행 중' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                    {h.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{h.date}</p>
              </div>
            ))}
          </div>
        </section>

        {/* My Ranking Info */}
        <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-200/50">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 mb-6">
            <Trophy className="w-6 h-6 text-amber-500" />
            내 랭킹 정보
          </h2>
          <div className="space-y-6">
            <div className="p-6 bg-slate-50 rounded-2xl text-center">
              <p className="text-sm font-bold text-slate-500 mb-1">상위</p>
              <p className="text-4xl font-black text-indigo-600">15%</p>
              <p className="text-xs text-slate-400 mt-2">전체 1,240명 중 128위</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">다음 등급까지</span>
                <span className="font-bold text-slate-900">120 pts 남음</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="w-[70%] h-full bg-indigo-600 rounded-full" />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Account Info */}
      <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-200/50">
        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 mb-6">
          <User className="w-6 h-6 text-slate-600" />
          내 정보 관리
        </h2>
        <div className="divide-y divide-slate-100">
          {[
            { label: '닉네임 변경', value: userProfile?.nickname },
            { label: '이메일 주소', value: user.email },
            { label: '비밀번호 변경', value: '********' },
            { label: '알림 설정', value: '켜짐' },
          ].map((item) => (
            <div key={item.label} className="py-4 flex items-center justify-between group cursor-pointer">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{item.label}</p>
                <p className="text-slate-700 font-medium">{item.value}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 transition-all" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
