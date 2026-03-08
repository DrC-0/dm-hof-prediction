import { describe, it, expect } from 'bun:test';
import {
  judgeSingleEntry,
  judgeComboEntry,
  calculateSeasonResult,
} from './scoring';
import type { SingleEntry, ComboEntry, OfficialResultEntry } from '../types';

// ---- テスト用ヘルパー ----

const card = (cardName: string, cardId = 'dm00-000') => ({
  cardId,
  cardName,
  imageUrl: `https://example.com/${cardId}.jpg`,
});

const singleEntry = (
  cardName: string,
  category: SingleEntry['category']
): SingleEntry => ({ ...card(cardName), category });

const comboEntry = (name1: string, name2: string): ComboEntry => ({
  card1: card(name1),
  card2: card(name2),
});

const official = (
  cardName: string,
  category: OfficialResultEntry['category'],
  pairCardName?: string
): OfficialResultEntry => ({
  ...card(cardName),
  category,
  ...(pairCardName
    ? { pairCardName, pairCardId: 'dm00-001', pairImageUrl: 'https://example.com/dm00-001.jpg' }
    : {}),
});

// ---- judgeSingleEntry ----

describe('judgeSingleEntry', () => {
  it('カード名・カテゴリが一致 → hit', () => {
    const entry = singleEntry('カードA', '殿堂入り');
    const results = [official('カードA', '殿堂入り')];
    expect(judgeSingleEntry(entry, results)).toBe('hit');
  });

  it('カード名は一致するがカテゴリ違い → partial', () => {
    const entry = singleEntry('カードA', '殿堂入り');
    const results = [official('カードA', 'プレ殿')];
    expect(judgeSingleEntry(entry, results)).toBe('partial');
  });

  it('カード名も結果に存在しない → miss', () => {
    const entry = singleEntry('カードA', '殿堂入り');
    const results = [official('カードB', '殿堂入り')];
    expect(judgeSingleEntry(entry, results)).toBe('miss');
  });

  it('カードが公式コンビ結果に含まれる → partial', () => {
    const entry = singleEntry('カードA', '殿堂入り');
    const results = [official('カードA', 'プレ殿コンビ', 'カードB')];
    expect(judgeSingleEntry(entry, results)).toBe('partial');
  });

  it('カードが公式コンビの pair 側に含まれる → partial', () => {
    const entry = singleEntry('カードB', '殿堂入り');
    const results = [official('カードA', 'プレ殿コンビ', 'カードB')];
    expect(judgeSingleEntry(entry, results)).toBe('partial');
  });

  it('結果が空 → miss', () => {
    const entry = singleEntry('カードA', '殿堂入り');
    expect(judgeSingleEntry(entry, [])).toBe('miss');
  });
});

// ---- judgeComboEntry ----

describe('judgeComboEntry', () => {
  it('予想ペアが公式コンビと完全一致 → hit', () => {
    const entry = comboEntry('カードA', 'カードB');
    const results = [official('カードA', 'プレ殿コンビ', 'カードB')];
    expect(judgeComboEntry(entry, results)).toBe('hit');
  });

  it('順序が逆でも完全一致 → hit', () => {
    const entry = comboEntry('カードB', 'カードA');
    const results = [official('カードA', 'プレ殿コンビ', 'カードB')];
    expect(judgeComboEntry(entry, results)).toBe('hit');
  });

  it('片方が別カテゴリで規制 → partial', () => {
    const entry = comboEntry('カードA', 'カードC');
    const results = [official('カードA', '殿堂入り')];
    expect(judgeComboEntry(entry, results)).toBe('partial');
  });

  it('両方とも規制されていない → miss', () => {
    const entry = comboEntry('カードX', 'カードY');
    const results = [official('カードA', 'プレ殿コンビ', 'カードB')];
    expect(judgeComboEntry(entry, results)).toBe('miss');
  });

  it('結果が空 → miss', () => {
    const entry = comboEntry('カードA', 'カードB');
    expect(judgeComboEntry(entry, [])).toBe('miss');
  });
});

