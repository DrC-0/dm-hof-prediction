import type {
  SingleEntry,
  ComboEntry,
  OfficialResultEntry,
  EntryResult,
  SeasonResult,
  PredictionCategory,
  Verdict,
} from '../types';

const POINTS: Record<Verdict, number> = {
  hit: 3,
  partial: 1,
  miss: -1,
};

/**
 * 単体カード予想の判定
 * - 完全的中: カード名もカテゴリも一致 → hit (+3)
 * - 部分的中: カード名は一致するが別カテゴリで規制 → partial (+1)
 * - 外れ: 結果に含まれない → miss (-1)
 */
export function judgeSingleEntry(
  entry: SingleEntry,
  officialResults: OfficialResultEntry[]
): Verdict {
  for (const result of officialResults) {
    if (result.cardName === entry.cardName) {
      // コンビ結果の場合、単体カードの部分的中として扱う
      if (result.category === 'プレ殿コンビ') {
        return 'partial';
      }
      if (result.category === entry.category) {
        return 'hit';
      }
      return 'partial';
    }
    // コンビ結果の片方カードと一致する場合
    if (
      result.category === 'プレ殿コンビ' &&
      result.pairCardName === entry.cardName
    ) {
      return 'partial';
    }
  }
  return 'miss';
}

/**
 * コンビ予想の判定
 * - 完全的中: 予想ペアが公式コンビと一致（順序不問）→ hit (+3)
 * - 部分的中: ペアの片方が別カテゴリで規制 → partial (+1)
 * - 外れ: どちらも結果に含まれない → miss (-1)
 */
export function judgeComboEntry(
  entry: ComboEntry,
  officialResults: OfficialResultEntry[]
): Verdict {
  const names = new Set([entry.card1.cardName, entry.card2.cardName]);

  // 完全的中チェック（コンビ結果と順序不問で一致）
  for (const result of officialResults) {
    if (result.category === 'プレ殿コンビ' && result.pairCardName) {
      const resultNames = new Set([result.cardName, result.pairCardName]);
      if (
        resultNames.size === names.size &&
        [...names].every((n) => resultNames.has(n))
      ) {
        return 'hit';
      }
    }
  }

  // 部分的中チェック（片方が何らかの規制を受けた）
  const allRegulatedCards = new Set<string>();
  for (const result of officialResults) {
    allRegulatedCards.add(result.cardName);
    if (result.pairCardName) {
      allRegulatedCards.add(result.pairCardName);
    }
  }

  const card1Regulated = allRegulatedCards.has(entry.card1.cardName);
  const card2Regulated = allRegulatedCards.has(entry.card2.cardName);

  if (card1Regulated || card2Regulated) {
    return 'partial';
  }

  return 'miss';
}

/**
 * 全予想の判定結果リストを生成
 */
export function buildEntryResults(
  entries: SingleEntry[],
  comboEntries: ComboEntry[],
  officialResults: OfficialResultEntry[]
): EntryResult[] {
  const results: EntryResult[] = [];

  for (const entry of entries) {
    const verdict = judgeSingleEntry(entry, officialResults);
    results.push({
      type: 'single',
      cardName: entry.cardName,
      cardId: entry.cardId,
      imageUrl: entry.imageUrl,
      category: entry.category,
      verdict,
      actualCategory: verdict === 'partial'
        ? findActualCategory(entry.cardName, officialResults)
        : undefined,
    });
  }

  for (const combo of comboEntries) {
    const verdict = judgeComboEntry(combo, officialResults);
    results.push({
      type: 'combo',
      cardName: combo.card1.cardName,
      cardId: combo.card1.cardId,
      imageUrl: combo.card1.imageUrl,
      category: 'プレ殿コンビ' as PredictionCategory,
      card2: combo.card2,
      verdict,
    });
  }

  return results;
}

function findActualCategory(
  cardName: string,
  officialResults: OfficialResultEntry[]
): string | undefined {
  for (const result of officialResults) {
    if (result.cardName === cardName || result.pairCardName === cardName) {
      return result.category;
    }
  }
  return undefined;
}

/**
 * シーズンスコア計算
 * score = Σ(各予想のポイント)
 * maxScore = 予想総数 × 3
 * rateDelta = score / maxScore × 100
 */
export function calculateSeasonResult(
  userId: string,
  seasonId: string,
  entries: SingleEntry[],
  comboEntries: ComboEntry[],
  officialResults: OfficialResultEntry[]
): SeasonResult {
  const entryResults = buildEntryResults(entries, comboEntries, officialResults);

  const score = entryResults.reduce((sum, r) => sum + POINTS[r.verdict], 0);
  const totalPredictions = entries.length + comboEntries.length;
  const maxScore = totalPredictions * 3;
  const rateDelta = maxScore === 0 ? 0 : (score / maxScore) * 100;

  return {
    userId,
    seasonId,
    score,
    maxScore,
    rateDelta,
    entryResults,
    calculatedAt: new Date(),
  };
}
