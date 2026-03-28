import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Code2, 
  ChevronLeft, 
  Calendar, 
  Trophy, 
  X, 
  Search, 
  PlusCircle,
  CheckCircle2,
  Heart,
  Lightbulb,
  Zap,
  Cpu,
  MessagesSquare
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const MyHackathonAll = () => {
  const navigate = useNavigate();
  
  const [hackathons, setHackathons] = useState([
    { id: 1, title: '2026 글로벌 AI 챌린지', status: '진행 중', date: '2026.03.15 - 03.25', role: 'Frontend', team: 'AI 파이오니어', isEvaluated: false },
    { id: 2, title: 'K-디지털 해커톤', status: '종료', date: '2026.01.10 - 01.20', role: 'Fullstack', team: '데브옵스 빌더스', isEvaluated: true },
    { id: 3, title: '제 4회 스마트 시티 투게더', status: '종료', date: '2025.11.05 - 11.07', role: 'Frontend', team: '도시락팀', isEvaluated: false },
    { id: 4, title: '유니버시티 연합 해커톤', status: '종료', date: '2025.08.20 - 08.22', role: 'UI/UX Design', team: '디자인씽킹', isEvaluated: false },
    { id: 5, title: '구름톤 in Jeju 12기', status: '종료', date: '2025.05.15 - 05.18', role: 'Backend', team: '제주바람', isEvaluated: false },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHackathonId, setSelectedHackathonId] = useState<number | null>(null);
  
  const badgeList = [
    { name: '친절', icon: <Heart className="w-6 h-6" /> },
    { name: '아이디어뱅크', icon: <Lightbulb className="w-6 h-6" /> },
    { name: '성실왕', icon: <Zap className="w-6 h-6" /> },
    { name: '코딩천재', icon: <Cpu className="w-6 h-6" /> },
    { name: '의사소통 마스터', icon: <MessagesSquare className="w-6 h-6" /> },
  ];

  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: '김코딩', role: 'Frontend', selectedBadges: [] as string[] },
    { id: 2, name: '이디자인', role: 'UI/UX', selectedBadges: [] as string[] },
    { id: 3, name: '박서버', role: 'Backend', selectedBadges: [] as string[] },
  ]);

  const toggleBadge = (memberId: number, badgeName: string) => {
    setTeamMembers(prev => prev.map(m => {
      if (m.id === memberId) {
        const isExist = m.selectedBadges.includes(badgeName);
        return {
          ...m,
          selectedBadges: isExist 
            ? m.selectedBadges.filter(b => b !== badgeName) 
            : [...m.selectedBadges, badgeName]
        };
      }
      return m;
    }));
  };

  const handleAllSubmit = () => {
    if (selectedHackathonId) {
      setHackathons(prev => prev.map(h => 
        h.id === selectedHackathonId ? { ...h, isEvaluated: true } : h
      ));
    }
    alert("팀원 평가가 성공적으로 제출되었습니다!");
    setIsModalOpen(false);
    setTeamMembers(prev => prev.map(m => ({ ...m, selectedBadges: [] })));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 px-4">
      {/* 상단 헤더 */}
      <div className="flex items-center justify-between pt-10 text-left">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-200 rounded-full transition-all group">
            <ChevronLeft className="w-6 h-6 text-slate-600 group-hover:text-indigo-600" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <Code2 className="w-7 h-7 text-indigo-600" />
              참가한 해커톤
            </h1>
            <p className="text-sm text-slate-500 font-medium mt-1">참여 기록과 팀원 평가를 관리하세요.</p>
          </div>
        </div>
      </div>

      {/* 해커톤 리스트 */}
      <div className="grid grid-cols-1 gap-5">
        {hackathons.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-200 shadow-sm"
          >
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6 text-indigo-300">
              <Search className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-2">참여한 해커톤이 없습니다.</h3>
            <button 
              onClick={() => navigate('/hackathons')}
              className="group flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
            >
              <PlusCircle className="w-5 h-5 transition-transform group-hover:rotate-90" />
              해커톤 목록으로 가기
            </button>
          </motion.div>
        ) : (
          hackathons.map((h, index) => (
            <motion.div
              key={h.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="group bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex-1 space-y-3 text-left">
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] px-2.5 py-1 rounded-lg font-black uppercase tracking-tight ${
                      h.status === '진행 중' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {h.status}
                    </span>
                    <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                      {h.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-500 font-medium">
                    <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{h.date}</span>
                    <span className="flex items-center gap-1.5"><Trophy className="w-4 h-4 text-amber-500" />{h.team}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {h.status === '종료' && (
                    <button 
                      disabled={h.isEvaluated}
                      onClick={() => { setSelectedHackathonId(h.id); setIsModalOpen(true); }}
                      className={`px-5 py-3.5 rounded-2xl text-sm font-bold transition-all border ${
                        h.isEvaluated 
                          ? 'bg-slate-50 text-slate-400 border-slate-200 cursor-default' 
                          : 'bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-600 hover:text-white'
                      }`}
                    >
                      {h.isEvaluated ? '팀원 평가완료' : '팀원 평가하기'}
                    </button>
                  )}
                  <button className="px-6 py-3.5 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200">
                    상세보기
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* 평가 모달 (스크롤바 수정 버전) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              onClick={() => setIsModalOpen(false)} 
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
            />
            
            {/* 🔥 수정 포인트 1: 모달 외곽 테두리 (overflow: hidden 적용) */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} 
              className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100"
            >
              {/* 🔥 수정 포인트 2: 스크롤이 발생하는 내부 영역 */}
              {/* max-h 설정 및 pr-4(우측 여백)를 줘서 스크롤바가 안쪽으로 들여보이게 함 */}
              <div className="max-h-[85vh] overflow-y-auto p-10 pr-6 custom-scrollbar text-left">
                
                <button onClick={() => setIsModalOpen(false)} className="absolute top-10 right-10 text-slate-400 hover:text-slate-600 transition-colors">
                  <X className="w-6 h-6" />
                </button>
                
                <h2 className="text-2xl font-black text-slate-900 mb-2">팀원 뱃지 수여</h2>
                
                <div className="bg-indigo-50 p-4 rounded-2xl mb-10 border border-indigo-100 space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                    <p className="text-xs font-black text-indigo-700">뱃지 전달 안내</p>
                  </div>
                  <p className="text-[11px] text-indigo-700 leading-relaxed font-medium">
                    팀원의 강점에 맞는 뱃지를 선택해 주세요. <br />
                    전달된 뱃지는 상대방의 프로필에 명예롭게 표시됩니다!
                  </p>
                </div>

                <div className="space-y-16 mb-12">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="space-y-6">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div>
                          <p className="font-bold text-slate-800 text-xl">{member.name}</p>
                          <p className="text-[11px] text-slate-400 uppercase font-black tracking-widest">{member.role}</p>
                        </div>
                        <div className="px-3 py-1 bg-indigo-50 rounded-full border border-indigo-100">
                          <p className="text-[10px] font-black text-indigo-600">선택됨 {member.selectedBadges.length}</p>
                        </div>
                      </div>
                      
                      {/* 뱃지 선택 리스트 */}
                      <div className="grid grid-cols-5 gap-2 pr-1">
                        {badgeList.map((badge) => {
                          const isSelected = member.selectedBadges.includes(badge.name);
                          return (
                            <button
                              key={badge.name}
                              onClick={() => toggleBadge(member.id, badge.name)}
                              className="flex flex-col items-center gap-3 group transition-all"
                            >
                              <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                                isSelected 
                                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 scale-110' 
                                  : 'bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-400'
                              }`}>
                                {badge.icon}
                              </div>
                              <span className={`text-[10px] font-black text-center leading-tight transition-colors ${
                                isSelected ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                              }`}>
                                {badge.name}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={handleAllSubmit} 
                  className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95"
                >
                  뱃지 수여 완료하기
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🔥 수정 포인트 3: 스크롤바 디자인 변경을 위한 전역 스타일 */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px; /* 스크롤바 너비 */
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9; /* 스크롤바 트랙 배경색 (slate-100) */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1; /* 스크롤바 색상 (slate-300) */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6366f1; /* 호버 시 색상 (indigo-500) */
        }
      `}</style>
    </div>
  );
};