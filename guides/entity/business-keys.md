# ビジネスキーガイド

## 概要

Eternalia_backend では、**ビジネスキー** を用いた検索・更新・削除を採用しています。  
自動採番 ID ではなく、ドメイン固有の意味のある情報（カテゴリ名、Tip 名など）をプライマリキーとして使用します。

## ビジネスキーとは

### 定義

ビジネスキーは、リソースを一意に識別する、ビジネス的に意味のある情報です。

| リソース | ビジネスキー           | 例                      |
| -------- | ---------------------- | ----------------------- |
| 言語     | LanguageCode           | `en`, `ja`, `fr`        |
| カテゴリ | CategoryName           | `物理学`, `化学`        |
| Tip      | CategoryName + TipName | `物理学` + `相対性理論` |

### 利点

✅ **人間可読性**: ID より意味が明確  
✅ **キャッシング**: キーそのものが有意な情報  
✅ **URL フレンドリー**: `/categories/物理学/tips/相対性理論`  
✅ **データ整合性**: 外部キーが自動的に一貫性を保つ

### デメリット

❌ **更新困難**: ビジネスキー変更時に全リレーション更新が必要  
❌ **複合キー**: 複数カラムの場合、クエリが複雑に  
❌ **スケーラビリティ**: キーが長い場合、インデックスが増大

## ビジネスキーの種類

### 1. 単一カラムキー

```typescript
@Entity({ name: 'M_Language' })
export class MLanguage {
  @PrimaryColumn({ type: 'varchar', length: 10 })
  LanguageCode: string; // EN, JA, FR など
}
```

**使用例**:

```typescript
const language = await languageEntityService.findByPrimaryKey('EN');
```

### 2. 複合キー（2 カラム）

```typescript
@Entity({ name: 'M_Category' })
export class MCategory {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  DivisionID: string; // ビジネスユニット

  @PrimaryColumn({ type: 'varchar', length: 100 })
  CategoryName: string; // カテゴリ名
}
```

**使用例**:

```typescript
const category = await categoryEntityService.findByBusinessKey(
  'BUSINESS_UNIT_A',
  'Physics',
);
```

### 3. 複合キー（3 カラム以上）

```typescript
@Entity({ name: 'D_Tip' })
export class DTip {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  DivisionID: string;

  @PrimaryColumn({ type: 'varchar', length: 100 })
  CategoryName: string;

  @PrimaryColumn({ type: 'varchar', length: 100 })
  TipName: string; // Tip の名前
}
```

**使用例**:

```typescript
const tip = await tipEntityService.findByBusinessKey(
  'BUSINESS_UNIT_A',
  'Physics',
  'Theory of Relativity',
);
```

## エンティティサービスでの実装

### findByPrimaryKey - 単一キー検索

```typescript
async findByPrimaryKey(code: string): Promise<MLanguage | null> {
  return await this.languageRepository.findOneBy({
    LanguageCode: code,
  });
}
```

**使用例**:

```typescript
const language = await this.languageEntityService.findByPrimaryKey('EN');
if (!language) {
  throwNotFound('LANGUAGE', 'language', ['LanguageCode']);
}
```

### findByBusinessKey - 複合キー検索

```typescript
// 2 カラムキー
async findByBusinessKey(
  divisionID: string,
  categoryName: string,
): Promise<MCategory | null> {
  return await this.categoryRepository.findOneBy({
    DivisionID: divisionID,
    CategoryName: categoryName,
  });
}

// 3 カラムキー
async findByBusinessKey(
  divisionID: string,
  categoryName: string,
  tipName: string,
): Promise<DTip | null> {
  return await this.tipRepository.findOneBy({
    DivisionID: divisionID,
    CategoryName: categoryName,
    TipName: tipName,
  });
}
```

**使用例**:

```typescript
const category = await this.categoryEntityService.findByBusinessKey(
  'UNIT_A',
  'Physics',
);

const tip = await this.tipEntityService.findByBusinessKey(
  'UNIT_A',
  'Physics',
  'Relativity',
);
```

### updateByBusinessKey - ビジネスキーでの更新

