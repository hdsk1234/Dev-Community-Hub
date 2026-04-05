import React from 'react';
import { motion } from "motion/react";
import { Loader2, AlertCircle, Inbox, RefreshCw } from "lucide-react";

interface StateViewsProps {
  isLoading?: boolean;
  isEmpty?: boolean;
  error?: Error | string | null;
  loadingMessage?: string;
  emptyTitle?: string;
  emptyMessage?: string;
  emptyAction?: React.ReactNode;
  onRetry?: () => void;
  children: React.ReactNode;
}

// 🔥 개별 뷰 디자인을 유지하면서 통합 컴포넌트로 구성
export const StateViews: React.FC<StateViewsProps> = ({
  isLoading = false,
  isEmpty = false,
  error = null,
  loadingMessage = "데이터를 불러오는 중입니다...",
  emptyTitle = "텅 비어 있네요",
  emptyMessage = "표시할 데이터가 없습니다.",
  emptyAction,
  onRetry,
  children,
}) => {
  
  // 1. 로딩 상태 UI
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-12 h-12 text-indigo-600" />
        </motion.div>
        <p className="text-lg font-medium text-slate-600 animate-pulse">{loadingMessage}</p>
      </div>
    );
  }

  // 2. 에러 상태 UI
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center px-4">
        <div className="bg-red-50 p-6 rounded-full">
          <AlertCircle className="w-16 h-16 text-red-500" />
        </div>
        <h3 className="text-xl font-semibold text-red-800">오류 발생</h3>
        <p className="text-red-600/80 max-w-xs">{typeof error === 'string' ? error : error?.message || "문제가 발생했습니다."}</p>
        <button 
          onClick={onRetry || (() => window.location.reload())}
          className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2 mx-auto"
        >
          <RefreshCw className="w-4 h-4" /> 다시 시도
        </button>
      </div>
    );
  }

  // 3. 데이터 없음(Empty) 상태 UI
  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center px-4">
        <div className="bg-slate-100 p-6 rounded-full">
          <Inbox className="w-16 h-16 text-slate-400" />
        </div>
        <h3 className="text-xl font-semibold text-slate-800">{emptyTitle}</h3>
        <p className="text-slate-500 max-w-xs">{emptyMessage}</p>
        {emptyAction && <div className="mt-4">{emptyAction}</div>}
      </div>
    );
  }

  // 4. 정상 상태일 때 실제 자식 컴포넌트(리스트 등) 표시
  return <>{children}</>;
};