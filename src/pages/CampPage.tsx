import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Search, Plus, ExternalLink, Filter, 
  MessageSquare, UserCircle, CheckCircle, X,
  MessageCircle, FileText
} from 'lucide-react';
import { MOCK_HACKATHONS } from '../types';
import { db, auth } from '../firebase';
import { 
  collection, addDoc, onSnapshot, query, orderBy, 
  serverTimestamp, where, Timestamp 
} from 'firebase/firestore';
import { useAuth } from '../components/AuthContext';
import { ChatRoom } from '../components/ChatRoom';
import { toast } from 'react-hot-toast';

interface CampPost {
  id: string;
  authorUid: string;
  authorNickname: string;
  teamName: string;
  hackathonSlug?: string;
  intro: string;
  positions: string[];
  contactLink: string;
  isOpen: boolean;
  members: string[];
  createdAt: Timestamp;
}

export const CampPage = () => {
  const [searchParams] = useSearchParams();
  const hackathonFilter = searchParams.get('hackathon');
  const [showForm, setShowForm] = useState(false);
  const [posts, setPosts] = useState<CampPost[]>([]);
  const { user, userProfile } = useAuth();
  const [activeChat, setActiveChat] = useState<{ id: string; name: string } | null>(null);
  
  // Form states
  const [teamName, setTeamName] = useState('');
  const [hackathonSlug, setHackathonSlug] = useState(hackathonFilter || '');
  const [intro, setIntro] = useState('');
  const [positionsInput, setPositionsInput] = useState('');
  const [contactLink, setContactLink] = useState('');
  const [isOpen, setIsOpen] = useState(true); // 🔥 A개발자의 모집상태 제어 상태 복구
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const q = hackathonFilter 
      ? query(collection(db, 'camp_posts'), where('hackathonSlug', '==', hackathonFilter), orderBy('createdAt', 'desc'))
      : query(collection(db, 'camp_posts'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedPosts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CampPost[];
      setPosts(fetchedPosts);
    });

    return () => unsubscribe();
  }, [hackathonFilter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('로그인이 필요합니다.');
      return;
    }

    const isKakao = contactLink.includes('open.kakao.com');
    const isGoogle = contactLink.includes('forms.gle') || contactLink.includes('docs.google.com/forms');

    if (!isKakao && !isGoogle) {
      toast.error('연락 링크는 카카오톡 오픈채팅(open.kakao.com) 또는 구글폼(forms.gle / docs.google.com/forms)만 가능합니다.');
      return;
    }

    setSubmitting(true);
    try {
      let finalContactLink = contactLink.trim();
      if (finalContactLink && !/^https?:\/\//i.test(finalContactLink)) {
        finalContactLink = `https://${finalContactLink}`;
      }

      const positions = positionsInput.split(',').map(p => p.trim()).filter(p => p !== '');
      await addDoc(collection(db, 'camp_posts'), {
        authorUid: user.uid,
        authorNickname: userProfile?.nickname || user.displayName || '익명',
        teamName,
        hackathonSlug: hackathonSlug || null,
        intro,
        positions,
        contactLink: finalContactLink,
        isOpen, // 🔥 A개발자의 기획대로 DB에 반영되도록 수정
        members: [user.uid],
        createdAt: serverTimestamp(),
      });
      toast.success('모집글이 등록되었습니다!');
      setShowForm(false);
      setTeamName('');
      setIntro('');
      setPositionsInput('');
      setContactLink('');
      setIsOpen(true);
    } catch (error) {
      console.error('Error adding post:', error);
      toast.error('모집글 등록에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const getLinkInfo = (url: string) => {
    if (url.includes('open.kakao.com')) {
      return {
        icon: <MessageCircle className="w-5 h-5" />,
        label: '오픈채팅',
        color: 'text-amber-600 bg-amber-50 hover:bg-amber-100',
      };
    }
    if (url.includes('forms.gle') || url.includes('docs.google.com/forms')) {
      return {
        icon: <FileText className="w-5 h-5" />,
        label: '구글폼',
        color: 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100',
      };
    }
    return {
      icon: <ExternalLink className="w-5 h-5" />,
      label: '링크',
      color: 'text-slate-400 bg-slate-50 hover:bg-indigo-50',
    };
  };

  const selectedHackathon = MOCK_HACKATHONS.find(h => h.slug === hackathonFilter);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">팀원 모집 (Camp)</h1>
          <p className="text-slate-500">
            {selectedHackathon ? `[${selectedHackathon.title}] 해커톤 팀원을 찾아보세요.` : '함께할 동료를 찾아보세요.'}
          </p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg">
          <Plus className="w-5 h-5" />
          <span>모집글 올리기</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold flex items-center"><Filter className="w-4 h-4 mr-2" /> 필터</h3>
            <select 
              className="w-full p-2 bg-slate-50 border border-slate-100 rounded-lg text-sm outline-none"
              value={hackathonFilter || ''}
              onChange={(e) => {
                const val = e.target.value;
                window.history.pushState({}, '', val ? `/camp?hackathon=${val}` : '/camp');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
            >
              <option value="">전체보기</option>
              {MOCK_HACKATHONS.map(h => <option key={h.slug} value={h.slug}>{h.title}</option>)}
            </select>
          </div>

          {/* 🔥 A개발자의 팀 빌딩 팁 유지 */}
          <div className="bg-indigo-900 p-6 rounded-2xl text-white space-y-4">
            <h3 className="font-bold">팀 빌딩 팁</h3>
            <p className="text-sm text-indigo-200 leading-relaxed">
              명확한 목표와 필요한 포지션을 기재하면 더 적합한 팀원을 만날 확률이 높아집니다!
            </p>
          </div>
        </div>

        {/* Team List */}
        <div className="lg:col-span-2 space-y-4">
          {posts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
              <p className="text-slate-400 font-bold">등록된 모집글이 없습니다.</p>
            </div>
          ) : (
            posts.map((post, i) => (
              <motion.div key={post.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all shadow-sm group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{post.teamName}</h3>
                      {post.isOpen ? <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded">모집중</span> : <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded">마감</span>}
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-slate-400">
                      <span className="font-medium text-slate-600">{post.authorNickname}</span>
                      <span>•</span>
                      <span>{post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString() : '방금 전'}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {(() => {
                      const linkInfo = getLinkInfo(post.contactLink);
                      return (
                        <a href={post.contactLink} target="_blank" rel="noreferrer" className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl font-bold text-xs transition-colors ${linkInfo.color}`}>
                          {linkInfo.icon} <span>{linkInfo.label}</span>
                        </a>
                      );
                    })()}
                  </div>
                </div>
                <p className="text-slate-600 text-sm mb-6 leading-relaxed whitespace-pre-wrap">{post.intro}</p>
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-50">
                  <div className="flex flex-wrap gap-2">
                    {post.positions.map(pos => <span key={pos} className="px-3 py-1 bg-slate-50 text-slate-500 text-xs font-medium rounded-full border border-slate-100">{pos}</span>)}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center text-slate-400 text-xs"><Users className="w-4 h-4 mr-1" /><span>{post.members.length}명</span></div>
                    {user && (
                      <button onClick={() => setActiveChat({ id: post.id, name: post.teamName })} className="flex items-center space-x-1.5 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-colors">
                        <MessageSquare className="w-4 h-4" /> <span>팀 채팅</span>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      <AnimatePresence>
        {activeChat && <ChatRoom postId={activeChat.id} teamName={activeChat.name} onClose={() => setActiveChat(null)} />}
      </AnimatePresence>

      {/* Create Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white rounded-3xl p-8 max-w-xl w-full shadow-2xl my-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-slate-900">팀 모집글 생성</h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600"><X className="w-6 h-6" /></button>
            </div>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">팀명</label>
                  <input type="text" required value={teamName} onChange={(e) => setTeamName(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" placeholder="멋진 팀 이름을 지어주세요" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">연결 해커톤 (선택)</label>
                  <select value={hackathonSlug} onChange={(e) => setHackathonSlug(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="">없음</option>
                    {MOCK_HACKATHONS.map(h => <option key={h.slug} value={h.slug}>{h.title}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">팀 소개</label>
                <textarea required value={intro} onChange={(e) => setIntro(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl min-h-[100px] outline-none focus:ring-2 focus:ring-indigo-500" placeholder="팀의 목표와 분위기를 설명해주세요" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">모집 포지션 (쉼표 구분)</label>
                <input type="text" required value={positionsInput} onChange={(e) => setPositionsInput(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" placeholder="예: 프론트엔드, 디자이너, 기획자" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">연락 링크 (카톡/구글폼)</label>
                <input type="text" required value={contactLink} onChange={(e) => setContactLink(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" placeholder="오픈카톡, 구글폼 등" />
              </div>
              
              {/* 🔥 A개발자의 모집 상태 토글 복구 */}
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="isOpen" 
                  checked={isOpen}
                  onChange={(e) => setIsOpen(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded" 
                />
                <label htmlFor="isOpen" className="text-sm font-medium text-slate-700 cursor-pointer">현재 팀원 모집 중</label>
              </div>

              <button type="submit" disabled={submitting} className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50">
                {submitting ? '등록 중...' : '모집 시작하기'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};