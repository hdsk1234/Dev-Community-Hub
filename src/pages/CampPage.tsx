import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Users, Search, Plus, ExternalLink, Filter, 
  MessageSquare, UserCircle, CheckCircle
} from 'lucide-react';
import { MOCK_TEAMS, MOCK_HACKATHONS } from '../types';

export const CampPage = () => {
  const [searchParams] = useSearchParams();
  const hackathonFilter = searchParams.get('hackathon');
  const [showForm, setShowForm] = useState(false);

  const filteredTeams = MOCK_TEAMS.filter(t => 
    !hackathonFilter || t.hackathonSlug === hackathonFilter
  );

  const selectedHackathon = MOCK_HACKATHONS.find(h => h.slug === hackathonFilter);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">팀원 모집 (Camp)</h1>
          <p className="text-slate-500">
            {selectedHackathon 
              ? `[${selectedHackathon.title}] 해커톤을 위한 팀원들을 찾아보세요.` 
              : '함께 프로젝트를 진행할 동료를 찾아보세요.'}
          </p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>모집글 올리기</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold flex items-center"><Filter className="w-4 h-4 mr-2" /> 필터</h3>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase">해커톤 연결</label>
              <select 
                className="w-full p-2 bg-slate-50 border border-slate-100 rounded-lg text-sm outline-none"
                value={hackathonFilter || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  window.history.pushState({}, '', val ? `/camp?hackathon=${val}` : '/camp');
                  window.location.reload(); // Simple reload for search params update in this mock
                }}
              >
                <option value="">전체보기</option>
                {MOCK_HACKATHONS.map(h => (
                  <option key={h.slug} value={h.slug}>{h.title}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-indigo-900 p-6 rounded-2xl text-white space-y-4">
            <h3 className="font-bold">팀 빌딩 팁</h3>
            <p className="text-sm text-indigo-200 leading-relaxed">
              명확한 목표와 필요한 포지션을 기재하면 더 적합한 팀원을 만날 확률이 높아집니다!
            </p>
          </div>
        </div>

        {/* Team List */}
        <div className="lg:col-span-2 space-y-4">
          {filteredTeams.map((team, i) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{team.name}</h3>
                    {team.isOpen ? (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase">모집중</span>
                    ) : (
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded uppercase">마감</span>
                    )}
                  </div>
                  {team.hackathonSlug && (
                    <p className="text-xs text-indigo-500 font-bold">
                      #{MOCK_HACKATHONS.find(h => h.slug === team.hackathonSlug)?.title}
                    </p>
                  )}
                </div>
                <a 
                  href={team.contactLink} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-2 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
              
              <p className="text-slate-600 text-sm mb-6 leading-relaxed">{team.intro}</p>
              
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-50">
                <div className="flex flex-wrap gap-2">
                  {team.positions.map(pos => (
                    <span key={pos} className="px-3 py-1 bg-slate-50 text-slate-500 text-xs font-medium rounded-full border border-slate-100">
                      {pos}
                    </span>
                  ))}
                </div>
                <div className="flex items-center text-slate-400 text-xs">
                  <Users className="w-4 h-4 mr-1" />
                  <span>{team.members.length}명 참여 중</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Create Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-3xl p-8 max-w-xl w-full shadow-2xl my-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-slate-900">팀 모집글 생성</h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>

            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setShowForm(false); }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">팀명</label>
                  <input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" placeholder="멋진 팀 이름을 지어주세요" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">연결 해커톤 (선택)</label>
                  <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="">없음</option>
                    {MOCK_HACKATHONS.map(h => <option key={h.slug} value={h.slug}>{h.title}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">팀 소개</label>
                <textarea className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]" placeholder="팀의 목표와 분위기를 설명해주세요" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">모집 포지션 (쉼표로 구분)</label>
                <input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" placeholder="예: 프론트엔드, 디자이너, 기획자" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">연락 링크</label>
                <input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" placeholder="오픈카톡, 구글폼 등" />
              </div>

              <div className="flex items-center space-x-2">
                <input type="checkbox" id="isOpen" defaultChecked className="w-4 h-4 text-indigo-600 rounded" />
                <label htmlFor="isOpen" className="text-sm font-medium text-slate-700">현재 팀원 모집 중</label>
              </div>

              <button className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
                모집 시작하기
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