// ---- calculateSeasonResult ----

describe('calculateSeasonResult', () => {
  it('SPEC.md の計算例: スコア 8pt, maxScore 18pt, rateDelta ≈ 44.4', () => {
    // 完全的中 2枚 (+6), 部分的中 1枚 (+1), 外れ 2枚 (-2), コンビ完全的中 1組 (+3) = 8pt
    const entries: SingleEntry[] = [
      singleEntry('カードA', '殿堂入り'),  // hit
      singleEntry('カードB', '殿堂入り'),  // hit
      singleEntry('カードC', '殿堂入り'),  // partial（実際はプレ殿）
      singleEntry('カードD', 'プレ殿'),    // miss
      singleEntry('カードE', 'プレ殿'),    // miss
    ];
    const combos: ComboEntry[] = [
      comboEntry('カードF', 'カードG'),    // hit
    ];
    const results: OfficialResultEntry[] = [
      official('カードA', '殿堂入り'),
      official('カードB', '殿堂入り'),
      official('カードC', 'プレ殿'),
      official('カードF', 'プレ殿コンビ', 'カードG'),
    ];

    const result = calculateSeasonResult('user1', 'season1', entries, combos, results);

    expect(result.score).toBe(8);
    expect(result.maxScore).toBe(18);
    expect(result.rateDelta).toBeCloseTo(44.4, 1);
  });

  it('全的中: rateDelta = 100', () => {
    const entries: SingleEntry[] = [singleEntry('カードA', '殿堂入り')];
    const results: OfficialResultEntry[] = [official('カードA', '殿堂入り')];

    const result = calculateSeasonResult('user1', 's1', entries, [], results);
    expect(result.score).toBe(3);
    expect(result.maxScore).toBe(3);
    expect(result.rateDelta).toBe(100);
  });

  it('全外し: スコアがマイナス, rateDelta が負', () => {
    const entries: SingleEntry[] = [
      singleEntry('カードA', '殿堂入り'),
      singleEntry('カードB', '殿堂入り'),
    ];
    const result = calculateSeasonResult('user1', 's1', entries, [], []);
    expect(result.score).toBe(-2);
    expect(result.maxScore).toBe(6);
    expect(result.rateDelta).toBeCloseTo(-33.3, 1);
  });

  it('予想なし: score=0, maxScore=0, rateDelta=0', () => {
    const result = calculateSeasonResult('user1', 's1', [], [], []);
    expect(result.score).toBe(0);
    expect(result.maxScore).toBe(0);
    expect(result.rateDelta).toBe(0);
  });

  it('entryResults の verdict が正しくセットされる', () => {
    const entries: SingleEntry[] = [
      singleEntry('カードA', '殿堂入り'),
      singleEntry('カードB', '殿堂入り'),
    ];
    const officialResults: OfficialResultEntry[] = [
      official('カードA', '殿堂入り'),
    ];

    const result = calculateSeasonResult('user1', 's1', entries, [], officialResults);
    expect(result.entryResults[0].verdict).toBe('hit');
    expect(result.entryResults[1].verdict).toBe('miss');
  });

  it('partial の場合 actualCategory がセットされる', () => {
    const entries: SingleEntry[] = [singleEntry('カードA', '殿堂入り')];
    const officialResults: OfficialResultEntry[] = [official('カードA', 'プレ殿')];

    const result = calculateSeasonResult('user1', 's1', entries, [], officialResults);
    expect(result.entryResults[0].verdict).toBe('partial');
    expect(result.entryResults[0].actualCategory).toBe('プレ殿');
  });

  it('コンビ予想の type が "combo" になる', () => {
    const combos: ComboEntry[] = [comboEntry('カードA', 'カードB')];
    const officialResults: OfficialResultEntry[] = [
      official('カードA', 'プレ殿コンビ', 'カードB'),
    ];

    const result = calculateSeasonResult('user1', 's1', [], combos, officialResults);
    expect(result.entryResults[0].type).toBe('combo');
    expect(result.entryResults[0].verdict).toBe('hit');
  });
});
