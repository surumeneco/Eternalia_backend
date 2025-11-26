# TypeORM エンティティ設定ガイド

## 概要

Eternalia_backend では TypeORM 0.3 以上を使用し、DataSource インジェクションパターンでエンティティ管理を行います。

## エンティティ構造

### ファイル配置

```
src/entity/
├── general-entity/
│   ├── general-entity.module.ts
│   ├── general-entity.providers.ts
│   ├── general-entity.service.ts
│   ├── generals.ts (エンティティ定義)
│   └── ...
├── language-entity/
│   ├── language-entity.module.ts
│   ├── language-entity.providers.ts
│   ├── language-entity.service.ts
│   ├── language.ts (エンティティ定義)
│   └── ...
├── story-entity/
├── tip-entity/
└── ...
```

### エンティティネーミング規則

**ファイル名**: `{entity-name}.ts`
**クラス名**: `{EntityName}` (PascalCase)
**テーブル名**: `{TableName}` (通常は大文字、アンダースコア区切り)

例：

```typescript
// ファイル: generals.ts
@Entity({ name: 'M_Account' })
export class MAccount {
  @PrimaryColumn()
  AccountID: string;
}
```

## エンティティ定義

### 基本的なエンティティ

```typescript
import { Entity, PrimaryColumn, Column, Index } from 'typeorm';

@Entity({ name: 'M_Category' })
@Index('idx_category_name', ['CategoryName'])
export class MCategory {
  // プライマリキー（ビジネスキーとしても機能）
  @PrimaryColumn({ type: 'varchar', length: 100 })
  CategoryName: string;

  // 通常のカラム
  @Column({ type: 'varchar', length: 255 })
  Description: string;

  // デフォルト値付き
  @Column({ type: 'varchar', length: 50, default: 'ACTIVE' })
  Status: string;

  // Null 許可
  @Column({ type: 'varchar', nullable: true })
  Memo: string;

  // タイムスタンプ
  @Column({ type: 'datetime', default: () => 'GETDATE()' })
  CreatedAt: Date;

  @Column({
    type: 'datetime',
    default: () => 'GETDATE()',
    onUpdate: 'GETDATE()',
  })
  UpdatedAt: Date;
}
```

### リレーションを含むエンティティ

```typescript
import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';

@Entity({ name: 'D_Tip' })
export class DTip {
  @PrimaryColumn({ type: 'varchar', length: 100 })
  TipName: string;

  @Column({ type: 'varchar', length: 100 })
  CategoryName: string;

  // リレーション（OneToMany）
  @OneToMany(() => DTipSection, (section) => section.tip)
  sections: DTipSection[];

  // リレーション（ManyToOne）
  @ManyToOne(() => MCategory)
  @JoinColumn({ name: 'CategoryName', referencedColumnName: 'CategoryName' })
  category: MCategory;
}
```

## Provider 設定

エンティティごとに Repository を提供する `providers.ts` ファイル：

```typescript
// src/entity/tip-entity/tip-entity.providers.ts

import { DataSource } from 'typeorm';
import { DTip } from './tip.ts';
import { DTipSection } from './tip-section.ts';
import { DTipTag } from './tip-tag.ts';

export const tipEntityProviders = [
  {
    provide: 'TIP_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(DTip),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'TIP_SECTION_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(DTipSection),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'TIP_TAG_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(DTipTag),
    inject: ['DATA_SOURCE'],
  },
];
```

## サービス層

### エンティティサービス（CRUD 操作）

`{domain}-entity.service.ts` で基本的な CRUD 操作を実装：

```typescript
// src/entity/tip-entity/tip-entity.service.ts

import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { DTip } from './tip.ts';

@Injectable()
export class TipEntityService {
  constructor(
    @Inject('TIP_REPOSITORY')
    private tipRepository: Repository<DTip>,
  ) {}

  // ========== SELECT ==========

  /**
   * プライマリキーでエンティティを取得
   */
  async findByPrimaryKey(tipName: string): Promise<DTip | null> {
    return await this.tipRepository.findOneBy({ TipName: tipName });
  }

  /**
   * 複数フィールドで検索
   */
  async findByBusinessKey(
    categoryName: string,
    tipName: string,
  ): Promise<DTip | null> {
    return await this.tipRepository.findOneBy({
      CategoryName: categoryName,
      TipName: tipName,
    });
  }

  /**
   * リレーション付き取得
   */
  async findWithRelations(tipName: string): Promise<DTip | null> {
    return await this.tipRepository.findOne({
      where: { TipName: tipName },
      relations: ['sections', 'tags'],
    });
  }

  /**
   * 全件取得
   */
  async findAll(): Promise<DTip[]> {
    return await this.tipRepository.find();
  }

  // ========== INSERT ==========

  /**
   * 単一エンティティを挿入
   */
  async create(data: Partial<DTip>): Promise<DTip> {
    const entity = this.tipRepository.create(data);
    return await this.tipRepository.save(entity);
  }

  /**
   * 複数エンティティを一括挿入
   */
  async createMany(dataArray: Partial<DTip>[]): Promise<DTip[]> {
    const entities = this.tipRepository.create(dataArray);
    return await this.tipRepository.save(entities);
  }

  // ========== UPDATE ==========

  /**
   * ビジネスキーで更新
   */
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

  /**
   * 複数レコードを一括更新
   */
  async updateMany(
    conditions: Partial<DTip>,
    updates: Partial<DTip>,
  ): Promise<void> {
    await this.tipRepository.update(conditions, updates);
  }

  // ========== DELETE ==========

  /**
   * ビジネスキーで削除
   */
  async deleteByBusinessKey(
    categoryName: string,
    tipName: string,
  ): Promise<void> {
    await this.tipRepository.delete({
      CategoryName: categoryName,
      TipName: tipName,
    });
  }

  /**
   * 複数レコードを削除
   */
  async deleteMany(conditions: Partial<DTip>): Promise<void> {
    await this.tipRepository.delete(conditions);
  }
}
```

