import { LoginButton } from '../components/auth/LoginButton';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center gap-8 w-full max-w-sm">
        {/* ロゴ・タイトル */}
        <div className="text-center">
          <p className="text-gray-400 text-sm tracking-widest uppercase mb-2">Duel Masters</p>
          <h1 className="text-4xl font-black text-white leading-tight">
            殿堂予想
            <span className="text-yellow-400">バトル</span>
          </h1>
          <p className="text-gray-400 text-sm mt-3">
            殿堂発表を予想して、みんなと的中率を競おう
          </p>
        </div>

        {/* ログインカード */}
        <div className="w-full bg-gray-900 border border-gray-800 rounded-2xl p-8 flex flex-col items-center gap-6">
          <p className="text-gray-300 text-sm text-center">
            予想を投稿するには<br />X (Twitter) アカウントでログインしてください
          </p>
          <LoginButton />
        </div>

        <p className="text-gray-600 text-xs text-center">
          ログインすることで利用規約に同意したものとみなされます
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
