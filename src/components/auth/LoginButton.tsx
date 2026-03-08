import { useState } from 'react';
import { TwitterAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';

export const LoginButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);
    const provider = new TwitterAuthProvider();
    
    try {
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error(err);
      setError('ログインに失敗しました。もう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleLogin}
        disabled={isLoading}
        className="bg-black text-white px-6 py-3 rounded-full font-bold shadow-md hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center gap-2"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-current">
          <g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 5.961H5.078z"></path></g>
        </svg>
        {isLoading ? '接続中...' : 'X (Twitter) でログイン'}
      </button>
      
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export const LogoutButton = () => {
  return (
    <button
      onClick={() => signOut(auth)}
      className="text-sm text-gray-500 hover:text-gray-800 underline"
    >
      ログアウト
    </button>
  );
};