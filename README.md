# Eternalia Backend

NestJS + TypeORM で構築された Eternalia プロジェクトのバックエンドサーバー。

## 概要

Eternalia_backend は、複数のドメイン（Tip, Story, Language, General）を管理する統合 API サーバーです。

- **フレームワーク**: NestJS 9+
- **データベース**: SQL Server (TypeORM 0.3+)
- **認証**: （実装予定）
- **API 形式**: RESTful JSON

## 主要機能

### ✅ 実装済み

- **エンティティレイヤー**: 12 個のエンティティ CRUD 操作完全実装
  - Tip: 5 エンティティ
  - Story: 4 エンティティ
  - Language: 7 エンティティ
  - General: 5 エンティティ

- **エラーハンドリングシステム**: 統一されたエラーコード管理
  - エラーコード形式: `ET-{DOMAIN}-{CODE}`
  - 多言語対応（日本語/英語など）
  - グローバル例外フィルター

- **レスポンスエンベロープ**: 全レスポンスの統一形式
  - 成功: `{ status: "success", code, data, meta }`
  - エラー: `{ status: "error", message, error[], meta }`

- **リクエスト追跡**: UUID ベースの RequestId
  - 各リクエストに一意の ID を付与
  - ログとレスポンスで追跡可能

### ⏳ 実装予定

- Tip/Story/Language API エンドポイント実装
- DTO とバリデーション
- ユニット/統合テスト
- 認証・認可（JWT など）
- キャッシング層

## クイックスタート

### インストール

```bash
# 依存パッケージをインストール
npm install
```

### 環境設定

`.env` ファイルをプロジェクトルートに作成：

```env
# Database
DB_HOST=localhost
DB_PORT=1433
DB_USER=sa
DB_PASSWORD=your_password
DB_NAME=eternalia_db
DB_ENCRYPT=true

# Server
PORT=3000
NODE_ENV=development
```

### 開発サーバー起動

```bash
# ホットリロード付き
npm run start:dev

# または
npm run start:watch
```

サーバーは `http://localhost:3000` で起動します。

### ビルド

```bash
# プロダクション用ビルド
npm run build

# ビルド後の実行
npm run start:prod
```

## プロジェクト構成

```
src/
├── main.ts                          # アプリケーション エントリーポイント
├── app.module.ts                    # ルート Module
├── app.controller.ts
├── app.service.ts
│
├── common/
│   ├── errors/                      # エラーハンドリング
│   │   ├── app-errors.ts
│   │   ├── error-code-manager.ts
│   │   └── error-factories.ts
│   ├── filters/                     # グローバル例外フィルター
│   ├── interceptors/                # グローバルインターセプター
│   └── middleware/                  # グローバルミドルウェア
│
├── config/
│   └── error-codes.json             # エラーコード設定
│
├── entity/
│   ├── general-entity/              # General ドメイン
│   ├── language-entity/             # Language ドメイン
│   ├── story-entity/                # Story ドメイン
│   └── tip-entity/                  # Tip ドメイン
│
├── general/
│   ├── general.controller.ts
│   ├── general.service.ts
│   └── general.module.ts
│
├── language/
│   ├── language.controller.ts
│   ├── language.service.ts
│   └── language.module.ts
│
├── story/
│   ├── story.controller.ts
│   ├── story.service.ts
│   └── story.module.ts
│
└── tip/
    ├── tip.controller.ts
    ├── tip.service.ts
    └── tip.module.ts

guides/                                 # ドキュメンテーション
├── README.md                           # ガイド総合目次
├── error/                              # エラーハンドリングガイド
│   ├── error-codes.md
│   └── error-factories.md
├── entity/                             # エンティティガイド
│   ├── entity-setup.md
│   ├── crud-operations.md
│   └── business-keys.md
├── response/                           # レスポンス形式ガイド
│   └── error-response.md
└── service/                            # サービス層ガイド
    ├── service-structure.md
    └── dependency-injection.md
```

## ドキュメント

### 📖 実装ガイド

詳細なガイドは [guides/README.md](./guides/README.md) を参照してください。

- **[エラーハンドリング](./guides/error/)** - エラーコード体系、工場関数の使用方法
- **[エンティティ管理](./guides/entity/)** - エンティティ設定、CRUD 操作、ビジネスキー
- **[レスポンス形式](./guides/response/)** - API レスポンス、エラーレスポンス詳細
- **[サービス層](./guides/service/)** - アーキテクチャ、Dependency Injection

### クイックガイド

#### 新しいエラーコードを追加する

1. [guides/error/error-codes.md](./guides/error/error-codes.md) を参照
2. `src/config/error-codes.json` に追加
3. 必要に応じて `src/common/errors/error-factories.ts` に工場関数を追加

#### 新しいドメインを追加する

1. `src/entity/{domain}-entity/` にエンティティ定義
2. `src/entity/{domain}-entity/{domain}-entity.service.ts` に CRUD 実装
3. `src/{domain}/` にビジネスロジックサービスと Controller
4. `src/app.module.ts` にモジュール登録

#### ビジネスキーで検索する

[guides/entity/business-keys.md](./guides/entity/business-keys.md) を参照

```typescript
// ビジネスキーで検索
const category = await categoryEntityService.findByBusinessKey('CategoryName');
if (!category) {
  throwNotFound('TIP', 'category', ['categoryName']);
}
```

