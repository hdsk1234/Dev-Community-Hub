import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Info, Award, Calendar, Trophy, Users, Send, BarChart3, 
  CheckCircle2, XCircle, UserPlus, AlertTriangle, FileUp, ClipboardList
} from 'lucide-react';
import { MOCK_HACKATHONS, MOCK_TEAMS } from '../types';

type TabType = 'overview' | 'eval' | 'schedule' | 'prize' | 'teams' | 'submit' | 'leaderboard';

export const HackathonDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [showTeamPopup, setShowTeamPopup] = useState(false);

  const hackathon = MOCK_HACKATHONS.find(h => h.slug === slug);
  const teams = MOCK_TEAMS.filter(t => t.hackathonSlug === slug);

  if (!hackathon) return <div className="text-center py-20">해커톤을 찾을 수 없습니다.</div>;

  const tabs: { id: TabType; label: string; icon: any }[] = [
    { id: 'overview', label: '개요', icon: Info },
    { id: 'eval', label: '평가', icon: Award },
    { id: 'schedule', label: '일정', icon: Calendar },
    { id: 'prize', label: '상금', icon: Trophy },
    { id: 'teams', label: '팀', icon: Users },
    { id: 'submit', label: '제출', icon: Send },
    { id: 'leaderboard', label: '리더보드', icon: BarChart3 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
              hackathon.status === 'ongoing' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
            }`}>
              {hackathon.status === 'ongoing' ? '진행중' : '종료'}
            </span>
            <h1 className="text-4xl font-black text-slate-900">{hackathon.title}</h1>
            <div className="flex flex-wrap gap-4 text-slate-500">
              <div className="flex items-center"><Calendar className="w-4 h-4 mr-2" /> {hackathon.startDate} ~ {hackathon.endDate}</div>
              <div className="flex items-center"><Users className="w-4 h-4 mr-2" /> {hackathon.participants.toLocaleString()}명 참여</div>
            </div>
          </div>
          <button className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
            참가 신청하기
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto pb-2 gap-2 no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id 
                ? 'bg-slate-900 text-white shadow-md' 
                : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 min-h-[400px]">
        {activeTab === 'overview' && (
          <div className="prose prose-slate max-w-none">
            <h3 className="text-xl font-bold mb-4">해커톤 안내</h3>
            <p className="text-slate-600 leading-relaxed">{hackathon.description}</p>
            <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <h4 className="font-bold mb-2 flex items-center"><ClipboardList className="w-4 h-4 mr-2" /> 유의사항</h4>
              <ul className="text-sm text-slate-500 space-y-2 list-disc pl-5">
                <li>팀 구성은 최대 5명까지 가능합니다.</li>
                <li>타인의 코드를 무단 도용할 경우 실격 처리됩니다.</li>
                <li>제출 기한 엄수 부탁드립니다.</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'eval' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold">평가 기준</h3>
            <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100 text-indigo-900">
              {hackathon.evaluation}
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold">주요 일정</h3>
            <div className="space-y-4">
              {hackathon.schedule.map((s, i) => (
                <div key={i} className="flex items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="w-24 font-mono font-bold text-indigo-600">{s.time}</div>
                  <div className="font-medium text-slate-800">{s.event}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'prize' && (
          <div className="text-center py-12 space-y-4">
            <div className="inline-flex p-4 bg-amber-100 rounded-full">
              <Trophy className="w-12 h-12 text-amber-600" />
            </div>
            <h3 className="text-3xl font-black text-slate-900">{hackathon.prize}</h3>
            <p className="text-slate-500">우승팀에게는 상금과 함께 채용 연계 기회가 제공됩니다.</p>
          </div>
        )}

        {activeTab === 'teams' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">참여 팀 ({teams.length})</h3>
              <button 
                onClick={() => setShowTeamPopup(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-all"
              >
                <UserPlus className="w-4 h-4" />
                <span>이 해커톤 팀 구성</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teams.map(team => (
                <div key={team.id} className="p-6 border border-slate-200 rounded-2xl hover:border-indigo-200 transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-lg group-hover:text-indigo-600 transition-colors">{team.name}</h4>
                      <p className="text-sm text-slate-500 line-clamp-1">{team.intro}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      team.isOpen ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {team.isOpen ? '모집중' : '모집완료'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {team.positions.map(p => (
                      <span key={p} className="px-2 py-1 bg-slate-50 text-slate-600 text-[11px] rounded-md border border-slate-100">{p}</span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-100">초대</button>
                    <button className="flex-1 py-2 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-100">수락</button>
                    <button className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100">거절</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'submit' && (
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
              <h4 className="font-bold text-blue-900 mb-2 flex items-center"><Info className="w-4 h-4 mr-2" /> 제출 가이드</h4>
              <p className="text-sm text-blue-800/80 leading-relaxed">
                결과물은 ZIP 파일(코드) 또는 PDF(기획서) 형식으로 제출해주세요. 
                메모 섹션에는 프로젝트에 대한 간단한 설명과 실행 방법을 적어주시기 바랍니다.
              </p>
            </div>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">메모</label>
                <textarea 
                  className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none min-h-[150px]"
                  placeholder="프로젝트 요약 및 실행 방법을 입력하세요..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">파일 첨부 (ZIP, PDF, CSV)</label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-indigo-400 transition-colors cursor-pointer group">
                  <FileUp className="w-8 h-8 text-slate-300 mx-auto mb-2 group-hover:text-indigo-500" />
                  <p className="text-sm text-slate-500">파일을 드래그하거나 클릭하여 선택하세요</p>
                </div>
              </div>
              <button className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
                최종 제출하기
              </button>
            </form>
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold">실시간 리더보드</h3>
            <div className="overflow-hidden border border-slate-100 rounded-2xl">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">순위</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">팀명</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">점수</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">상태</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {[
                    { rank: 1, name: 'AI 어벤져스', score: 98, submitted: true },
                    { rank: 2, name: '데이터 마법사', score: 92, submitted: true },
                    { rank: '-', name: '초보 빌더', score: 0, submitted: false },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900">{row.rank}</td>
                      <td className="px-6 py-4 font-medium text-slate-700">{row.name}</td>
                      <td className="px-6 py-4 text-right font-mono text-indigo-600 font-bold">{row.score}</td>
                      <td className="px-6 py-4 text-center">
                        {row.submitted ? (
                          <span className="inline-flex items-center text-emerald-600 text-xs font-bold">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> 제출완료
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-slate-400 text-xs font-bold">
                            <XCircle className="w-3 h-3 mr-1" /> 미제출
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Popup Mock */}
      {showTeamPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6"
          >
            <div className="flex items-center text-amber-600 space-x-2">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-xl font-bold">팀 구성 유의사항</h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              한 번 팀에 소속되면 해커톤 종료 시까지 팀 변경이 제한될 수 있습니다. 
              정말로 이 해커톤을 위한 팀을 구성하시겠습니까?
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowTeamPopup(false)}
                className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200"
              >
                취소
              </button>
              <button 
                onClick={() => setShowTeamPopup(false)}
                className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100"
              >
                확인 및 생성
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
