# サービス層アーキテクチャガイド

## 概要

Eternalia_backend のサービス層は 2 層構造になっています：

1. **エンティティサービス** (`{domain}-entity.service.ts`) - CRUD のみ
2. **ビジネスロジックサービス** (`{domain}.service.ts`) - ビジネスロジック + エラーハンドリング

## アーキテクチャ全体図

```
┌─────────────────────────────────────────────────────┐
│                 Controller                          │
│            (route/parameter parse)                  │
└────────────────┬────────────────────────────────────┘
                 │ inject
┌────────────────▼────────────────────────────────────┐
│           Service                                   │
│      (business logic + validation)                  │
├─────────────────────────────────────────────────────┤
│  - validateInput()                                  │
│  - checkDuplicate()                                 │
│  - callEntityService()                              │
│  - throwError()                                     │
└────────────────┬────────────────────────────────────┘
                 │ inject
┌────────────────▼────────────────────────────────────┐
│         EntityService                               │
│           (CRUD only)                               │
├─────────────────────────────────────────────────────┤
│  - findByBusinessKey()                              │
│  - create()                                         │
│  - updateByBusinessKey()                            │
│  - deleteByBusinessKey()                            │
└────────────────┬────────────────────────────────────┘
                 │ inject
┌────────────────▼────────────────────────────────────┐
│         Repository                                  │
│        (TypeORM interface)                          │
└────────────────┬────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────┐
│          Database                                   │
└─────────────────────────────────────────────────────┘
```

## エンティティサービス

### 責務

- ✅ CRUD 操作のみ
- ✅ リポジトリとのやり取り
- ✅ エンティティの型定義

### 使用しない

- ❌ ビジネスロジック
- ❌ 検証・バリデーション
- ❌ エラーハンドリング

### 実装例

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

  // ========== READ ==========
  async findByBusinessKey(
    categoryName: string,
    tipName: string,
  ): Promise<DTip | null> {
    return await this.tipRepository.findOneBy({
      CategoryName: categoryName,
      TipName: tipName,
    });
  }

  async findAll(): Promise<DTip[]> {
    return await this.tipRepository.find();
  }

  // ========== CREATE ==========
  async create(data: Partial<DTip>): Promise<DTip> {
    const entity = this.tipRepository.create(data);
    return await this.tipRepository.save(entity);
  }

  async createMany(dataArray: Partial<DTip>[]): Promise<DTip[]> {
    const entities = this.tipRepository.create(dataArray);
    return await this.tipRepository.save(entities);
  }

  // ========== UPDATE ==========
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

  // ========== DELETE ==========
  async deleteByBusinessKey(
    categoryName: string,
    tipName: string,
  ): Promise<void> {
    await this.tipRepository.delete({
      CategoryName: categoryName,
      TipName: tipName,
    });
  }
}
```

## ビジネスロジックサービス

### 責務

- ✅ ビジネスロジック実装
- ✅ 入力値の検証
- ✅ エラーハンドリング
- ✅ エンティティサービス呼び出し調整

### 使用しない

- ❌ リポジトリ直接操作
- ❌ SQL クエリ

### 実装例

```typescript
// src/tip/tip.service.ts

import { Injectable } from '@nestjs/common';
import { TipEntityService } from '../entity/tip-entity/tip-entity.service';
import {
  throwNotFound,
  throwInvalidField,
  throwAlreadyExists,
  throwOperationFailed,
} from '../common/errors/error-factories';

@Injectable()
export class TipService {
  constructor(private readonly tipEntityService: TipEntityService) {}

  // ===== 例1: 単純な検索 =====
  async selectManageDetail(categoryName: string): Promise<any> {
    // 検証
    if (!categoryName) {
      throwRequiredField('TIP', 'CategoryName', ['CategoryName']);
    }

    // 検索
    const tip = await this.tipEntityService.findByBusinessKey(
      categoryName,
      categoryName, // 簡略化した例
    );

    // エラーハンドリング
    if (!tip) {
      throwNotFound('TIP', 'category', ['categoryName']);
    }

    // レスポンス構築
    return {
      categoryName: tip.CategoryName,
      description: tip.Description,
    };
  }

