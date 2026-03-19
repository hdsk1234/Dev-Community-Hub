import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Users, Search, Plus, ExternalLink, Filter, 
  Sparkles, CheckCircle
} from 'lucide-react';
import { MOCK_TEAMS, MOCK_HACKATHONS } from '../types';

type AiRecommendation = {
  teamIds: string[];
  reasons?: Record<string, string>;
};

export const CampPage = () => {
  const [searchParams] = useSearchParams();
  const hackathonFilter = searchParams.get('hackathon');
  const [showForm, setShowForm] = useState(false);
  
  // AI 추천 입력값 상태 관리
  const [aiQuery, setAiQuery] = useState("");
  const [isAISearching, setIsAISearching] = useState(false);
  const [aiRec, setAiRec] = useState<AiRecommendation | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const filteredTeams = MOCK_TEAMS.filter(t => 
    !hackathonFilter || t.hackathonSlug === hackathonFilter
  );

  const selectedHackathon = MOCK_HACKATHONS.find(h => h.slug === hackathonFilter);

  const resetAISearch = () => {
    setAiQuery("");
    setAiRec(null);
    setAiError(null);
    setIsAISearching(false);
  };

  const safeParseJsonFromText = (text: string) => {
    const trimmed = text.trim();
    try {
      return JSON.parse(trimmed);
    } catch {
      const objMatch = trimmed.match(/\{[\s\S]*\}/);
      if (objMatch) {
        try { return JSON.parse(objMatch[0]); } catch { /* ignore */ }
      }
      const arrMatch = trimmed.match(/\[[\s\S]*\]/);
      if (arrMatch) {
        try { return JSON.parse(arrMatch[0]); } catch { /* ignore */ }
      }
      return null;
    }
  };

  const handleAISearch = async () => {
    if (!aiQuery.trim()) {
      alert("찾으시는 팀의 조건을 입력해주세요!");
      return;
    }

    setAiError(null);
    setAiRec(null);
    setIsAISearching(true);

    try {
      const teamsForPrompt = filteredTeams.map(t => ({
        id: t.id,
        name: t.name,
        intro: t.intro,
        positions: t.positions,
        isOpen: t.isOpen,
        hackathonSlug: t.hackathonSlug ?? null,
      }));

      const res = await fetch("/api/ai/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: aiQuery,
          teams: teamsForPrompt,
        }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`AI 추천 API 오류 (${res.status}). ${text}`);
      }

      const data = await res.json();
      const parsed = data?.parsed ?? null;
      const teamIds: unknown = parsed?.teamIds;
      const reasons: unknown = parsed?.reasons;

      if (!Array.isArray(teamIds) || teamIds.length === 0) {
        throw new Error("추천 결과를 파싱하지 못했어요. (teamIds 없음)");
      }

      const teamIdSet = new Set(filteredTeams.map(t => t.id));
      const cleanedIds = teamIds
        .map(String)
        .filter(id => teamIdSet.has(id))
        .slice(0, 8);

      if (cleanedIds.length === 0) {
        setAiError("조건에 맞는 팀을 찾지 못했어요. 조건을 더 넓혀서 다시 시도해보세요.");
        return;
      }

      setAiRec({
        teamIds: cleanedIds,
        reasons: (reasons && typeof reasons === "object") ? (reasons as Record<string, string>) : undefined,
      });
    } catch (e: any) {
      setAiError(e?.message ?? "AI 추천 중 오류가 발생했어요.");
    } finally {
      setIsAISearching(false);
    }
  };

  const teamsToShow = (() => {
    if (!aiRec) return filteredTeams;
    const byId = new Map(filteredTeams.map(t => [t.id, t]));
    return aiRec.teamIds.map(id => byId.get(id)).filter(Boolean);
  })();

  return (
    <div className="space-y-8">
      {/* Header Section */}
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
        {/* Sidebar Filters & AI Section */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* 1. AI 맞춤 추천 섹션 */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-2xl text-white shadow-xl shadow-indigo-200 relative overflow-hidden group"
          >
            {/* 배경 데코레이션 */}
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all" />
            
            <div className="relative z-10 space-y-4">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-white/20 rounded-lg">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-bold text-lg">AI 맞춤 추천</h3>
              </div>
              
              <div className="space-y-3">
                <p className="text-sm font-medium text-indigo-50">
                  어떤 조건의 팀을 찾으시나요?
                </p>
                <div className="relative">
                  <input 
                    type="text"
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    placeholder="예: 보안에 강한 프론트엔드 팀"
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-sm text-white placeholder:text-indigo-200 outline-none focus:ring-2 focus:ring-white/50 transition-all shadow-inner disabled:opacity-70"
                    disabled={isAISearching}
                  />
                </div>
                <button 
                  onClick={handleAISearch}
                  className="w-full py-3 bg-white text-indigo-600 rounded-xl text-sm font-extrabold hover:bg-indigo-50 transition-all shadow-md active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={isAISearching}
                >
                  찾기
                </button>
                {aiError && (
                  <div className="text-xs font-medium text-rose-100 bg-rose-500/20 border border-rose-200/30 rounded-xl p-3">
                    {aiError}
                  </div>
                )}
                {aiRec && !aiError && (
                  <div className="text-xs font-medium text-indigo-100 bg-white/10 border border-white/20 rounded-xl p-3">
                    AI가 조건에 맞는 팀을 추천했어요. (총 {aiRec.teamIds.length}개)
                  </div>
                )}
                {/* --- 추가된 초기화 버튼 --- */}
                {aiQuery && ( // 입력값이 있을 때만 보이도록 설정 (선택 사항)
                  <button 
                    onClick={resetAISearch}
                    className="w-full py-2 text-xs font-medium text-indigo-200 hover:text-white transition-colors flex items-center justify-center space-x-1 disabled:opacity-70 disabled:cursor-not-allowed"
                    disabled={isAISearching}
                  >
                    <span>조건 초기화</span>
                  </button>
                )}
              </div>
              
            </div>
          </motion.div>

          {/* 2. Basic Filters */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold flex items-center"><Filter className="w-4 h-4 mr-2" /> 필터</h3>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase">해커톤 연결</label>
              <select 
                className="w-full p-2 bg-slate-50 border border-slate-100 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                value={hackathonFilter || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  window.history.pushState({}, '', val ? `/camp?hackathon=${val}` : '/camp');
                  window.location.reload();
                }}
              >
                <option value="">전체보기</option>
                {MOCK_HACKATHONS.map(h => (
                  <option key={h.slug} value={h.slug}>{h.title}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 3. Team Building Tips */}
          <div className="bg-indigo-900 p-6 rounded-2xl text-white space-y-4 shadow-lg">
            <h3 className="font-bold flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-indigo-400" /> 팀 빌딩 팁</h3>
            <p className="text-sm text-indigo-200 leading-relaxed">
              명확한 목표와 필요한 포지션을 기재하면 더 적합한 팀원을 만날 확률이 높아집니다!
            </p>
          </div>
        </div>

        {/* Team List Section */}
        <div className="lg:col-span-2 space-y-4">
          {teamsToShow.length > 0 ? (
            teamsToShow.map((team: any, i: number) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all group shadow-sm"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{team.name}</h3>
                      {aiRec?.teamIds?.includes(team.id) && (
                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-extrabold rounded uppercase">
                          AI 추천
                        </span>
                      )}
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
                    {aiRec?.reasons?.[team.id] && (
                      <p className="text-xs text-slate-500">
                        {aiRec.reasons[team.id]}
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
            ))
          ) : (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center space-y-4">
              <div className="inline-flex p-4 bg-white rounded-2xl shadow-sm text-slate-300">
                <Search className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">검색 결과가 없습니다</h3>
                <p className="text-slate-500 text-sm">필터를 변경하거나 새로운 모집글을 올려보세요!</p>
              </div>
            </div>
          )}
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

      {/* AI Searching Popup */}
      {isAISearching && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div
            initial={{ y: 10, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            className="w-full max-w-sm bg-white rounded-2xl border border-slate-200 shadow-2xl p-6"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                <div className="w-5 h-5 rounded-full border-2 border-indigo-200 border-t-indigo-600 animate-spin" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-extrabold text-slate-900">찾는 중…</p>
                <p className="text-xs text-slate-500">
                  입력하신 조건에 맞는 팀을 분석하고 있어요.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};