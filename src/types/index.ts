// ===== カード =====

export interface CardData {
  cardId: string;   // 例: "dm01-030"
  cardName: string;
  imageUrl: string;
}

// ===== 予想カテゴリ =====

export type PredictionCategory =
  | "殿堂入り"
  | "プレ殿"
  | "プレ殿コンビ"
  | "殿堂解除"
  | "プレ殿解除";

// ===== 予想エントリ =====

export interface SingleEntry {
  cardName: string;
  cardId: string;
  imageUrl: string;
  category: Exclude<PredictionCategory, "プレ殿コンビ">;
}

export interface ComboEntry {
  card1: CardData;
  card2: CardData;
}

// ===== Prediction（Firestore: predictions/{userId}_{seasonId}） =====

export interface Prediction {
  userId: string;
  seasonId: string;
  entries: SingleEntry[];
  comboEntries: ComboEntry[];
  submittedAt: Date;
}

// ===== シーズン =====

export type SeasonStatus = "open" | "closed" | "resulted";

export interface OfficialResultEntry {
  cardName: string;
  cardId: string;
  imageUrl: string;
  category: PredictionCategory;
  // プレ殿コンビの場合
  pairCardName?: string;
  pairCardId?: string;
  pairImageUrl?: string;
}

export interface Season {
  id: string;
  title: string;
  deadline: Date;
  status: SeasonStatus;
  officialResults: OfficialResultEntry[];
  createdAt: Date;
}

// ===== 結果判定 =====

export type Verdict = "hit" | "partial" | "miss";

export interface EntryResult {
  type: "single" | "combo";
  cardName: string;
  cardId: string;
  imageUrl: string;
  category: PredictionCategory;
  // combo の場合
  card2?: CardData;
  // 判定
  verdict: Verdict;
  actualCategory?: string; // partial の場合の実際のカテゴリ
}

export interface SeasonResult {
  userId: string;
  seasonId: string;
  score: number;
  maxScore: number;
  rateDelta: number;
  entryResults: EntryResult[];
  calculatedAt: Date;
}

// ===== ユーザー =====

export type AuthProvider = "twitter";// | "google" | "email";

export interface AppUser {
  uid: string;
  displayName: string;
  photoURL?: string;
  authProvider: AuthProvider;
  totalRate: number;
  seasonCount: number;
  createdAt: Date;
}
