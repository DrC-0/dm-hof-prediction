import { useState, useMemo } from 'react';
import cardsRaw from '../data/cards_raw.json';

type RegulationFilter = '殿堂' | 'プレミアム殿堂' | '制限なし' | null;

interface CardEntry {
  cardName: string;
  cardId: string;
  imageUrl: string;
  civilization: string[];
  regulationStatus: string;
}

const allCards: CardEntry[] = cardsRaw as CardEntry[];

const TopTab = () => {
  const [cardName, setCardName] = useState('');
  const [regulationFilter, setRegulationFilter] = useState<RegulationFilter>(null);
  const [imgErrors, setImgErrors] = useState<Set<string>>(new Set());

  const toggleFilter = (filter: RegulationFilter) => {
    setRegulationFilter(prev => prev === filter ? null : filter);
  };

  const filteredCards = useMemo(() => {
    return allCards.filter(card => {
      const nameMatch = cardName === '' || card.cardName.includes(cardName);
      const regMatch = regulationFilter === null || (() => {
        if (regulationFilter === '殿堂') return card.regulationStatus === 'hall';
        if (regulationFilter === 'プレミアム殿堂') return card.regulationStatus === 'premium';
        if (regulationFilter === '制限なし') return card.regulationStatus === 'none';
        return true;
      })();
      return nameMatch && regMatch;
    });
  }, [cardName, regulationFilter]);

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

        {/* カード一覧 */}
        <div className="mb-3 h-48 overflow-y-auto rounded-lg border border-gray-800 bg-gray-950 p-2">
          {filteredCards.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-600 text-sm">
              該当するカードがありません
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(64px,1fr))] gap-2">
              {filteredCards.map(card => (
                <div
                  key={card.cardId || card.cardName}
                  className="flex flex-col items-center gap-1 cursor-pointer group"
                  title={card.cardName}
                >
                  {imgErrors.has(card.cardId) ? (
                    <div className="w-16 h-22 bg-gray-800 border border-gray-700 rounded flex items-center justify-center text-gray-600 text-xs text-center p-1 leading-tight">
                      {card.cardName}
                    </div>
                  ) : (
                    <img
                      src={card.imageUrl}
                      alt={card.cardName}
                      className="w-16 rounded border border-gray-700 group-hover:border-yellow-500 transition-colors"
                      onError={() => setImgErrors(prev => new Set(prev).add(card.cardId))}
                    />
                  )}
                  <span className="text-gray-500 text-xs text-center leading-tight line-clamp-2 w-16">
                    {card.cardName}
                  </span>
                </div>
              ))}
            </div>
          )}
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
          <span className="text-gray-600 text-xs self-center ml-auto">
            {filteredCards.length}件
          </span>
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
