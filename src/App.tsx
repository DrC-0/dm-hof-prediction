import { auth } from './lib/firebase';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-md text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">
          デュエマ殿堂予想バトル 🔮
        </h1>
        
        {/* Firebaseの読み込みテスト */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h2 className="text-sm font-semibold text-gray-500 mb-2">システムステータス</h2>
          {auth.app.options.appId ? (
            <p className="text-green-600 font-medium">✅ Firebase 接続成功！</p>
          ) : (
            <p className="text-red-600 font-medium">❌ Firebase 接続エラー</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;