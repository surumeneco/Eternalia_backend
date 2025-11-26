# エラーレスポンス形式ガイド

## 概要

全ての API エラーレスポンスは統一された形式で返却されます。  
この形式は `AllExceptionsFilter` により自動的に適用されます。

## 成功レスポンス

### 標準形式

```json
{
  "status": "success",
  "code": 200,
  "data": {
    // レスポンスデータ
  },
  "meta": {
    "requestId": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### 例：Tip 情報取得

```bash
GET /api/tip/categories/MyCategory/manage-detail
```

**レスポンス (200 OK)**

```json
{
  "status": "success",
  "code": 200,
  "data": {
    "categoryName": "MyCategory",
    "description": "カテゴリの説明",
    "status": "PUBLISHED"
  },
  "meta": {
    "requestId": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

## エラーレスポンス

### 標準形式

```json
{
  "status": "error",
  "message": "最初のエラーメッセージ",
  "code": 400,
  "error": [
    {
      "code": "ET-DOMAIN-001",
      "message": "エラーメッセージ",
      "fields": ["field1", "field2"]
    }
  ],
  "meta": {
    "requestId": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### フィールド説明

| フィールド        | 型       | 説明                                         |
| ----------------- | -------- | -------------------------------------------- |
| `status`          | string   | エラー時は常に `"error"`                     |
| `message`         | string   | 最初のエラーメッセージ（クライアント表示用） |
| `code`            | number   | HTTP ステータスコード                        |
| `error`           | array    | エラーオブジェクトの配列                     |
| `error[].code`    | string   | エラーコード（ET-{DOMAIN}-{NUMBER}）         |
| `error[].message` | string   | エラーメッセージ                             |
| `error[].fields`  | string[] | エラーが関連するフィールド                   |
| `meta.requestId`  | string   | リクエスト ID（デバッグ用）                  |

## エラーレスポンス例

### 404 Not Found

```bash
GET /api/tip/categories/NonExistent/manage-detail
```

**レスポンス (404 Not Found)**

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

### 400 Bad Request - 単一フィールドエラー

```bash
POST /api/tip/categories
Content-Type: application/json

{
  "CategoryName": "NewCategory",
  "PublicationState": "INVALID_STATE"
}
```

**レスポンス (400 Bad Request)**

```json
{
  "status": "error",
  "message": "PublicationStateが不正です。",
  "code": 400,
  "error": [
    {
      "code": "ET-TIP-002",
      "message": "PublicationStateが不正です。",
      "fields": ["PublicationState"]
    }
  ],
  "meta": {
    "requestId": "550e8400-e29b-41d4-a716-446655440001"
  }
}
```

### 400 Bad Request - 複数フィールドエラー

```bash
POST /api/tip/register
Content-Type: application/json

{
  "Description": "説明のみ指定"
}
```

**レスポンス (400 Bad Request)**

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
    "requestId": "550e8400-e29b-41d4-a716-446655440002"
  }
}
```

### 409 Conflict - リソース既存エラー

```bash
POST /api/tip/categories
Content-Type: application/json

{
  "CategoryName": "ExistingCategory"
}
```

**レスポンス (409 Conflict)**

```json
{
  "status": "error",
  "message": "categoryは既に登録されています。",
  "code": 409,
  "error": [
    {
      "code": "ET-TIP-007",
      "message": "categoryは既に登録されています。",
      "fields": ["CategoryName"]
    }
  ],
  "meta": {
    "requestId": "550e8400-e29b-41d4-a716-446655440003"
  }
}
```

### 500 Internal Server Error

```bash
POST /api/tip/register
Content-Type: application/json

{
  "Category": "SomeCategory",
  "Name": "SomeName",
  "PublicationDateTime": "2025-01-01T00:00:00Z"
}
```

**レスポンス (500 Internal Server Error)**

```json
{
  "status": "error",
  "message": "registrationが失敗しました。",
  "code": 500,
  "error": [
    {
      "code": "ET-TIP-008",
      "message": "registrationが失敗しました。",
      "fields": []
    }
  ],
  "meta": {
    "requestId": "550e8400-e29b-41d4-a716-446655440004"
  }
}
```

## HTTP ステータスコード

| コード | 意味                  | エラーコード | 例                                   |
| ------ | --------------------- | ------------ | ------------------------------------ |
| 200    | OK                    | -            | 正常に完了                           |
| 400    | Bad Request           | 002-006, 010 | 不正なパラメータ、バリデーション失敗 |
| 404    | Not Found             | 001          | リソースが見つからない               |
| 409    | Conflict              | 007          | リソースが既に存在                   |
| 500    | Internal Server Error | 008          | データベースエラー、システムエラー   |

## RequestId について

### 用途

各リクエストには一意の `RequestId`（UUID）が割り当てられます。

- **デバッグ**: サーバーログと組み合わせて、特定リクエストのログを追跡
- **監査**: リクエストの履歴管理
- **キャッシング**: キャッシュキーとして使用可能

### クライアント側での使用

レスポンスの `meta.requestId` はすべてのレスポンス（成功・エラー）に含まれます：

```typescript
// フロントエンド例
const response = await fetch('/api/tip/categories/MyCategory/manage-detail');
const json = await response.json();

console.log('Request ID:', json.meta.requestId); // キャッシュ或いはログに記録
```

### ヘッダーでの確認

レスポンスヘッダの `X-Request-Id` からも確認可能：

```http
HTTP/1.1 200 OK
X-Request-Id: 550e8400-e29b-41d4-a716-446655440000
Content-Type: application/json

{...}
```

## クライアント側のエラーハンドリング例

### TypeScript + fetch

```typescript
interface ApiResponse<T> {
  status: 'success' | 'error';
  code: number;
  data?: T;
  error?: Array<{
    code: string;
    message: string;
    fields?: string[];
  }>;
  meta: {
    requestId: string;
  };
}

async function fetchTipCategory(
  categoryName: string,
): Promise<CategoryInfo | null> {
  try {
    const response = await fetch(
      `/api/tip/categories/${categoryName}/manage-detail`,
    );
    const json = (await response.json()) as ApiResponse<CategoryInfo>;

    if (!response.ok) {
      // エラー処理
      console.error(
        `Error [${json.meta.requestId}]:`,
        json.error?.[0]?.message,
      );

      if (response.status === 404) {
        console.error('Category not found');
      } else if (response.status === 400) {
        console.error('Invalid parameters:', json.error?.[0]?.fields);
      }

      return null;
    }

    return json.data || null;
  } catch (error) {
    console.error('Network error:', error);
    return null;
  }
}
```

### React + axios

```typescript
import axios, { AxiosError } from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse<any>>) => {
    const requestId = error.response?.data?.meta?.requestId;
    const errorMessage = error.response?.data?.error?.[0]?.message;

    console.error(`[${requestId}] ${errorMessage}`);

    // グローバルエラーハンドリング
    if (error.response?.status === 404) {
      // リソース不存在
    } else if (error.response?.status === 400) {
      // バリデーションエラー
    } else if (error.response?.status === 500) {
      // サーバーエラー
    }

    return Promise.reject(error);
  },
);
```

## ベストプラクティス

### DO ✅

- **error 配列を反復処理して全エラーを表示**

  ```typescript
  for (const err of response.error) {
    console.error(`[${err.code}] ${err.message}`);
  }
  ```

- **RequestId をエラーログに含める**

  ```typescript
  logger.error({
    requestId: response.meta.requestId,
    message: response.error[0].message,
    fields: response.error[0].fields,
  });
  ```

- **field に基づいて UI を更新**
  ```typescript
  const fieldsInError = response.error[0].fields || [];
  fieldsInError.forEach((field) => {
    markFieldAsError(field);
  });
  ```

### DON'T ❌

- **message フィールドのみを使用**

  ```typescript
  alert(response.message); // ❌ error 配列から詳細情報を落としている
  ```

- **RequestId を無視**

  ```typescript
  console.error(response.error[0].message); // ❌ トレーサビリティ失失
  ```

- **エラー配列の複数要素を無視**
  ```typescript
  const firstError = response.error[0]; // ❌ 他のエラーを見落とす
  ```

## 参考

- [エラーコード管理ガイド](../error/error-codes.md)
- [エラーハンドリング工場関数](../error/error-factories.md)
- [AllExceptionsFilter](../../src/common/filters/all-exceptions.filter.ts)
- [ResponseInterceptor](../../src/common/interceptors/response.interceptor.ts)