  // ===== 例2: 作成（バリデーション付き） =====
  async registerCategory(payload: any): Promise<void> {
    // 入力検証
    if (!payload.CategoryName) {
      throwRequiredField('TIP', 'CategoryName', ['CategoryName']);
    }

    // ビジネスルール検証
    const validStates = ['DRAFT', 'PUBLISHED', 'ARCHIVED'];
    if (
      payload.PublicationState &&
      !validStates.includes(payload.PublicationState)
    ) {
      throwInvalidField('TIP', 'PublicationState', ['PublicationState'], {
        allowedValues: validStates,
      });
    }

    // 重複チェック
    const existing = await this.tipEntityService.findByBusinessKey(
      payload.CategoryName,
      'dummy', // 実装では適切な値を使用
    );
    if (existing) {
      throwAlreadyExists('TIP', 'category', ['CategoryName']);
    }

    // 作成
    try {
      await this.tipEntityService.create({
        CategoryName: payload.CategoryName,
        Description: payload.Description || '',
        PublicationState: payload.PublicationState || 'DRAFT',
      });
    } catch (error) {
      throwOperationFailed('TIP', 'category creation', undefined, {
        originalError: error.message,
      });
    }
  }

  // ===== 例3: 複雑な処理 =====
  async updateWithDependencies(
    categoryName: string,
    payload: any,
  ): Promise<void> {
    // 1. 既存レコード確認
    const existing = await this.tipEntityService.findByBusinessKey(
      categoryName,
      'dummy',
    );
    if (!existing) {
      throwNotFound('TIP', 'category', ['categoryName']);
    }

    // 2. 新しい名前での重複確認
    if (payload.NewCategoryName !== categoryName) {
      const duplicate = await this.tipEntityService.findByBusinessKey(
        payload.NewCategoryName,
        'dummy',
      );
      if (duplicate) {
        throwAlreadyExists('TIP', 'category', ['NewCategoryName']);
      }
    }

    // 3. 関連レコード更新（他のエンティティサービス呼び出し）
    // 別途実装

    // 4. メインレコード更新
    try {
      await this.tipEntityService.updateByBusinessKey(categoryName, 'dummy', {
        CategoryName: payload.NewCategoryName || categoryName,
        Description: payload.Description,
      });
    } catch (error) {
      throwOperationFailed('TIP', 'category update', undefined, {
        originalError: error.message,
      });
    }
  }
}
```

## Module 設定

### エンティティモジュール

```typescript
// src/entity/tip-entity/tip-entity.module.ts

import { Module } from '@nestjs/common';
import { tipEntityProviders } from './tip-entity.providers';
import { TipEntityService } from './tip-entity.service';

@Module({
  providers: [...tipEntityProviders, TipEntityService],
  exports: [TipEntityService], // 外部での使用を許可
})
export class TipEntityModule {}
```

### ビジネスロジックモジュール

```typescript
// src/tip/tip.module.ts

import { Module } from '@nestjs/common';
import { TipEntityModule } from '../entity/tip-entity/tip-entity.module';
import { TipService } from './tip.service';
import { TipController } from './tip.controller.ts';

@Module({
  imports: [TipEntityModule], // エンティティモジュールをインポート
  providers: [TipService],
  controllers: [TipController],
})
export class TipModule {}
```

## Controller との連携

### Controller の役割

- ✅ Route 定義
- ✅ パラメータパース
- ✅ HTTP ステータス設定
- ✅ レスポンス返却

### 実装例

```typescript
// src/tip/tip.controller.ts

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { TipService } from './tip.service';

@Controller('api/tip')
export class TipController {
  constructor(private readonly tipService: TipService) {}

  // ===== GET =====
  @Get('/categories/:categoryName/manage-detail')
  async selectManageDetail(
    @Param('categoryName') categoryName: string,
  ): Promise<any> {
    return await this.tipService.selectManageDetail(categoryName);
  }

  // ===== POST =====
  @Post('/categories')
  async registerCategory(@Body() payload: any): Promise<void> {
    await this.tipService.registerCategory(payload);
  }

  // ===== PUT =====
  @Put('/categories/:categoryName')
  async updateCategory(
    @Param('categoryName') categoryName: string,
    @Body() payload: any,
  ): Promise<void> {
    await this.tipService.updateWithDependencies(categoryName, payload);
  }

