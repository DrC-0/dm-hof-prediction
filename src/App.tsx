import { useAuth } from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import TopTab from './pages/TopTab';
import Header from './components/layout/Header';
import StatusBar from './components/layout/StatusBar';
import Footer from './components/layout/Footer';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col text-white">
      <Header user={user} />
      {/* TODO: useSeason で実際のシーズンデータを渡す */}
      <StatusBar status="open" title="2026年3月 殿堂発表" deadline={new Date('2026-03-20T23:59:00')} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6">
        <TopTab />
      </main>

      <Footer />
    </div>
  );
}

export default App;
