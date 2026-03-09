import type { User } from 'firebase/auth';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';

interface HeaderProps {
  user: User;
}

const Header = ({ user }: HeaderProps) => {
  return (
    <header className="bg-gray-950 border-b border-gray-800 px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* タイトル */}
        <h1 className="text-lg font-black text-white">
          殿堂予想<span className="text-yellow-400">バトル</span>
        </h1>

        {/* ユーザー情報 */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {user.photoURL && (
              <img
                src={user.photoURL}
                alt="アイコン"
                className="w-7 h-7 rounded-full"
              />
            )}
            <span className="text-gray-300 text-sm hidden sm:block">
              {user.displayName}
            </span>
          </div>
          <button
            onClick={() => signOut(auth)}
            className="text-xs text-gray-500 hover:text-gray-300 border border-gray-700 hover:border-gray-500 rounded px-2 py-1 transition-colors"
          >
            ログアウト
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
