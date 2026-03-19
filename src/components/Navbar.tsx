import { Link, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { Code2, Trophy, Tent, Home, LogIn, LogOut, User } from "lucide-react";
import { useAuth } from "./AuthContext";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

const navItems = [
  { path: "/", label: "메인", icon: Home },
  { path: "/hackathons", label: "해커톤", icon: Code2 },
  { path: "/camp", label: "캠프", icon: Tent },
  { path: "/rankings", label: "랭킹", icon: Trophy },
];

export const Navbar = () => {
  const location = useLocation();
  const { user, userProfile } = useAuth();

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Code2 className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              DevHub
            </span>
          </Link>
          
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                    isActive ? "text-indigo-600" : "text-slate-600 hover:text-indigo-500"
                  }`}
                >
                  <div className="flex items-center space-x-1">
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/mypage"
                  className="hidden sm:flex items-center space-x-2 text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <User className="w-4 h-4" />
                  </div>
                  <span>{userProfile?.nickname || user.displayName || '사용자'}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-500 hover:text-red-600 transition-colors"
                  title="로그아웃"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
              >
                <LogIn className="w-4 h-4" />
                <span>로그인</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
