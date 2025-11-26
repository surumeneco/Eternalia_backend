# Eternalia Backend ガイド

このディレクトリには、Eternalia_backend の実装ガイドが含まれています。

## フォルダ構成

### 📋 error/ - エラーハンドリングガイド

エラーコード管理システムとエラーハンドリングに関するドキュメント

- **[error-codes.md](./error/error-codes.md)** - エラーコード体系の説明
  - エラーコード形式 (`ET-{DOMAIN}-{CODE}`)
  - ドメイン一覧と標準エラーコード
  - JSON 設定構造
  - 多言語対応方法

- **[error-factories.md](./error/error-factories.md)** - エラー工場関数リファレンス
  - 10 個の工場関数の使用方法と例
  - `throwNotFound()`、`throwInvalidField()` など
  - ベストプラクティス
  - 複数フィールドエラーの処理

### 🗄️ entity/ - エンティティとデータベースガイド

TypeORM エンティティの定義、CRUD 操作、ビジネスキー管理

- **[entity-setup.md](./entity/entity-setup.md)** - エンティティ設定ガイド
  - エンティティファイル配置
  - エンティティ定義方法
  - Provider 設定
  - サービス層構造
  - マイグレーション実行方法

- **[crud-operations.md](./entity/crud-operations.md)** - CRUD 操作完全ガイド
  - CREATE：単一/複数レコード挿入
  - READ：各種検索パターン
  - UPDATE：単一/複数レコード更新
  - DELETE：単一/複数レコード削除
  - トランザクション処理
  - パフォーマンス最適化

- **[business-keys.md](./entity/business-keys.md)** - ビジネスキー使用ガイド
  - ビジネスキーの概念
  - ID ベース vs ビジネスキーベース
  - 実装パターン
  - 注意事項

### 📤 response/ - レスポンス形式ガイド

API レスポンス形式とエラーレスポンスの詳細

- **[error-response.md](./response/error-response.md)** - エラーレスポンス完全ガイド
  - 成功レスポンス形式
  - エラーレスポンス形式
  - HTTP ステータスコードマッピング
  - RequestId について
  - クライアント側のエラーハンドリング例
  - TypeScript/React 実装例

### 🔧 service/ - サービス層ガイド

NestJS サービス層の構造と Dependency Injection パターン

- **[service-structure.md](./service/service-structure.md)** - サービス層アーキテクチャ
  - エンティティサービス vs フロントエンドサービス
  - サービス間の依存関係
  - Module 設定パターン
  - Controller-Service-Entity の流れ

- **[dependency-injection.md](./service/dependency-injection.md)** - DI パターンガイド
  - Provider 設定方法
  - Module での配線
  - Factory パターン
  - Custom Provider

## クイックスタート

### 新しいドメインを追加する場合

1. **エンティティを定義**
   - [entity-setup.md](./entity/entity-setup.md) 参照

2. **CRUD サービスを実装**
   - [crud-operations.md](./entity/crud-operations.md) 参照

3. **ビジネスロジックサービスを実装**
   - [service-structure.md](./service/service-structure.md) 参照

4. **エラーハンドリングを追加**
   - [error-factories.md](./error/error-factories.md) 参照

### API でエラーを返す場合

1. [error-codes.md](./error/error-codes.md) でエラーコードを確認
2. [error-factories.md](./error/error-factories.md) で適切な工場関数を選択
3. `throwXxx()` を呼び出す
4. [error-response.md](./response/error-response.md) でクライアント側の処理を確認

### ビジネスキーで検索・更新する場合

1. [business-keys.md](./entity/business-keys.md) でビジネスキー体系を確認
2. [crud-operations.md](./entity/crud-operations.md) で `findByBusinessKey()` 使用例を確認

## 各ドメインの実装状況

### ✅ Tip ドメイン

- エンティティ：5個定義完了
- CRUD：全て実装完了
- API：route 定義完了、実装 TODO
- [src/entity/tip-entity/](../src/entity/tip-entity/)
- [src/tip/](../src/tip/)

### ✅ Story ドメイン

- エンティティ：4個定義完了
- CRUD：全て実装完了
- API：module 設定完了、実装 TODO
- [src/entity/story-entity/](../src/entity/story-entity/)
- [src/story/](../src/story/)

### ✅ Language ドメイン

- エンティティ：7個定義完了
- CRUD：全て実装完了
- API：module 設定完了、実装 TODO
- [src/entity/language-entity/](../src/entity/language-entity/)
- [src/language/](../src/language/)

### ✅ General ドメイン

- エンティティ：5個定義完了
- CRUD：全て実装完了
- API：module 設定完了、実装 TODO
- [src/entity/general-entity/](../src/entity/general-entity/)
- [src/general/](../src/general/)

## 主要ファイルへのリンク

### インフラストラクチャ

- [エラーコード JSON 設定](../src/config/error-codes.json)
- [ErrorCodeManager](../src/common/errors/error-code-manager.ts)
- [エラーハンドリング工場関数](../src/common/errors/error-factories.ts)
- [AllExceptionsFilter](../src/common/filters/all-exceptions.filter.ts)
- [ResponseInterceptor](../src/common/interceptors/response.interceptor.ts)
- [RequestIdMiddleware](../src/common/middleware/request-id.middleware.ts)

### Tip ドメイン例

- [TipEntityService](../src/entity/tip-entity/tip-entity.service.ts)
- [TipService](../src/tip/tip.service.ts)
- [TipController](../src/tip/tip.controller.ts)

## 標準コマンド

```bash
# 開発サーバー起動
npm run start:dev

# ビルド
npm run build

# テスト
npm run test

# E2E テスト
npm run test:e2e

# フォーマット
npm run format

# ESLint
npm run lint
```

## トラブルシューティング

### エラーが見つからない

エラーコード JSON にエラーが定義されているか確認：

```bash
cat src/config/error-codes.json
```

参照：[error-codes.md](./error/error-codes.md#トラブルシューティング)

### リレーションが取得されない

`relations` 指定を確認：

参照：[crud-operations.md](./entity/crud-operations.md#リレーション付き検索)

### データベース接続エラー

`.env` ファイルにデータベース設定があるか確認：

```bash
DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=
```

## 関連ドキュメント

- [NestJS 公式ドキュメント](https://docs.nestjs.com/)
- [TypeORM 公式ドキュメント](https://typeorm.io/)
- [プロジェクト README](../README.md)

## 更新履歴

- **2025-01-27**: 初版ガイド作成
  - エラーハンドリング、エンティティ、CRUD、レスポンス形式ガイド作成
  - Tip, Story, Language, General ドメイン情報記載

---

**最終更新**: 2025-01-27  
**対応バージョン**: NestJS 9+, TypeORM 0.3+
