# CRUD 操作ガイド

## 概要

CRUD（Create, Read, Update, Delete）操作はすべてエンティティサービス層で実装されます。

## CREATE（作成）

### 単一レコード挿入

```typescript
// src/entity/tip-entity/tip-entity.service.ts

async create(data: Partial<DTip>): Promise<DTip> {
  const entity = this.tipRepository.create(data);
  return await this.tipRepository.save(entity);
}
```

**使用例**:

```typescript
// src/tip/tip.service.ts
async registerTip(payload: RegisterTipDto): Promise<void> {
  const tip = await this.tipEntityService.create({
    CategoryName: payload.CategoryName,
    TipName: payload.TipName,
    Description: payload.Description,
    PublicationState: 'DRAFT',
  });
}
```

### 複数レコード一括挿入

```typescript
async createMany(dataArray: Partial<DTip>[]): Promise<DTip[]> {
  const entities = this.tipRepository.create(dataArray);
  return await this.tipRepository.save(entities);
}
```

**使用例**:

```typescript
const tips = await this.tipEntityService.createMany([
  { CategoryName: 'category1', TipName: 'tip1' },
  { CategoryName: 'category1', TipName: 'tip2' },
  { CategoryName: 'category2', TipName: 'tip3' },
]);
```

### エラーハンドリング付き挿入

```typescript
async registerCategoryWithValidation(
  payload: RegisterCategoryDto,
): Promise<void> {
  // 重複チェック
  const existing = await this.tipEntityService.findByBusinessKey(
    payload.CategoryName,
  );
  if (existing) {
    throwAlreadyExists('TIP', 'category', ['CategoryName']);
  }

  // 挿入
  try {
    await this.tipEntityService.create({
      CategoryName: payload.CategoryName,
      Description: payload.Description,
    });
  } catch (error) {
    throwOperationFailed('TIP', 'category creation', undefined, {
      error: error.message,
    });
  }
}
```

## READ（読み込み）

### プライマリキーで検索

```typescript
async findByPrimaryKey(tipName: string): Promise<DTip | null> {
  return await this.tipRepository.findOneBy({ TipName: tipName });
}
```

**使用例**:

```typescript
const tip = await this.tipEntityService.findByPrimaryKey('MyTip');
if (!tip) {
  throwNotFound('TIP', 'tip', ['TipName']);
}
```

### ビジネスキーで検索

```typescript
async findByBusinessKey(
  categoryName: string,
  tipName: string,
): Promise<DTip | null> {
  return await this.tipRepository.findOneBy({
    CategoryName: categoryName,
    TipName: tipName,
  });
}
```

**使用例**:

```typescript
const tip = await this.tipEntityService.findByBusinessKey(
  'MyCategory',
  'MyTip',
);
```

### リレーション付き検索

```typescript
async findWithRelations(tipName: string): Promise<DTip | null> {
  return await this.tipRepository.findOne({
    where: { TipName: tipName },
    relations: ['sections', 'tags', 'category'],
  });
}
```

**使用例**:

```typescript
const tip = await this.tipEntityService.findWithRelations('MyTip');
console.log(tip?.sections); // DTipSection[]
console.log(tip?.tags); // DTipTag[]
```

### 全件検索

```typescript
async findAll(): Promise<DTip[]> {
  return await this.tipRepository.find();
}

// ページング付き
async findPaginated(
  page: number = 1,
  limit: number = 10,
): Promise<{ data: DTip[]; total: number }> {
  const [data, total] = await this.tipRepository.findAndCount({
    skip: (page - 1) * limit,
    take: limit,
  });
  return { data, total };
}
```

**使用例**:

```typescript
const { data, total } = await this.tipEntityService.findPaginated(1, 20);
console.log(`Total: ${total}, Returned: ${data.length}`);
```

### 条件付き検索

```typescript
async findByConditions(conditions: Partial<DTip>): Promise<DTip[]> {
  return await this.tipRepository.findBy(conditions);
}

// QueryBuilder 使用
async findWithFilters(
  categoryName?: string,
  status?: string,
  dateFrom?: Date,
  dateTo?: Date,
): Promise<DTip[]> {
  let query = this.tipRepository.createQueryBuilder('tip');

  if (categoryName) {
    query = query.where('tip.CategoryName = :categoryName', { categoryName });
  }

  if (status) {
    query = query.andWhere('tip.Status = :status', { status });
  }

  if (dateFrom && dateTo) {
    query = query.andWhere(
      'tip.CreatedAt BETWEEN :dateFrom AND :dateTo',
      { dateFrom, dateTo },
    );
  }

  return await query.getMany();
}
```

**使用例**:

```typescript
const tips = await this.tipEntityService.findWithFilters(
  'MyCategory',
  'PUBLISHED',
  new Date('2025-01-01'),
  new Date('2025-12-31'),
);
```

## UPDATE（更新）

### 単一フィールド更新

```typescript
async updateByBusinessKey(
  categoryName: string,
  tipName: string,
  updates: Partial<DTip>,
): Promise<void> {
  await this.tipRepository.update(
    { CategoryName: categoryName, TipName: tipName },
    updates,
  );
}
```

**使用例**:

```typescript
await this.tipEntityService.updateByBusinessKey('MyCategory', 'MyTip', {
  Status: 'PUBLISHED',
  UpdatedAt: new Date(),
});
```

### 複数レコード一括更新

```typescript
async updateMany(
  conditions: Partial<DTip>,
  updates: Partial<DTip>,
): Promise<void> {
  await this.tipRepository.update(conditions, updates);
}
```