```typescript
// 複合キーで更新（キー自体は変更しない）
async updateByBusinessKey(
  divisionID: string,
  categoryName: string,
  updates: Partial<MCategory>,
): Promise<void> {
  await this.categoryRepository.update(
    {
      DivisionID: divisionID,
      CategoryName: categoryName,
    },
    updates,
  );
}
```

**使用例**:

```typescript
await this.categoryEntityService.updateByBusinessKey('UNIT_A', 'Physics', {
  Description: '物理学のカテゴリです。',
  UpdatedAt: new Date(),
});
```

### deleteByBusinessKey - ビジネスキーでの削除

```typescript
async deleteByBusinessKey(
  divisionID: string,
  categoryName: string,
): Promise<void> {
  await this.categoryRepository.delete({
    DivisionID: divisionID,
    CategoryName: categoryName,
  });
}
```

**使用例**:

```typescript
await this.categoryEntityService.deleteByBusinessKey('UNIT_A', 'Physics');
```

## サービス層での使用

### 検索と存在確認

```typescript
async selectManageDetail(categoryName: string): Promise<CategoryDetail> {
  // ビジネスキーで検索
  const category = await this.categoryEntityService.findByBusinessKey(
    'DEFAULT_UNIT',
    categoryName,
  );

  // 存在確認
  if (!category) {
    throwNotFound('TIP', 'category', ['categoryName']);
  }

  return {
    categoryName: category.CategoryName,
    description: category.Description,
  };
}
```

### 更新と重複チェック

```typescript
async updateCategory(
  categoryName: string,
  payload: UpdateCategoryDto,
): Promise<void> {
  // 現在のカテゴリを確認
  const existing = await this.categoryEntityService.findByBusinessKey(
    'DEFAULT_UNIT',
    categoryName,
  );

  if (!existing) {
    throwNotFound('TIP', 'category', ['categoryName']);
  }

  // 新しい名前に変更する場合、重複確認
  if (payload.NewCategoryName && payload.NewCategoryName !== categoryName) {
    const duplicate = await this.categoryEntityService.findByBusinessKey(
      'DEFAULT_UNIT',
      payload.NewCategoryName,
    );

    if (duplicate) {
      throwAlreadyExists('TIP', 'category', ['NewCategoryName']);
    }
  }

  // 更新
  await this.categoryEntityService.updateByBusinessKey(
    'DEFAULT_UNIT',
    categoryName,
    {
      CategoryName: payload.NewCategoryName || categoryName,
      Description: payload.Description,
    },
  );
}
```

### 削除とカスケード

```typescript
async deleteCategory(categoryName: string): Promise<void> {
  // カテゴリ存在確認
  const existing = await this.categoryEntityService.findByBusinessKey(
    'DEFAULT_UNIT',
    categoryName,
  );

  if (!existing) {
    throwNotFound('TIP', 'category', ['categoryName']);
  }

  // カテゴリ配下の Tip をすべて削除
  await this.tipEntityService.deleteMany({
    CategoryName: categoryName,
  });

  // カテゴリ自体を削除
  await this.categoryEntityService.deleteByBusinessKey(
    'DEFAULT_UNIT',
    categoryName,
  );
}
```

## コントローラでの使用

### URL パラメータとビジネスキー

```typescript
@Get('/categories/:categoryName/manage-detail')
async selectManageDetail(
  @Param('categoryName') categoryName: string,
): Promise<any> {
  return await this.tipService.selectManageDetail(categoryName);
}

@Put('/categories/:categoryName')
async updateCategory(
  @Param('categoryName') categoryName: string,
  @Body() payload: UpdateCategoryDto,
): Promise<void> {
  await this.tipService.updateCategory(categoryName, payload);
}

@Delete('/categories/:categoryName')
async deleteCategory(
  @Param('categoryName') categoryName: string,
): Promise<void> {
  await this.tipService.deleteCategory(categoryName);
}
```

### 複合ビジネスキー

```typescript
@Get('/categories/:categoryName/tips/:tipName')
async selectTip(
  @Param('categoryName') categoryName: string,
  @Param('tipName') tipName: string,
): Promise<TipDetail> {
  return await this.tipService.selectTipDetail(categoryName, tipName);
}

@Put('/categories/:categoryName/tips/:tipName')
async updateTip(
  @Param('categoryName') categoryName: string,
  @Param('tipName') tipName: string,
  @Body() payload: UpdateTipDto,
): Promise<void> {
  await this.tipService.updateTip(categoryName, tipName, payload);
}

@Delete('/categories/:categoryName/tips/:tipName')
async deleteTip(
  @Param('categoryName') categoryName: string,
  @Param('tipName') tipName: string,
): Promise<void> {
  await this.tipService.deleteTip(categoryName, tipName);
}
```

