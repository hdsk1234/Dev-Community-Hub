import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Award, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface PeerReviewModalProps { onClose: () => void; }

const EVALUATION_OPTIONS = {
  Developer: ["원활한 소통", "코드 품질 및 버그 대응", "기술적 문제 해결"],
  Designer: ["원활한 소통", "UI/UX 감각", "디자인 구현력"],
  PM: ["원활한 소통", "방향성 및 일정 관리", "문서화 및 아이디어"]
};

const MOCK_TEAM_MEMBERS = [
  { id: 'u1', name: 'doyeop', role: 'Developer' },
  { id: 'u2', name: 'swaan', role: 'PM' }
];

export const PeerReviewModal: React.FC<PeerReviewModalProps> = ({ onClose }) => {
  const [selectedUser, setSelectedUser] = useState(MOCK_TEAM_MEMBERS[0]);
  const [selectedTrait, setSelectedTrait] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!selectedTrait) return toast.error("평가 항목을 선택해주세요.");
    setIsSubmitted(true);
    toast.success(`${selectedUser.name}님에게 뱃지를 전달했습니다!`);
    setTimeout(() => onClose(), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div initial={{ y: 20, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 20, opacity: 0, scale: 0.95 }} className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"><X className="w-6 h-6" /></button>

        {isSubmitted ? (
          <div className="text-center py-10 space-y-4">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-block p-4 bg-emerald-100 rounded-full text-emerald-600 mb-2">
              <CheckCircle2 className="w-12 h-12" />
            </motion.div>
            <h3 className="text-2xl font-black text-slate-900">평가 완료!</h3>
          </div>
        ) : (
          <div className="space-y-8">
            <div>
              <div className="flex items-center space-x-2 text-indigo-600 mb-2"><Award className="w-6 h-6" /><span className="font-bold text-xs uppercase">Peer Review</span></div>
              <h3 className="text-2xl font-black">또 한 번 하고 싶어요!</h3>
            </div>
            <div className="flex space-x-2 p-1 bg-slate-100 rounded-xl">
              {MOCK_TEAM_MEMBERS.map(m => (
                <button key={m.id} onClick={() => { setSelectedUser(m); setSelectedTrait(null); }} className={`flex-1 py-2.5 rounded-lg text-sm font-bold ${selectedUser.id === m.id ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>{m.name}</button>
              ))}
            </div>
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{selectedUser.role} 직군</span>
              {EVALUATION_OPTIONS[selectedUser.role as keyof typeof EVALUATION_OPTIONS].map((trait, idx) => (
                <button key={idx} onClick={() => setSelectedTrait(trait)} className={`w-full text-left p-4 rounded-xl border-2 flex items-center justify-between ${selectedTrait === trait ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 bg-white'}`}>
                  <span className="font-bold text-sm">{trait}</span>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedTrait === trait ? 'border-indigo-600' : 'border-slate-300'}`}>
                    {selectedTrait === trait && <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />}
                  </div>
                </button>
              ))}
            </div>
            <button onClick={handleSubmit} className={`w-full py-4 rounded-xl font-bold shadow-lg ${selectedTrait ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}>평가 제출하기</button>
          </div>
        )}
      </motion.div>
    </div>
  );
};