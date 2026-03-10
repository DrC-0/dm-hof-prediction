# 🔮 デュエマ殿堂予想バトル

> **⚠️ このプロジェクトは現在開発中です。機能・仕様は予告なく変更される場合があります。**

デュエル・マスターズの殿堂発表を予想し、的中率を競い合う Web サイトです。

https://dm-hof-prediction.pages.dev/[https://dm-hof-prediction.pages.dev/]

## どんなサービス？

殿堂発表の前にカードを予想して投稿 → 発表後に自動採点 → レートで腕を競う。  
予想と結果は画像としてシェアでき、Twitter/X で殿堂発表をもっと盛り上げます。

### 主な機能

- **殿堂予想の投稿** — 殿堂入り・プレミアム殿堂・プレミアム殿堂コンビ・殿堂解除・プレミアム殿堂解除の5カテゴリに対してカードを予想
- **自動採点 & レーティング** — 完全的中 / 部分的中 / 外れ を判定し、精度に基づくレートを算出
- **ランキング** — シーズン別 & 通算レートの2軸で競争
- **共有画像生成** — 予想画像・結果画像を SNS 投稿用に自動生成

## 技術スタック

| レイヤー | 技術 |
|---|---|
| ランタイム | Bun |
| フロントエンド | React + Vite (TypeScript) |
| スタイリング | Tailwind CSS |
| 認証 | Firebase Authentication |
| データベース | Cloud Firestore |
| ホスティング | Cloudflare Pages |
| 画像生成 | html2canvas |

## セットアップ

### 前提

- [Bun](https://bun.sh/) がインストールされていること
- Firebase プロジェクトが作成済みであること

### インストール

```bash
bun install
```

### 環境変数

`.env.local` を作成し、Firebase の設定値を記入してください。

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 開発サーバー

```bash
bun run dev
```

### ビルド

```bash
bun run build
```

### テスト

```bash
bun test
```

## スコアリング

| 判定 | ポイント |
|---|---|
| 完全的中（カード＋カテゴリ一致） | +3 pt |
| 部分的中（カードは合っていたがカテゴリ違い） | +1 pt |
| 外れ（予想したが結果に含まれず） | -1 pt |

**レート計算**: `シーズンスコア ÷ 最大スコア × 100` を通算レート（初期値 1000）に累積加算。  
たくさん予想すれば当たりやすい反面、外れのマイナスも嵩むため、精度重視の予想が有利になる設計です。

## ライセンス

TBD

---

殿堂予想バトルはファンコンテンツ・ポリシーに沿った非公式のファンコンテンツです。ウィザーズ社の認可/許諾は得ていません。  
題材の一部に、ウィザーズ・オブ・ザ・コースト社の財産を含んでいます。©Wizards of the Coast LLC.