import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, Medal, TrendingUp, Calendar, Search } from 'lucide-react';
import { MOCK_RANKINGS } from '../types';

export const RankingsPage = () => {
  const [period, setPeriod] = useState<'7d' | '30d' | 'all'>('all');

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">글로벌 랭킹</h1>
          <p className="text-slate-500">해커톤 참여와 성과를 바탕으로 산정된 개발자 순위입니다.</p>
        </div>

        <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          {[
            { id: '7d', label: '최근 7일' },
            { id: '30d', label: '최근 30일' },
            { id: 'all', label: '전체' },
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id as any)}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                period === p.id 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium Mock */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-8">
        {/* 2nd */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-4 order-2 md:order-1 h-[280px] flex flex-col justify-center"
        >
          <div className="relative inline-block">
            <div className="w-20 h-20 bg-slate-100 rounded-full mx-auto flex items-center justify-center border-4 border-slate-200">
              <Medal className="w-10 h-10 text-slate-400" />
            </div>
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-200 text-slate-600 text-xs font-black px-3 py-1 rounded-full">2nd</span>
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900">{MOCK_RANKINGS[1].nickname}</h3>
            <p className="text-indigo-600 font-mono font-bold">{MOCK_RANKINGS[1].points.toLocaleString()} pts</p>
          </div>
        </motion.div>

        {/* 1st */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-indigo-600 rounded-3xl p-8 text-center space-y-4 order-1 md:order-2 h-[320px] flex flex-col justify-center shadow-xl shadow-indigo-200"
        >
          <div className="relative inline-block">
            <div className="w-24 h-24 bg-indigo-500 rounded-full mx-auto flex items-center justify-center border-4 border-indigo-400">
              <Trophy className="w-12 h-12 text-amber-300" />
            </div>
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-xs font-black px-3 py-1 rounded-full">1st</span>
          </div>
          <div className="text-white">
            <h3 className="font-black text-2xl">{MOCK_RANKINGS[0].nickname}</h3>
            <p className="text-indigo-100 font-mono font-bold text-lg">{MOCK_RANKINGS[0].points.toLocaleString()} pts</p>
          </div>
        </motion.div>

        {/* 3rd */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-4 order-3 h-[240px] flex flex-col justify-center"
        >
          <div className="relative inline-block">
            <div className="w-16 h-16 bg-orange-50 rounded-full mx-auto flex items-center justify-center border-4 border-orange-100">
              <Medal className="w-8 h-8 text-orange-400" />
            </div>
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-orange-100 text-orange-600 text-xs font-black px-3 py-1 rounded-full">3rd</span>
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900">{MOCK_RANKINGS[2].nickname}</h3>
            <p className="text-indigo-600 font-mono font-bold">{MOCK_RANKINGS[2].points.toLocaleString()} pts</p>
          </div>
        </motion.div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">순위</th>
              <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">사용자</th>
              <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">포인트</th>
              <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">최근 활동</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {MOCK_RANKINGS.map((user, i) => (
              <tr key={user.nickname} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-5">
                  <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                    user.rank === 1 ? 'bg-amber-100 text-amber-700' :
                    user.rank === 2 ? 'bg-slate-100 text-slate-700' :
                    user.rank === 3 ? 'bg-orange-100 text-orange-700' :
                    'text-slate-400'
                  }`}>
                    {user.rank}
                  </span>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-slate-900">{user.nickname}</span>
                  </div>
                </td>
                <td className="px-8 py-5 text-right font-mono font-bold text-indigo-600">
                  {user.points.toLocaleString()}
                </td>
                <td className="px-8 py-5 text-center text-slate-400 text-xs">
                  {new Date(user.lastActive).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
