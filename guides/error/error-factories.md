# エラーハンドリング工場関数

## 概要

エラーハンドリング工場関数は、一貫性のあるエラーオブジェクトを生成し、適切なエラーコードと HTTP ステータスを自動的に割り当てます。

ファイルパス: `src/common/errors/error-factories.ts`

## 利用可能な工場関数

### 1. throwNotFound()

リソースが見つからない場合のエラー（404）

**シグネチャ**

```typescript
throwNotFound(
  domain: string,
  itemName: string,
  fields?: string[],
  details?: any,
): never
```

**エラーコード**: `ET-{DOMAIN}-001`  
**HTTP ステータス**: `404 Not Found`

**例**

```typescript
import { throwNotFound } from '../common/errors/error-factories';

async selectCategoryManageDetail(categoryName: string): Promise<Category> {
  const category = await this.tipEntityService.findCategoryManageDetail(categoryName);

  if (!category) {
    throwNotFound('TIP', 'category', ['categoryName']);
    // エラー: ET-TIP-001, "categoryが見つかりません。"
  }

  return category;
}
```

---

### 2. throwInvalidField()

フィールド値が不正な場合のエラー（400）

**シグネチャ**

```typescript
throwInvalidField(
  domain: string,
  fieldName: string,
  fields?: string[],
  details?: any,
): never
```

**エラーコード**: `ET-{DOMAIN}-002`  
**HTTP ステータス**: `400 Bad Request`

**例**

```typescript
async registerCategory(payload: RegisterCategoryDto): Promise<void> {
  const validStates = ['DRAFT', 'PUBLISHED', 'ARCHIVED'];

  if (!validStates.includes(payload.PublicationState)) {
    throwInvalidField('TIP', 'PublicationState', ['PublicationState'], {
      allowedValues: validStates,
      providedValue: payload.PublicationState,
    });
    // エラー: ET-TIP-002, "PublicationStateが不正です。"
  }
}
```

---

### 3. throwRequiredField()

必須フィールドが不足している場合のエラー（400）

**シグネチャ**

```typescript
throwRequiredField(
  domain: string,
  fieldName: string,
  fields?: string[],
  details?: any,
): never
```

**エラーコード**: `ET-{DOMAIN}-003`  
**HTTP ステータス**: `400 Bad Request`

**例**

```typescript
async selectManageInfo(filter: SelectManageInfoDto): Promise<ManageInfo> {
  if (!filter.CategoryName) {
    throwRequiredField('TIP', 'CategoryName', ['CategoryName']);
    // エラー: ET-TIP-003, "CategoryNameが必須です。"
  }

  return await this.tipEntityService.findManageInfo(filter.CategoryName);
}

// 複数フィールドが必須の場合
async registerTip(payload: RegisterTipDto): Promise<void> {
  const errors: string[] = [];

  if (!payload.Category) errors.push('Category');
  if (!payload.Name) errors.push('Name');
  if (!payload.PublicationDateTime) errors.push('PublicationDateTime');

  if (errors.length > 0) {
    throwRequiredField('TIP', errors.join(', '), errors);
    // エラー: ET-TIP-003, "Category, Name, PublicationDateTimeが必須です。"
    // fields: ['Category', 'Name', 'PublicationDateTime']
  }
}
```

---

### 4. throwInvalidFormat()

フィールド形式が不正な場合のエラー（400）

**シグネチャ**

```typescript
throwInvalidFormat(
  domain: string,
  fieldName: string,
  fields?: string[],
  details?: any,
): never
```

**エラーコード**: `ET-{DOMAIN}-004`  
**HTTP ステータス**: `400 Bad Request`

**例**

```typescript
async registerTip(payload: RegisterTipDto): Promise<void> {
  try {
    const date = new Date(payload.PublicationDateTime);
    if (isNaN(date.getTime())) throw new Error();
  } catch {
    throwInvalidFormat('TIP', 'PublicationDateTime', ['PublicationDateTime'], {
      expectedFormat: 'ISO 8601',
      providedValue: payload.PublicationDateTime,
    });
    // エラー: ET-TIP-004, "PublicationDateTimeが不正です。"
  }
}
```

---

### 5. throwInvalidDateRange()

日付範囲が不正な場合のエラー（400）  
特に From > To のような逆順の場合

**シグネチャ**

```typescript
throwInvalidDateRange(
  domain: string,
  fields?: string[],
  details?: any,
): never
```

**エラーコード**: `ET-{DOMAIN}-005`  
**HTTP ステータス**: `400 Bad Request`

**例**

```typescript
async selectCategoryManageInfo(filter: SelectManageInfoDto): Promise<any> {
  if (filter.PublicationDateTime?.From && filter.PublicationDateTime?.To) {
    const fromDate = new Date(filter.PublicationDateTime.From);
    const toDate = new Date(filter.PublicationDateTime.To);

    if (fromDate > toDate) {
      throwInvalidDateRange('TIP', ['PublicationDateTime'], {
        from: filter.PublicationDateTime.From,
        to: filter.PublicationDateTime.To,
        reason: 'From date must be earlier than To date',
      });
      // エラー: ET-TIP-005, "無効な日付範囲が指定されました。"
    }
  }

  return await this.tipEntityService.selectManageInfo(filter);
}
```

---

### 6. throwInvalidParameter()

リクエストパラメータが不正な場合のエラー（400）

**シグネチャ**

```typescript
throwInvalidParameter(
  domain: string,
  paramName: string,
  fields?: string[],
  details?: any,
): never
```

**エラーコード**: `ET-{DOMAIN}-006`  
**HTTP ステータス**: `400 Bad Request`

