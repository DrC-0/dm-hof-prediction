import { useAuth } from './hooks/useAuth';
import { LoginButton, LogoutButton } from './components/auth/LoginButton';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md w-full">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">
          デュエマ殿堂予想バトル 🔮
        </h1>
        
        {user ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
              <p className="font-bold">ログイン成功！</p>
              <p className="text-sm mt-1">ようこそ、{user.displayName} さん</p>
            </div>
            
            {/* ユーザーのアイコン画像がある場合は表示 */}
            {user.photoURL && (
              <img 
                src={user.photoURL} 
                alt="プロフィール" 
                className="w-16 h-16 rounded-full mx-auto shadow-sm"
              />
            )}

            <div className="pt-4">
              <LogoutButton />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-600 mb-4">
              予想を投稿するにはログインしてください。
            </p>
            <LoginButton />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;