import type { SeasonStatus } from '../../types';

interface StatusBarProps {
  status: SeasonStatus | null;
  title: string | null;
  deadline: Date | null;
}

const StatusBar = ({ status, title, deadline }: StatusBarProps) => {
  if (!status) {
    return (
      <div className="bg-gray-800 text-gray-400 text-center text-xs py-2 px-4">
        現在開催中のシーズンはありません
      </div>
    );
  }

  const formatDeadline = (date: Date) => {
    return date.toLocaleString('ja-JP', {
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (status === 'open') {
    return (
      <div className="bg-blue-950 border-b border-blue-800 text-center text-xs py-2 px-4">
        <span className="inline-flex items-center gap-2 text-blue-300">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          <span className="font-bold text-white">{title}</span>
          <span>予想受付中</span>
          {deadline && (
            <span className="text-blue-400">締切: {formatDeadline(deadline)}</span>
          )}
        </span>
      </div>
    );
  }

  if (status === 'closed') {
    return (
      <div className="bg-yellow-950 border-b border-yellow-800 text-center text-xs py-2 px-4">
        <span className="inline-flex items-center gap-2 text-yellow-300">
          <span className="w-2 h-2 rounded-full bg-yellow-400" />
          <span className="font-bold text-white">{title}</span>
          <span>締切済み — 結果発表待ち</span>
        </span>
      </div>
    );
  }

  // resulted
  return (
    <div className="bg-green-950 border-b border-green-800 text-center text-xs py-2 px-4">
      <span className="inline-flex items-center gap-2 text-green-300">
        <span className="w-2 h-2 rounded-full bg-green-400" />
        <span className="font-bold text-white">{title}</span>
        <span>結果発表中</span>
      </span>
    </div>
  );
};

export default StatusBar;