#### エラーを返す

[guides/error/error-factories.md](./guides/error/error-factories.md) を参照

```typescript
// 工場関数を使用
throwNotFound('DOMAIN', 'itemName', ['fieldName']);
throwInvalidField('DOMAIN', 'fieldName', ['fieldName']);
throwRequiredField('DOMAIN', 'fieldName', ['fieldName']);
```

## 標準コマンド

```bash
# 開発
npm run start:dev              # ホットリロード付き起動
npm run start:watch           # ファイル変更監視起動
npm run start:debug           # デバッグ付き起動

# ビルド・実行
npm run build                 # プロダクション用ビルド
npm run start:prod            # ビルド済みで実行

# テスト
npm run test                  # ユニットテスト実行
npm run test:watch           # テスト監視モード
npm run test:debug           # デバッグ付きテスト
npm run test:e2e             # E2E テスト実行

# コード品質
npm run format               # Prettier でフォーマット
npm run lint                 # ESLint でチェック
npm run lint:fix             # ESLint で自動修正

# マイグレーション
npm run migration:generate   # マイグレーション生成
npm run migration:run        # マイグレーション実行
npm run migration:revert     # マイグレーション ロールバック
```

## API エンドポイント

### Tip ドメイン

```
GET  /api/tip/categories/:categoryName/manage-detail      # カテゴリ詳細取得
GET  /api/tip/categories/:categoryName/public-info        # カテゴリ公開情報取得
POST /api/tip/categories                                  # カテゴリ登録
PUT  /api/tip/categories/:categoryName                    # カテゴリ更新
DELETE /api/tip/categories/:categoryName                  # カテゴリ削除

GET  /api/tip/:categoryName/:tipName/manage-detail        # Tip 詳細取得
GET  /api/tip/:categoryName/:tipName/public-info          # Tip 公開情報取得
POST /api/tip/register                                    # Tip 登録
PUT  /api/tip/:categoryName/:tipName                      # Tip 更新
DELETE /api/tip/:categoryName/:tipName                    # Tip 削除
```

**実装状況**: Route 定義完了、ビジネスロジック実装中

### Story ドメイン

```
GET  /api/story/volumes                                   # ボリューム一覧
GET  /api/story/volumes/:volumeName                       # ボリューム詳細
POST /api/story/volumes                                   # ボリューム登録
```

**実装状況**: Module 設定完了、API 設計中

### Language ドメイン

```
GET  /api/language/languages                              # 言語一覧
GET  /api/language/:languageCode                          # 言語詳細
POST /api/language                                        # 言語登録
```

**実装状況**: Module 設定完了、API 設計中

### General ドメイン

```
GET  /api/general/accounts                                # アカウント一覧
GET  /api/general/divisions                               # 部門一覧
```

**実装状況**: Module 設定完了、API 設計中

## エラーレスポンス例

### 404 Not Found

```bash
GET /api/tip/categories/NotExist/manage-detail
```

```json
{
  "status": "error",
  "message": "categoryが見つかりません。",
  "code": 404,
  "error": [
    {
      "code": "ET-TIP-001",
      "message": "categoryが見つかりません。",
      "fields": ["categoryName"]
    }
  ],
  "meta": {
    "requestId": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### 400 Bad Request

```bash
POST /api/tip/categories
Content-Type: application/json

{
  "CategoryName": "",
  "PublicationState": "INVALID"
}
```

```json
{
  "status": "error",
  "message": "Category, Name, PublicationDateTimeが必須です。",
  "code": 400,
  "error": [
    {
      "code": "ET-TIP-003",
      "message": "Category, Name, PublicationDateTimeが必須です。",
      "fields": ["Category", "Name", "PublicationDateTime"]
    }
  ],
  "meta": {
    "requestId": "550e8400-e29b-41d4-a716-446655440001"
  }
}
```

## トラブルシューティング

### データベース接続エラー

```
Error: connect ECONNREFUSED 127.0.0.1:1433
```

**対策**:

1. SQL Server が起動しているか確認
2. `.env` の DB_HOST, DB_PORT, DB_USER, DB_PASSWORD を確認
3. ネットワーク接続を確認

### ポート既に使用中

```
Error: listen EADDRINUSE: address already in use :::3000
```

**対策**:

```bash
# ポート変更
PORT=3001 npm run start:dev

# または既存プロセス終了
lsof -ti:3000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :3000   # Windows (確認)
taskkill /PID <PID> /F         # Windows (終了)
```

## 参考リンク

- [guides/README.md](./guides/README.md) - 総合ガイド目次
- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [SQL Server Documentation](https://docs.microsoft.com/en-us/sql/)

## ライセンス

（未定）

## 貢献

Pull Request を歓迎します。大きな変更の場合は、まず Issue を開いて変更内容を議論してください。

## 変更履歴

### v0.1.0 (2025-01-27)

- ✅ エンティティレイヤー完成（12 エンティティ）
- ✅ エラーハンドリングシステム完成
- ✅ レスポンスエンベロープ実装
- ✅ 包括的なドキュメント作成
- ⏳ API エンドポイント実装進行中

---

**最終更新**: 2025-01-27  
**対応バージョン**: NestJS 9+, TypeORM 0.3+, Node.js 16+
