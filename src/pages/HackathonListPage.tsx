import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, Users, Tag, ChevronRight, Filter } from 'lucide-react';
import { MOCK_HACKATHONS, Hackathon } from '../types';

export const HackathonListPage = () => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'ongoing' | 'ended'>('all');
  const [tagFilter, setTagFilter] = useState<string>('all');

  const allTags = Array.from(new Set(MOCK_HACKATHONS.flatMap(h => h.tags)));

  const filteredHackathons = MOCK_HACKATHONS.filter(h => {
    const statusMatch = statusFilter === 'all' || h.status === statusFilter;
    const tagMatch = tagFilter === 'all' || h.tags.includes(tagFilter);
    return statusMatch && tagMatch;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">해커톤 목록</h1>
          <p className="text-slate-500">현재 진행 중이거나 종료된 해커톤을 확인하세요.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-sm">
            <Filter className="w-4 h-4 text-slate-400 mr-2" />
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="text-sm font-medium bg-transparent border-none focus:ring-0 cursor-pointer"
            >
              <option value="all">모든 상태</option>
              <option value="ongoing">진행중</option>
              <option value="ended">종료</option>
            </select>
          </div>

          <div className="flex items-center bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-sm">
            <Tag className="w-4 h-4 text-slate-400 mr-2" />
            <select 
              value={tagFilter} 
              onChange={(e) => setTagFilter(e.target.value)}
              className="text-sm font-medium bg-transparent border-none focus:ring-0 cursor-pointer"
            >
              <option value="all">모든 태그</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredHackathons.map((h, i) => (
          <motion.div
            key={h.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link 
              to={`/hackathons/${h.slug}`}
              className="group block bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-indigo-300 hover:shadow-lg transition-all"
            >
              {h.posterUrl && (
                <div className="aspect-video w-full overflow-hidden bg-slate-100">
                  <img 
                    src={h.posterUrl} 
                    alt={h.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                        h.status === 'ongoing' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {h.status === 'ongoing' ? '진행중' : '종료'}
                      </span>
                      <div className="flex gap-1">
                        {h.tags.map(tag => (
                          <span key={tag} className="text-xs text-slate-400 font-medium">#{tag}</span>
                        ))}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {h.title}
                    </h3>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                  <div className="flex items-center text-slate-500 text-sm">
                    <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                    <span>{h.startDate} ~ {h.endDate}</span>
                  </div>
                  <div className="flex items-center text-slate-500 text-sm justify-end">
                    <Users className="w-4 h-4 mr-2 text-slate-400" />
                    <span>{h.participants.toLocaleString()}명 참가</span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {filteredHackathons.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
          <p className="text-slate-400">조건에 맞는 해커톤이 없습니다.</p>
        </div>
      )}
    </div>
  );
};
