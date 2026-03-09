import { useState } from 'react';

type RegulationFilter = '殿堂' | 'プレミアム殿堂' | '制限なし' | null;

const TopTab = () => {
  const [cardName, setCardName] = useState('');
  const [regulationFilter, setRegulationFilter] = useState<RegulationFilter>(null);

  const toggleFilter = (filter: RegulationFilter) => {
    setRegulationFilter(prev => prev === filter ? null : filter);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 殿堂予想エリア（仮） */}
      <section className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
          殿堂予想
        </h2>
        <div className="min-h-40 flex items-center justify-center text-gray-600 text-sm border-2 border-dashed border-gray-800 rounded-lg">
          カードをここにドラッグ&ドロップ（実装予定）
        </div>
      </section>

      {/* カード検索エリア */}
      <section className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
          カード検索
        </h2>

        {/* カード一覧（仮） */}
        <div className="mb-3 min-h-24 flex items-center justify-center text-gray-600 text-sm border-2 border-dashed border-gray-800 rounded-lg">
          カード一覧（実装予定）
        </div>

        {/* カード名入力 */}
        <input
          type="text"
          value={cardName}
          onChange={e => setCardName(e.target.value)}
          placeholder="カード名で検索..."
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 mb-3"
        />

        {/* 規制状況フィルタ（排他選択） */}
        <div className="flex gap-2 flex-wrap">
          {(['殿堂', 'プレミアム殿堂', '制限なし'] as const).map(filter => (
            <button
              key={filter}
              onClick={() => toggleFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                regulationFilter === filter
                  ? filter === '殿堂'
                    ? 'bg-yellow-500 border-yellow-500 text-black'
                    : filter === 'プレミアム殿堂'
                    ? 'bg-red-500 border-red-500 text-white'
                    : 'bg-gray-400 border-gray-400 text-black'
                  : 'bg-transparent border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-300'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      {/* アクションボタン */}
      <div className="flex gap-3 justify-end">
        <button
          disabled
          className="px-4 py-2 rounded-lg text-sm font-bold bg-gray-800 text-gray-500 cursor-not-allowed"
        >
          画像保存
        </button>
        <button
          disabled
          className="px-4 py-2 rounded-lg text-sm font-bold bg-gray-800 text-gray-500 cursor-not-allowed"
        >
          ツイート
        </button>
        <button
          disabled
          className="px-4 py-2 rounded-lg text-sm font-bold bg-yellow-600 text-white opacity-40 cursor-not-allowed"
        >
          提出
        </button>
      </div>
    </div>
  );
};

export default TopTab;