**例**

```typescript
async selectPublicInfo(
  @Query('filter') filter?: string,
  @Query('sort') sort?: string,
): Promise<PublicInfo> {
  const validSortFields = ['name', 'date', 'relevance'];

  if (sort && !validSortFields.includes(sort)) {
    throwInvalidParameter('TIP', 'sort', ['sort'], {
      allowedValues: validSortFields,
      providedValue: sort,
    });
    // エラー: ET-TIP-006, "sortが不正です。"
  }

  return await this.tipService.selectPublicInfo(filter, sort);
}
```

---

### 7. throwAlreadyExists()

リソースが既に存在する場合のエラー（409）

**シグネチャ**

```typescript
throwAlreadyExists(
  domain: string,
  itemName: string,
  fields?: string[],
  details?: any,
): never
```

**エラーコード**: `ET-{DOMAIN}-007`  
**HTTP ステータス**: `409 Conflict`

**例**

```typescript
async registerCategory(payload: RegisterCategoryDto): Promise<void> {
  const existing = await this.tipEntityService.findCategoryByName(
    payload.CategoryName,
  );

  if (existing) {
    throwAlreadyExists('TIP', 'category', ['CategoryName'], {
      existingId: existing.id,
      providedName: payload.CategoryName,
    });
    // エラー: ET-TIP-007, "categoryは既に登録されています。"
  }

  await this.tipEntityService.createCategory(payload);
}
```

---

### 8. throwOperationFailed()

操作に失敗した場合のエラー（500）  
データベース操作やシステムエラーなど

**シグネチャ**

```typescript
throwOperationFailed(
  domain: string,
  operation: string,
  fields?: string[],
  details?: any,
): never
```

**エラーコード**: `ET-{DOMAIN}-008`  
**HTTP ステータス**: `500 Internal Server Error`

**例**

```typescript
async registerCategory(payload: RegisterCategoryDto): Promise<void> {
  try {
    await this.tipEntityService.createCategory(payload);
  } catch (error) {
    throwOperationFailed('TIP', 'category registration', undefined, {
      originalError: error.message,
      payload,
    });
    // エラー: ET-TIP-008, "category registrationが失敗しました。"
  }
}
```

---

### 9. throwCustomError()

完全にカスタムなエラーを作成する場合

**シグネチャ**

```typescript
throwCustomError(
  domain: string,
  errorCode: string,
  message: string,
  httpStatus?: number,
  fields?: string[],
  details?: any,
): never
```

**エラーコード**: `ET-{DOMAIN}-{errorCode}`  
**HTTP ステータス**: 指定値またはデフォルト 400

**例**

```typescript
async registerTip(payload: RegisterTipDto): Promise<void> {
  if (someComplexValidation(payload)) {
    throwCustomError(
      'TIP',
      '009',
      'カスタムバリデーションに失敗しました。',
      HttpStatus.BAD_REQUEST,
      ['field1', 'field2'],
      { details: 'some details' },
    );
    // エラー: ET-TIP-009, "カスタムバリデーションに失敗しました。"
  }
}
```

---

### 10. throwValidationError()

汎用的なバリデーションエラー（GENERAL ドメイン）

**シグネチャ**

```typescript
throwValidationError(
  fieldName: string,
  errorCode?: string,
  fields?: string[],
  details?: any,
): never
```

**エラーコード**: `ET-GENERAL-{errorCode}` (デフォルト: 002)  
**HTTP ステータス**: `400 Bad Request`

**例**

```typescript
// デフォルト (ET-GENERAL-002)
if (!user.email) {
  throwValidationError('email', '003', ['email']);
  // エラー: ET-GENERAL-003, "emailが必須です。"
}

// カスタムエラーコード
if (invalidFormat) {
  throwValidationError('phone', '004', ['phone'], {
    expectedFormat: 'XXX-XXXX-XXXX',
  });
  // エラー: ET-GENERAL-004, "phoneが不正です。"
}
```

---

## ベストプラクティス

### 複数フィールドのエラー処理

複数フィールドにエラーがある場合は、`fields` 配列に全てのフィールドを含める：

```typescript
const validationErrors: string[] = [];

if (!payload.name) validationErrors.push('name');
if (!payload.email) validationErrors.push('email');
if (!payload.phone) validationErrors.push('phone');

if (validationErrors.length > 0) {
  throwRequiredField('TIP', validationErrors.join(', '), validationErrors);
}
```

### 詳細情報の活用

`details` パラメータにはクライアントに表示されない情報を格納：

```typescript
throwInvalidField('TIP', 'status', ['status'], {
  allowedValues: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
  providedValue: inputValue,
  databaseError: originalError?.message, // クライアントには見えない
  timestamp: new Date().toISOString(),
});
```

### エラーチェーン

複数の工場関数を組み合わせる場合は、最初のエラーで処理を停止：

```typescript
// ❌ 複数のエラーが発生する可能性
if (!payload.name) throwRequiredField(...);
if (!payload.date) throwRequiredField(...); // 実行されない
if (isInvalidDate) throwInvalidFormat(...);  // 実行されない

// ✅ 全てのバリデーションを実施してから一度に報告
const errors: string[] = [];
if (!payload.name) errors.push('name');
if (!payload.date) errors.push('date');
if (errors.length > 0) throwRequiredField(..., errors);

if (isInvalidDate) throwInvalidFormat(...);
```

## 参考

- [エラーコード管理ガイド](./error-codes.md)
- [エラーレスポンス形式ガイド](../response/error-response.md)
- [AppError クラス](../../src/common/errors/app-errors.ts)