**使用例**:

```typescript
// 特定カテゴリの全Tipのステータスを更新
await this.tipEntityService.updateMany(
  { CategoryName: 'MyCategory' },
  { Status: 'ARCHIVED' },
);
```

### エラーハンドリング付き更新

```typescript
async updateWithValidation(
  categoryName: string,
  tipName: string,
  payload: UpdateTipDto,
): Promise<void> {
  // 存在確認
  const existing = await this.tipEntityService.findByBusinessKey(
    categoryName,
    tipName,
  );
  if (!existing) {
    throwNotFound('TIP', 'tip', ['TipName']);
  }

  // 重複チェック（名前変更時）
  if (payload.NewTipName && payload.NewTipName !== tipName) {
    const duplicate = await this.tipEntityService.findByBusinessKey(
      categoryName,
      payload.NewTipName,
    );
    if (duplicate) {
      throwAlreadyExists('TIP', 'tip with new name', ['TipName']);
    }
  }

  // 更新
  try {
    await this.tipEntityService.updateByBusinessKey(
      categoryName,
      tipName,
      {
        TipName: payload.NewTipName || tipName,
        Description: payload.Description,
      },
    );
  } catch (error) {
    throwOperationFailed('TIP', 'tip update', undefined, {
      error: error.message,
    });
  }
}
```

## DELETE（削除）

### 単一レコード削除

```typescript
async deleteByBusinessKey(
  categoryName: string,
  tipName: string,
): Promise<void> {
  await this.tipRepository.delete({
    CategoryName: categoryName,
    TipName: tipName,
  });
}
```

**使用例**:

```typescript
await this.tipEntityService.deleteByBusinessKey('MyCategory', 'MyTip');
```

### 複数レコード削除

```typescript
async deleteMany(conditions: Partial<DTip>): Promise<void> {
  await this.tipRepository.delete(conditions);
}
```

**使用例**:

```typescript
// 特定カテゴリの全Tipを削除
await this.tipEntityService.deleteMany({ CategoryName: 'MyCategory' });

// ステータスが DRAFT の全Tipを削除
await this.tipEntityService.deleteMany({ Status: 'DRAFT' });
```

### エラーハンドリング付き削除

```typescript
async deleteWithValidation(
  categoryName: string,
  tipName: string,
): Promise<void> {
  // 存在確認
  const existing = await this.tipEntityService.findByBusinessKey(
    categoryName,
    tipName,
  );
  if (!existing) {
    throwNotFound('TIP', 'tip', ['TipName']);
  }

  // 関連レコード削除（必要な場合）
  await this.tipSectionEntityService.deleteMany({
    TipName: tipName,
  });
  await this.tipTagEntityService.deleteMany({
    TipName: tipName,
  });

  // 削除
  try {
    await this.tipEntityService.deleteByBusinessKey(categoryName, tipName);
  } catch (error) {
    throwOperationFailed('TIP', 'tip deletion', undefined, {
      error: error.message,
    });
  }
}
```

## トランザクション

複数の操作をまとめて実行し、エラー時はロールバック：

```typescript
async transferTipBetweenCategories(
  fromCategory: string,
  toCategory: string,
  tipName: string,
): Promise<void> {
  await this.tipRepository.manager.transaction(async (manager) => {
    // ソースカテゴリから削除
    await manager.getRepository(DTip).delete({
      CategoryName: fromCategory,
      TipName: tipName,
    });

    // ターゲットカテゴリに挿入
    await manager.getRepository(DTip).save({
      CategoryName: toCategory,
      TipName: tipName,
    });

    // 関連レコードの更新
    await manager.getRepository(DTipSection).update(
      { TipName: tipName },
      { UpdatedAt: new Date() },
    );
  });
}
```

## パフォーマンス最適化

### バッチ処理

大量データは バッチで処理：

```typescript
async importTipsInBatch(
  tips: Partial<DTip>[],
  batchSize: number = 1000,
): Promise<void> {
  for (let i = 0; i < tips.length; i += batchSize) {
    const batch = tips.slice(i, i + batchSize);
    await this.createMany(batch);
  }
}
```

### インデックス活用

QueryBuilder で最適なクエリを作成：

```typescript
// ❌ 非効率：全データ読込後フィルタ
const allTips = await this.tipRepository.find();
const filtered = allTips.filter((t) => t.Status === 'PUBLISHED');

// ✅ 効率的：WHERE で絞込
const tips = await this.tipRepository.findBy({ Status: 'PUBLISHED' });
```

## ベストプラクティス

### DO ✅

- **ビジネスキーで検索・更新・削除**

  ```typescript
  await this.tipEntityService.findByBusinessKey(categoryName, tipName);
  ```

- **必要なリレーションのみ読込**

  ```typescript
  relations: ['sections']; // 必要なものだけ
  ```

- **エラーハンドリングを含める**
  ```typescript
  if (!existing) throwNotFound(...);
  ```

### DON'T ❌

- **全件読込後にフィルタ**

  ```typescript
  const all = await this.tipRepository.find(); // ❌
  ```

- **不要なリレーション読込**

  ```typescript
  relations: ['sections', 'tags', 'category', 'all']; // ❌
  ```

- **トランザクションなし**で複数操作
  ```typescript
  await delete(...); // エラー時にデータ不整合
  await create(...);
  ```

## 参考

- [エンティティ設定ガイド](./entity-setup.md)
- [ビジネスキーガイド](./business-keys.md)
- [TypeORM Repository API](https://typeorm.io/working-with-repositories)
