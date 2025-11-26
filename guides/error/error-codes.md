# エラーコード管理システム

## 概要

Eternalia_backend のエラーコードは統一された形式で管理され、全てのドメイン（TIP, STORY, LANGUAGE, GENERAL）で一貫性を保ちます。

## エラーコード形式

```
ET-{DOMAIN}-{ERROR_CODE}
```

### 例

- `ET-TIP-001` - Tip ドメインの NOT_FOUND エラー
- `ET-STORY-002` - Story ドメインの INVALID_FIELD エラー
- `ET-LANGUAGE-003` - Language ドメインの REQUIRED_FIELD エラー

## ドメイン一覧

| ドメイン | コード | 説明                          |
| -------- | ------ | ----------------------------- |
| TIP      | 1      | Tip（ヒント）関連エラー       |
| STORY    | 2      | Story（ストーリー）関連エラー |
| LANGUAGE | 3      | Language（言語）関連エラー    |
| GENERAL  | 4      | 汎用・全体的なエラー          |

## エラーコード番号

各ドメインで共通して使用される標準エラーコード：

| コード | 名称               | HTTP Status | 説明                             |
| ------ | ------------------ | ----------- | -------------------------------- |
| 001    | NOT_FOUND          | 404         | リソースが見つからない           |
| 002    | INVALID_FIELD      | 400         | フィールド値が不正               |
| 003    | REQUIRED_FIELD     | 400         | 必須フィールドが不足             |
| 004    | INVALID_FORMAT     | 400         | 形式が不正（日時形式など）       |
| 005    | INVALID_DATE_RANGE | 400         | 日付範囲が不正（From > To など） |
| 006    | INVALID_PARAMETER  | 400         | パラメータが不正                 |
| 007    | ALREADY_EXISTS     | 409         | リソースが既に存在               |
| 008    | OPERATION_FAILED   | 500         | 操作に失敗                       |
| 009    | CUSTOM_ERROR       | 400～500    | カスタムエラー                   |
| 010    | VALIDATION_ERROR   | 400         | バリデーションエラー             |

## エラーコード設定ファイル

### ファイルパス

```
src/config/error-codes.json
```

### 構造

```json
{
  "domains": {
    "TIP": "1",
    "STORY": "2",
    "LANGUAGE": "3",
    "GENERAL": "4"
  },
  "errors": {
    "001": {
      "messages": {
        "ja": "[0]が見つかりません。",
        "en": "[0] was not found."
      }
    },
    "002": {
      "messages": {
        "ja": "[0]が不正です。",
        "en": "[0] is invalid."
      }
    },
    ...
  }
}
```

### メッセージテンプレート

メッセージは `[0]`, `[1]`, `[2]` などのプレースホルダをサポート：

```json
"001": {
  "messages": {
    "ja": "[0]が見つかりません。",
    "en": "[0] was not found."
  }
}
```

使用例：

```typescript
getMessage('001', 'category');
// 日本語: "categoryが見つかりません。"
```

## 多言語対応

### 新しい言語を追加する方法

1. `error-codes.json` の各エラーコードに言語を追加：

```json
"001": {
  "messages": {
    "ja": "[0]が見つかりません。",
    "en": "[0] was not found.",
    "fr": "[0] n'a pas été trouvé."
  }
}
```

2. サービスで言語を切り替え：

```typescript
import { ErrorCodeManager } from '../common/errors/error-code-manager';

const errorCodeManager = ErrorCodeManager.getInstance();
errorCodeManager.setLanguage('en'); // 以降のエラーは英語
```

3. または、リクエストの `Accept-Language` ヘッダから自動判定するミドルウェアを実装。

## エラーコードの拡張

### 新しいエラータイプを追加する方法

1. `error-codes.json` に新しいコードを追加：

```json
"011": {
  "messages": {
    "ja": "[0]のアクセス権がありません。",
    "en": "You don't have permission to access [0]."
  }
}
```

2. オプション：`error-factories.ts` にファクトリ関数を追加：

```typescript
export function throwAccessDenied(
  domain: string,
  resource: string,
  fields?: string[],
  details?: any,
): never {
  const code = errorCodeManager.getFullErrorCode(domain, '011');
  const message = errorCodeManager.getMessage('011', resource);
  throw new AppError(code, message, HttpStatus.FORBIDDEN, fields, details);
}
```

3. サービスで使用：

```typescript
throwAccessDenied('TIP', 'category', ['categoryId']);
```

## ベストプラクティス

### DO ✅

- **ドメイン固有のエラーは適切なドメインを使用する**

  ```typescript
  throwNotFound('TIP', 'category'); // ✅ TIP ドメイン内のエラー
  ```

- **複数フィールドのエラーは fields 配列に全て含める**

  ```typescript
  throwRequiredField('TIP', 'fields', ['field1', 'field2', 'field3']);
  ```

- **エラー詳細情報は details に格納する（クライアントには返されない）**
  ```typescript
  throwInvalidField('TIP', 'status', ['status'], {
    allowedValues: ['DRAFT', 'PUBLISHED'],
    providedValue: 'INVALID',
  });
  ```

### DON'T ❌

- **ハードコードされたエラーメッセージ**

  ```typescript
  throw new Error('Category not found'); // ❌
  ```

- **エラーコードを手動で構築**

  ```typescript
  const code = `ET-TIP-001`; // ❌ errorCodeManager を使用
  ```

- **詳細情報をクライアントに公開**
  ```typescript
  throw new AppError(code, message, HttpStatus.NOT_FOUND, ['id'], {
    databaseError: err, // ❌ クライアントに見えてしまう
  });
  ```

## トラブルシューティング

### エラーコードが見つからない

`error-codes.json` にエラーコードが定義されているか確認：

```typescript
// 定義されていない場合
getMessage('999'); // "Unknown error: 999" が返される
```

### メッセージが正しくフォーマットされない

プレースホルダ数とパラメータ数が一致しているか確認：

```typescript
// テンプレート: "[0]と[1]が一致しません。"
getMessage('005', 'password'); // ❌ パラメータが不足
getMessage('005', 'password', 'confirmPassword'); // ✅ 正しい
```

### 言語が適用されない

`setLanguage()` を呼び出した後に `getMessage()` を使用しているか確認：

```typescript
errorCodeManager.setLanguage('en');
const msg = getMessage('001', 'item'); // ✅ 英語で返される
```

## 参考

- [エラーハンドリング工場関数ガイド](./error-factories.md)
- [エラーレスポンス形式ガイド](../response/error-response.md)
- [エラーコード設定ファイル](../../src/config/error-codes.json)
- [ErrorCodeManager クラス](../../src/common/errors/error-code-manager.ts)
