const TopTab = () => {
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

      {/* カード検索エリア（仮） */}
      <section className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
          カード検索
        </h2>
        <div className="min-h-24 flex items-center justify-center text-gray-600 text-sm border-2 border-dashed border-gray-800 rounded-lg">
          カード検索UI（実装予定）
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