## モジュール設定

エンティティモジュールの設定例：

```typescript
// src/entity/tip-entity/tip-entity.module.ts

import { Module } from '@nestjs/common';
import { tipEntityProviders } from './tip-entity.providers';
import { TipEntityService } from './tip-entity.service';

@Module({
  providers: [...tipEntityProviders, TipEntityService],
  exports: [TipEntityService],
})
export class TipEntityModule {}
```

## マイグレーション

### マイグレーションファイルの作成

```bash
npm run migration:generate -- --name=AddTipTable
```

### マイグレーション実行

```bash
npm run migration:run
```

### ロールバック

```bash
npm run migration:revert
```

## データベース操作パターン

### クエリビルダーの使用

複雑なクエリは QueryBuilder を使用：

```typescript
async findWithFilters(
  categoryName?: string,
  status?: string,
): Promise<DTip[]> {
  let query = this.tipRepository.createQueryBuilder('tip');

  if (categoryName) {
    query = query.where('tip.CategoryName = :categoryName', { categoryName });
  }

  if (status) {
    query = query.andWhere('tip.Status = :status', { status });
  }

  return await query.getMany();
}
```

### トランザクション

```typescript
async transferTip(
  fromCategory: string,
  toCategory: string,
  tipName: string,
): Promise<void> {
  await this.tipRepository.manager.transaction(async (manager) => {
    const tip = await manager.getRepository(DTip).findOne({
      where: { CategoryName: fromCategory, TipName: tipName },
    });

    if (tip) {
      tip.CategoryName = toCategory;
      await manager.getRepository(DTip).save(tip);
    }
  });
}
```

## ベストプラクティス

### DO ✅

- **エンティティサービスで CRUD のみを行う**

  ```typescript
  // ✅ エンティティサービス内
  async create(data: Partial<DTip>): Promise<DTip> {
    return await this.tipRepository.save(data);
  }
  ```

- **ビジネスロジックはサービス層（front-end accessible）に配置**

  ```typescript
  // ✅ TipService 内
  async registerTip(payload: RegisterTipDto): Promise<void> {
    // バリデーション
    // エラーチェック
    // エンティティサービス呼び出し
    await this.tipEntityService.create(payload);
  }
  ```

- **リレーションは必要な場合のみ取得**
  ```typescript
  // ✅ 必要な場合だけ
  const tip = await this.tipRepository.findOne({
    where: { TipName },
    relations: ['sections', 'tags'], // 必要なリレーションのみ
  });
  ```

### DON'T ❌

- **エンティティサービス内でビジネスロジックを混在**

  ```typescript
  // ❌ ビジネスロジックをエンティティサービスに
  async validateAndCreate(data: any) {
    if (!data.name) throw new Error('Name required');
    return await this.tipRepository.save(data);
  }
  ```

- **全てのリレーションを常に取得**

  ```typescript
  // ❌ 不要なリレーション
  const tip = await this.tipRepository.findOne({
    where: { TipName },
    relations: ['sections', 'tags', 'category', 'links'], // 全部読込
  });
  ```

- **生の SQL クエリ**
  ```typescript
  // ❌ 生 SQL
  const result = await this.tipRepository.query('SELECT * FROM D_Tip');
  ```

## トラブルシューティング

### "Cannot find module" エラー

エンティティファイルが正しく DataSource に登録されているか確認：

```typescript
// app.module.ts
TypeOrmModule.forRoot({
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  // または明示的に
  entities: [DTip, DTipSection, MCategory],
});
```

### リレーションが取得されない

リレーションの指定を確認：

```typescript
// ❌ リレーション指定なし
const tip = await this.tipRepository.findOne({ where: { TipName } });
console.log(tip.sections); // undefined

// ✅ リレーション指定あり
const tip = await this.tipRepository.findOne({
  where: { TipName },
  relations: ['sections'],
});
console.log(tip.sections); // DTipSection[]
```

## 参考

- [CRUD 操作ガイド](./crud-operations.md)
- [ビジネスキーの使用ガイド](./business-keys.md)
- [TypeORM 公式ドキュメント](https://typeorm.io/)
- [DataSource 設定](../../src/app.module.ts)
