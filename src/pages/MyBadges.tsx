import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; 
import { 
  Heart, 
  Lightbulb, 
  Zap, 
  Cpu, 
  MessagesSquare, 
  ChevronLeft, 
  X, 
  Calendar, 
  Award 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// 데이터 구조 정의
interface BadgeHistory {
  title: string;
  date: string;
}

interface Badge {
  name: string;
  count: number;
  icon: React.ReactNode;
  color: string;
  history: BadgeHistory[];
}

export const MyBadges = () => {
  const navigate = useNavigate();
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const badges: Badge[] = [
    { 
      name: '친절', 
      count: 2, 
      icon: <Heart className="w-12 h-12" />, // 아이콘 크기 UP
      color: 'bg-rose-50 text-rose-500',
      history: [
        { title: '2026 글로벌 AI 챌린지', date: '2026.03.25' },
        { title: '제 4회 스마트 시티 투게더', date: '2025.11.07' }
      ]
    },
    { 
      name: '아이디어뱅크', 
      count: 1, 
      icon: <Lightbulb className="w-12 h-12" />, // 아이콘 크기 UP
      color: 'bg-amber-50 text-amber-500',
      history: [
        { title: '구름톤 in Jeju 12기', date: '2025.05.18' }
      ]
    },
    { 
      name: '성실왕', 
      count: 3, 
      icon: <Zap className="w-12 h-12" />, // 아이콘 크기 UP
      color: 'bg-yellow-50 text-yellow-500',
      history: [
        { title: 'K-디지털 해커톤', date: '2026.01.20' },
        { title: '유니버시티 연합 해커톤', date: '2025.08.22' },
        { title: '제 3회 스마트 시티 투게더', date: '2024.11.05' }
      ]
    },
    { 
      name: '코딩천재', 
      count: 0, 
      icon: <Cpu className="w-12 h-12" />, // 아이콘 크기 UP
      color: 'bg-blue-50 text-blue-500',
      history: [] 
    },
    { 
      name: '의사소통 마스터', 
      count: 4, 
      icon: <MessagesSquare className="w-12 h-12" />, // 아이콘 크기 UP
      color: 'bg-indigo-50 text-indigo-500',
      history: [
        { title: '2026 글로벌 AI 챌린지', date: '2026.03.25' },
        { title: 'K-디지털 해커톤', date: '2026.01.20' },
        { title: '구름톤 in Jeju 12기', date: '2025.05.18' },
        { title: '제 2회 해커톤 챌린지', date: '2024.08.10' }
      ]
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      {/* 상단 헤더 */}
      <div className="flex items-center gap-4 text-left pt-6">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-200 rounded-full transition-all group">
          <ChevronLeft className="w-6 h-6 text-slate-600 group-hover:text-indigo-600" />
        </button>
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-2">
            나의 뱃지 보관함
          </h1>
          <p className="text-sm text-slate-500 font-medium">동료들이 남겨준 소중한 평가들입니다.</p>
        </div>
      </div>

      {/* 뱃지 그리드 (5열 레이아웃, 카드 크기 UP) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {badges.map((badge, i) => (
          <motion.div
            key={badge.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => setSelectedBadge(badge)}
            className="group bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-col items-center gap-4 cursor-pointer hover:border-indigo-300 hover:-translate-y-1 transition-all"
          >
            <div className={`w-24 h-24 rounded-full flex items-center justify-center ${badge.color} transition-transform group-hover:scale-110 shadow-inner`}>
              {badge.icon}
            </div>
            <div className="text-center">
              <h3 className="text-lg font-black text-slate-800 break-keep leading-tight">{badge.name}</h3>
              <p className="text-sm font-bold text-indigo-500 mt-2">{badge.count}회</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 뱃지 상세 팝업 (내용/디자인 절대 유지) */}
      <AnimatePresence>
        {selectedBadge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* 뒷배경 블러 처리 */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              onClick={() => setSelectedBadge(null)} 
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
            />
            
            {/* 팝업 컨텐츠 */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 20 }} 
              className="relative bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl overflow-hidden"
            >
              <button 
                onClick={() => setSelectedBadge(null)} 
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center text-center mb-8">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center ${selectedBadge.color} mb-4 shadow-lg`}>
                  {selectedBadge.icon}
                </div>
                <h2 className="text-2xl font-black text-slate-900">{selectedBadge.name}</h2>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full mt-2">
                  누적 {selectedBadge.count}회 획득
                </span>
              </div>

              {/* 히스토리 리스트 */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left mb-2">수여 히스토리</p>
                {selectedBadge.history.length > 0 ? (
                  selectedBadge.history.map((h, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex flex-col text-left">
                        <span className="text-sm font-bold text-slate-800 leading-tight">{h.title}</span>
                        <div className="flex items-center gap-1 text-slate-400 text-[10px] mt-1 font-medium">
                          <Calendar className="w-3 h-3" />
                          {h.date}
                        </div>
                      </div>
                      <Award className="w-4 h-4 text-amber-400 shrink-0" />
                    </div>
                  ))
                ) : (
                  <div className="py-10 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <p className="text-slate-400 text-sm font-bold text-center">아직 획득한 기록이 없습니다.</p>
                  </div>
                )}
              </div>

              <button 
                onClick={() => setSelectedBadge(null)}
                className="w-full mt-8 py-4 bg-slate-900 text-white rounded-[1.5rem] font-black text-sm hover:bg-indigo-600 transition-all shadow-lg active:scale-95"
              >
                확인
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
};