  // ===== DELETE =====
  @Delete('/categories/:categoryName')
  async deleteCategory(
    @Param('categoryName') categoryName: string,
  ): Promise<void> {
    await this.tipService.deleteCategory(categoryName);
  }
}
```

## データフロー例

### 新規作成フロー

```
Client
  └─ POST /api/tip/categories { CategoryName: "Physics" }
     ▼
Controller (TipController)
  └─ @Post('/categories') registerCategory(payload)
     ▼
Service (TipService)
  ├─ validateInput(payload) ─ バリデーション
  ├─ checkDuplicate(categoryName) ─ 重複チェック
  └─ tipEntityService.create(data) ─ エンティティサービス呼び出し
     ▼
EntityService (TipEntityService)
  └─ tipRepository.save(entity) ─ DB に挿入
     ▼
Database
  └─ INSERT INTO M_Category ...
     ▼
Response
  └─ { status: "success", code: 201 }
```

### 検索エラーフロー

```
Client
  └─ GET /api/tip/categories/NotExist/manage-detail
     ▼
Controller (TipController)
  └─ @Get('/categories/:categoryName/manage-detail')
     ▼
Service (TipService)
  └─ tipEntityService.findByBusinessKey(categoryName, ...)
     ▼
EntityService (TipEntityService)
  └─ tipRepository.findOneBy({ CategoryName: ... })
     ▼
Database
  └─ SELECT * FROM M_Category ... → null
     ▼
Service
  └─ if (!tip) throwNotFound('TIP', 'category', ...)
     ▼
AllExceptionsFilter
  └─ AppError をキャッチして エラーレスポンスに変換
     ▼
Response
  └─ { status: "error", code: 404, error: [...] }
```

## 依存関係の整理

### モジュール間の依存関係

```
AppModule
  ├─ imports: [TipModule, StoryModule, LanguageModule, GeneralModule]
  │
  └─ TipModule
      ├─ imports: [TipEntityModule]
      ├─ providers: [TipService]
      └─ controllers: [TipController]

  └─ TipEntityModule
      ├─ providers: [tipEntityProviders, TipEntityService]
      └─ exports: [TipEntityService]
```

### 循環依存の回避

```typescript
// ❌ 危険：循環依存
// TipModule -> StoryModule -> TipModule

// ✅ 正しい：一方向の依存
// TipModule
//   └─ TipEntityModule
//       └─ (他のモジュールに依存しない)
```

## ベストプラクティス

### DO ✅

- **エンティティサービスは CRUD のみ**

  ```typescript
  // ✅ エンティティサービス内
  async create(data: Partial<DTip>): Promise<DTip> {
    return await this.tipRepository.save(data);
  }
  ```

- **ビジネスロジックはサービス層に集中**

  ```typescript
  // ✅ サービス層内
  async registerTip(payload: RegisterTipDto): Promise<void> {
    // バリデーション + エラーハンドリング
    if (!payload.name) throwRequiredField(...);
    const existing = await this.tipEntityService.findBy...();
    if (existing) throwAlreadyExists(...);
    // エンティティサービス呼び出し
    await this.tipEntityService.create(payload);
  }
  ```

- **依存性注入を使用**
  ```typescript
  // ✅ DI
  constructor(private readonly tipEntityService: TipEntityService) {}
  ```

### DON'T ❌

- **Controller 内でビジネスロジック**

  ```typescript
  // ❌
  @Post('/categories')
  async register(@Body() payload: any): Promise<void> {
    const existing = await db.query(...); // Controller で DB アクセス
  }
  ```

- **サービス内でリポジトリ直接操作**

  ```typescript
  // ❌
  async registerTip(payload: any): Promise<void> {
    await this.tipRepository.save(payload); // エンティティサービスを経由しない
  }
  ```

- **複数モジュール間の循環依存**
  ```typescript
  // ❌
  TipModule -> StoryModule
  StoryModule -> TipModule
  ```

## 参考

- [Dependency Injection ガイド](./dependency-injection.md)
- [エンティティ設定ガイド](../entity/entity-setup.md)
- [CRUD 操作ガイド](../entity/crud-operations.md)
- [NestJS Module docs](https://docs.nestjs.com/modules)
