import { motion } from "motion/react";
import { Loader2, AlertCircle, Inbox } from "lucide-react";

export const LoadingView = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <Loader2 className="w-12 h-12 text-indigo-600" />
    </motion.div>
    <p className="text-lg font-medium text-slate-600 animate-pulse">데이터를 불러오는 중입니다...</p>
  </div>
);

export const EmptyView = ({ message = "표시할 데이터가 없습니다." }: { message?: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center px-4">
    <div className="bg-slate-100 p-6 rounded-full">
      <Inbox className="w-16 h-16 text-slate-400" />
    </div>
    <h3 className="text-xl font-semibold text-slate-800">텅 비어 있네요</h3>
    <p className="text-slate-500 max-w-xs">{message}</p>
  </div>
);

export const ErrorView = ({ message = "문제가 발생했습니다. 잠시 후 다시 시도해주세요." }: { message?: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center px-4">
    <div className="bg-red-50 p-6 rounded-full">
      <AlertCircle className="w-16 h-16 text-red-500" />
    </div>
    <h3 className="text-xl font-semibold text-red-800">오류 발생</h3>
    <p className="text-red-600/80 max-w-xs">{message}</p>
    <button 
      onClick={() => window.location.reload()}
      className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
    >
      다시 시도
    </button>
  </div>
);