## Eternalia_backend でのビジネスキー

### Tip ドメイン

| エンティティ | ビジネスキー           | 説明                        |
| ------------ | ---------------------- | --------------------------- |
| M_Category   | CategoryName           | カテゴリの名前              |
| M_Class      | ClassName              | クラスの名前                |
| M_Tag        | TagID                  | タグ ID                     |
| D_Tip        | CategoryName + TipName | カテゴリと Tip 名の複合キー |
| D_TipSection | TipName + SectionName  | Tip と Section の複合キー   |

### Story ドメイン

| エンティティ   | ビジネスキー            | 説明                         |
| -------------- | ----------------------- | ---------------------------- |
| D_StoryVolume  | VolumeName              | ボリュームの名前             |
| D_StoryPart    | VolumeName + PartName   | ボリュームとパート名         |
| D_StoryChapter | PartName + ChapterName  | パートとチャプター名         |
| D_StoryBody    | ChapterName + BodyIndex | チャプターと本体インデックス |

### Language ドメイン

| エンティティ        | ビジネスキー             | 説明                      |
| ------------------- | ------------------------ | ------------------------- |
| D_Language          | LanguageCode             | 言語コード（EN, JA など） |
| D_LanguageWord      | LanguageCode + Word      | 言語とワード              |
| D_LanguageMean      | LanguageCode + Mean      | 言語と意味                |
| D_LanguageEtymology | LanguageCode + Etymology | 言語と語源                |

## 注意事項

### ❌ ビジネスキーの変更は慎重に

```typescript
// ❌ 危険：ビジネスキーを直接変更すると、リレーション先の参照が破損
await categoryRepository.update(
  { CategoryName: 'Old' },
  { CategoryName: 'New' }, // リレーション先の Tip が orphan に
);
```

### ✅ 参照整合性を保つ

```typescript
// ✅ 正しい：関連レコードも一緒に更新
await manager.transaction(async (tx) => {
  // 関連 Tip を更新
  await tx
    .getRepository(DTip)
    .update({ CategoryName: 'Old' }, { CategoryName: 'New' });
  // カテゴリを更新
  await tx
    .getRepository(MCategory)
    .update({ CategoryName: 'Old' }, { CategoryName: 'New' });
});
```

### NULL キーは使用不可

```typescript
// ❌ NULL がプライマリキーにできない
@PrimaryColumn({ type: 'varchar', nullable: true })
CategoryName: string | null;

// ✅ NOT NULL をデフォルトに
@PrimaryColumn({ type: 'varchar', length: 100 })
CategoryName: string; // 常に値が必須
```

## ベストプラクティス

### DO ✅

- **ビジネスキーは不変に設計**

  ```typescript
  // ✅ 固定値として使用
  const categoryName = 'Physics';
  ```

- **複合キーは順序を固定**

  ```typescript
  // ✅ 常に同じ順序
  async findByBusinessKey(
    divisionID: string,
    categoryName: string,
    tipName: string,
  )
  ```

- **存在確認してから操作**
  ```typescript
  // ✅ 見つからない場合エラー
  if (!existing) throwNotFound(...);
  ```

### DON'T ❌

- **ビジネスキーの変更を頻繁に**

  ```typescript
  // ❌ 参照整合性が複雑に
  ```

- **生 SQL で ID ベース検索**

  ```typescript
  // ❌ ビジネスキーの利点が失われる
  const query = 'SELECT * FROM D_Tip WHERE id = ' + tipId;
  ```

- **複合キーの一部のみで検索**
  ```typescript
  // ❌ 部分的に検索すると一意性がない
  const tips = await tipRepository.findBy({ TipName: 'Relativity' });
  ```

## 参考

- [エンティティ設定ガイド](./entity-setup.md)
- [CRUD 操作ガイド](./crud-operations.md)
- [TypeORM FindBy API](https://typeorm.io/find-options)
