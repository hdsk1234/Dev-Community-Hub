import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { Navbar } from "./components/Navbar";
import { HackathonListPage } from "./pages/HackathonListPage";
import { HackathonDetailPage } from "./pages/HackathonDetailPage";
import { CampPage } from "./pages/CampPage";
import { RankingsPage } from "./pages/RankingsPage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { MyPage } from "./pages/MyPage";
import { MyHackathonAll } from "./pages/MyHackathonAll"; // 전체보기 페이지
import { MyBadges } from "./pages/MyBadges"; // 🔥 추가: 나의 뱃지 페이지 임포트
import { AuthProvider } from "./components/AuthContext";
import { Toaster } from "react-hot-toast";

// --- 1. HomePage 컴포넌트 ---
const HomePage = () => (
  <div className="space-y-8">
    <header className="py-10 text-center space-y-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-sm font-bold mb-2"
      >
        🚀 2026년 새로운 도전이 시작됩니다
      </motion.div>
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight"
      >
        개발자 성장을 위한 <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">최고의 커뮤니티</span>
      </motion.h1>
    </header>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[
        { title: "해커톤", desc: "전 세계 개발자들과 경쟁하고 협력하세요.", color: "from-blue-500 to-indigo-600", path: "/hackathons" },
        { title: "캠프", desc: "집중적인 학습으로 실무 능력을 키우세요.", color: "from-emerald-500 to-teal-600", path: "/camp" },
        { title: "랭킹", desc: "나의 위치를 확인하고 동기부여를 얻으세요.", color: "from-amber-500 to-orange-600", path: "/rankings" },
      ].map((card, i) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 + 0.2 }}
          className="group p-6 rounded-3xl bg-white border border-slate-100 shadow-xl hover:-translate-y-1 transition-all"
        >
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} mb-4`} />
          <h3 className="text-xl font-bold text-slate-900 mb-2">{card.title}</h3>
          <p className="text-slate-500 text-sm leading-relaxed mb-4">{card.desc}</p>
          <a href={card.path} className="inline-flex items-center text-sm font-bold text-indigo-600">자세히 보기 →</a>
        </motion.div>
      ))}
    </div>
  </div>
);

// --- 2. PageWrapper (애니메이션 래퍼) ---
const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      {children}
    </motion.div>
  );
};

// --- 3. AnimatedRoutes ---
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <div key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
          <Route path="/hackathons" element={<PageWrapper><HackathonListPage /></PageWrapper>} />
          <Route path="/hackathons/:slug" element={<PageWrapper><HackathonDetailPage /></PageWrapper>} />
          <Route path="/camp" element={<PageWrapper><CampPage /></PageWrapper>} />
          <Route path="/rankings" element={<PageWrapper><RankingsPage /></PageWrapper>} />
          <Route path="/login" element={<PageWrapper><LoginPage /></PageWrapper>} />
          <Route path="/signup" element={<PageWrapper><SignupPage /></PageWrapper>} />
          <Route path="/mypage" element={<PageWrapper><MyPage /></PageWrapper>} />
          <Route path="/my-hackathons" element={<PageWrapper><MyHackathonAll /></PageWrapper>} />
          {/* 🔥 추가된 경로 */}
          <Route path="/my-badges" element={<PageWrapper><MyBadges /></PageWrapper>} />
        </Routes>
      </div>
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-50">
          <Toaster position="top-center" />
          <Navbar />
          <main>
            <AnimatedRoutes />
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}