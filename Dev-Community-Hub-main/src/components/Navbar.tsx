import { Link, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { Code2, Trophy, Tent, Home } from "lucide-react";

const navItems = [
  { path: "/", label: "메인", icon: Home },
  { path: "/hackathons", label: "해커톤", icon: Code2 },
  { path: "/camp", label: "캠프", icon: Tent },
  { path: "/rankings", label: "랭킹", icon: Trophy },
];

export const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Code2 className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              DevHub
            </span>
          </div>
          
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

          {/* Mobile simple nav */}
          <div className="md:hidden flex space-x-4">
             {navItems.map((item) => (
               <Link key={item.path} to={item.path} className="text-slate-600">
                 <item.icon className="w-5 h-5" />
               </Link>
             ))}
          </div>
        </div>
      </div>
    </nav>
  );
};
