import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, UserCircle, LogOut } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { PeerReviewModal } from './PeerReviewModal'; 
import { useAuth } from './AuthContext';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import toast from 'react-hot-toast';

export const Navbar = () => {
  const [showNoti, setShowNoti] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  
  // 🔥 B개발자의 Auth 상태 및 라우팅 훅 가져오기
  const { user } = useAuth();
  const navigate = useNavigate();

  // 🔥 로그아웃 로직 복구
  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('안전하게 로그아웃 되었습니다.');
      navigate('/');
    } catch (error) {
      toast.error('로그아웃 중 문제가 발생했습니다.');
    }
  };

  const dummyNoti = {
    id: 1, title: "🎉 해커톤 종료 안내", message: "참여하신 [그린테크 챌린지]가 종료되었습니다. 팀원 동료 평가를 진행해주세요!", time: "방금 전", isRead: false
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-black text-slate-900 tracking-tight">
            DevHub<span className="text-indigo-600">.</span>
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link to="/hackathons" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">해커톤</Link>
            <Link to="/camp" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">캠프</Link>
            <Link to="/rankings" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">랭킹</Link>
            
            {/* 세로 구분선 */}
            <div className="w-px h-4 bg-slate-200 mx-2 hidden sm:block"></div>

            {/* 🔥 로그인 상태에 따른 조건부 렌더링 */}
            {user ? (
              <div className="flex items-center space-x-4">
                {/* 1. 알림 벨 */}
                <div className="relative">
                  <button onClick={() => setShowNoti(!showNoti)} className="relative p-2 text-slate-500 hover:text-indigo-600 transition-colors">
                    <Bell className="w-5 h-5" />
                    {!dummyNoti.isRead && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>}
                  </button>

                  <AnimatePresence>
                    {showNoti && (
                      <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                        <div className="p-4 border-b border-slate-100 bg-slate-50">
                          <h4 className="font-bold text-slate-800">새로운 알림</h4>
                        </div>
                        <div className="divide-y divide-slate-100">
                          <button onClick={() => { setShowNoti(false); setShowReviewModal(true); }} className="w-full text-left p-4 hover:bg-slate-50 transition-colors group">
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">{dummyNoti.title}</span>
                              <span className="text-[10px] text-slate-400 font-medium">{dummyNoti.time}</span>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">{dummyNoti.message}</p>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* 2. 마이페이지 */}
                <Link to="/mypage" className="p-2 text-slate-500 hover:text-indigo-600 transition-colors">
                  <UserCircle className="w-5 h-5" />
                </Link>

                {/* 3. 로그아웃 */}
                <button onClick={handleLogout} className="p-2 text-slate-500 hover:text-rose-500 transition-colors" title="로그아웃">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              /* 로그아웃 상태일 때 보이는 버튼들 */
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">
                  로그인
                </Link>
                <Link to="/signup" className="px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-indigo-600 transition-all shadow-md">
                  시작하기
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* 동료 평가 모달 렌더링 */}
      <AnimatePresence>
        {showReviewModal && <PeerReviewModal onClose={() => setShowReviewModal(false)} />}
      </AnimatePresence>
    </>
  );
};