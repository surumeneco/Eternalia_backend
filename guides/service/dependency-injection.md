# Dependency Injection ガイド

## 概要

NestJS の Dependency Injection (DI) により、クラス間の依存関係を自動的に解決します。

## 基本概念

### Provider

`Provider` は NestJS の DI コンテナが管理するサービス/クラスです。

```typescript
@Injectable()
export class TipService {
  // このクラスは DI の対象
}
```

### Module

`Module` は providers を登録し、public/private を定義します。

```typescript
@Module({
  providers: [TipService], // このサービスを管理
  exports: [TipService], // 外部モジュールでも使用可能
})
export class TipModule {}
```

### Injection

`constructor` パラメータで依存関係を注入します。

```typescript
export class TipController {
  constructor(private readonly tipService: TipService) {
    // tipService は自動的にインスタンス化され注入される
  }
}
```

## エンティティサービスの DI

### Provider 定義

各エンティティのリポジトリを provider として定義：

```typescript
// src/entity/tip-entity/tip-entity.providers.ts

import { DataSource } from 'typeorm';
import { DTip } from './tip.ts';
import { DTipSection } from './tip-section.ts';

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
];
```

### Module に登録

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

### Service で使用

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

  async create(data: Partial<DTip>): Promise<DTip> {
    return await this.tipRepository.save(data);
  }
}
```

## ビジネスロジックサービスの DI

### Module に登録

```typescript
// src/tip/tip.module.ts

import { Module } from '@nestjs/common';
import { TipEntityModule } from '../entity/tip-entity/tip-entity.module';
import { TipService } from './tip.service';
import { TipController } from './tip.controller';

@Module({
  imports: [TipEntityModule], // エンティティモジュールをインポート
  providers: [TipService], // ビジネスロジックサービスを登録
  controllers: [TipController],
})
export class TipModule {}
```

### Service で使用

```typescript
// src/tip/tip.service.ts

import { Injectable } from '@nestjs/common';
import { TipEntityService } from '../entity/tip-entity/tip-entity.service';

@Injectable()
export class TipService {
  constructor(private readonly tipEntityService: TipEntityService) {}

  async selectManageDetail(categoryName: string): Promise<any> {
    const tip = await this.tipEntityService.findByBusinessKey(
      categoryName,
      'dummy',
    );
    // ...
  }
}
```

## Controller の DI

### Module に登録

```typescript
// src/tip/tip.module.ts

@Module({
  imports: [TipEntityModule],
  providers: [TipService],
  controllers: [TipController], // Controller を登録
})
export class TipModule {}
```

### Controller で使用

```typescript
// src/tip/tip.controller.ts

import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { TipService } from './tip.service';

@Controller('api/tip')
export class TipController {
  constructor(private readonly tipService: TipService) {}

  @Get('/categories/:categoryName/manage-detail')
  async selectManageDetail(
    @Param('categoryName') categoryName: string,
  ): Promise<any> {
    return await this.tipService.selectManageDetail(categoryName);
  }

  @Post('/categories')
  async registerCategory(@Body() payload: any): Promise<void> {
    await this.tipService.registerCategory(payload);
  }
}
```

## Factory Pattern

### Factory Provider

複雑な初期化が必要な場合、factory 関数を使用：

```typescript
// src/entity/tip-entity/tip-entity.providers.ts

export const tipEntityProviders = [
  {
    provide: 'TIP_REPOSITORY',
    useFactory: (dataSource: DataSource) => {
      // リポジトリ作成前に初期化
      console.log('Creating TIP_REPOSITORY');
      return dataSource.getRepository(DTip);
    },
    inject: ['DATA_SOURCE'],
  },
];
```

### Custom Provider

静的値や条件付き provider も可能：

```typescript
// 静的値
{
  provide: 'MAX_PAGE_SIZE',
  useValue: 100,
}

// クラスインスタンス
{
  provide: 'TIP_LOGGER',
  useClass: CustomLogger,
}

// Factory 関数
{
  provide: 'DATABASE_CONNECTION',
  useFactory: (configService: ConfigService) => {
    const dbConfig = configService.get('database');
    return createConnection(dbConfig);
  },
  inject: [ConfigService],
}
```

## グローバル Provider

### グローバル Middleware

`RequestIdMiddleware` はグローバルに適用：

```typescript
// src/main.ts

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // グローバルミドルウェア
  app.use(requestIdMiddleware);

  // グローバルインターセプター
  app.useGlobalInterceptors(new ResponseInterceptor());

  // グローバルフィルター
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(3000);
}

bootstrap();
```

### グローバル Provider

```typescript
// src/app.module.ts

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // グローバルに利用可能
    TypeOrmModule.forRootAsync({...}),
  ],
  providers: [
    {
      provide: 'APP_CONFIG',
      useValue: { /* config */ },
    },
  ],
})
export class AppModule {}
```

## 非同期 Provider

データベース接続など、非同期初期化が必要な場合：

```typescript
// src/app.module.ts

import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'mssql',
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          database: configService.get('DB_NAME'),
          // ...
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

## スコープ

### DEFAULT (Singleton)

単一インスタンスをアプリケーション全体で共有（デフォルト）：

```typescript
@Injectable()
export class TipService {
  // アプリケーション起動時に1回だけインスタンス化
}
```

**使用する場合**:

- Stateless なサービス
- 計算コスト高い初期化

### REQUEST

各リクエストごとに新しいインスタンスを作成：

```typescript
import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class RequestScopedService {
  // 各リクエストに対して新しいインスタンスが作成される
}
```

**使用する場合**:

- リクエストごとに state を保持
- トレーシング・ロギング

### TRANSIENT

依存関係のあるオブジェクトが生成されるたびに新しいインスタンスを作成：

```typescript
@Injectable({ scope: Scope.TRANSIENT })
export class TransientService {
  // 依存している度に新しいインスタンスが作成される
}
```

## Circular Dependency 回避

### 問題の例

```typescript
// ❌ 循環依存
@Module({
  providers: [AService, BService],
})
export class AModule {
  constructor(private b: BService) {} // AService -> BService
}

@Module({
  providers: [CService],
})
export class BModule {
  constructor(private a: AService) {} // BService -> AService
}
```

### 解決策 1: 一方向の依存に変更

```typescript
// ✅ 正しい：AService は BService に依存しない
@Module({
  providers: [AService],
})
export class AModule {}

@Module({
  providers: [BService],
})
export class BModule {
  constructor(private a: AService) {} // BService -> AService のみ
}
```

### 解決策 2: 共通モジュール

```typescript
// ✅ 両者が共通サービスに依存
@Module({
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}

@Module({
  imports: [CommonModule],
  providers: [AService],
})
export class AModule {}

@Module({
  imports: [CommonModule],
  providers: [BService],
})
export class BModule {}
```

### 解決策 3: Lazy Injection

```typescript
// ✅ 遅延インジェクション
@Injectable()
export class AService {
  constructor(private moduleRef: ModuleRef) {}

  getB(): BService {
    return this.moduleRef.get(BService);
  }
}
```

## テストでの DI

### ユニットテスト

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { TipService } from './tip.service';
import { TipEntityService } from '../entity/tip-entity/tip-entity.service';

describe('TipService', () => {
  let service: TipService;
  let entityService: TipEntityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TipService,
        {
          provide: TipEntityService,
          useValue: {
            // Mock 実装
            findByBusinessKey: jest.fn().mockResolvedValue(null),
            create: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    service = module.get<TipService>(TipService);
    entityService = module.get<TipEntityService>(TipEntityService);
  });

  it('should call entityService.create', async () => {
    await service.registerCategory({ CategoryName: 'Test' });
    expect(entityService.create).toHaveBeenCalled();
  });
});
```

## ベストプラクティス

### DO ✅

- **`@Injectable()` をサービスに付ける**

  ```typescript
  @Injectable()
  export class TipService {}
  ```

- **Module で provider を export**

  ```typescript
  @Module({
    providers: [TipService],
    exports: [TipService],
  })
  ```

- **Named injection に `@Inject()`**
  ```typescript
  constructor(
    @Inject('TIP_REPOSITORY')
    private tipRepository: Repository<DTip>,
  ) {}
  ```

### DON'T ❌

- **`@Injectable()` なしでサービス**

  ```typescript
  // ❌ DI されない
  export class TipService {}
  ```

- **Module で export なし**

  ```typescript
  // ❌ 外部で使用不可
  @Module({
    providers: [TipService],
    // exports を記述していない
  })
  ```

- **循環依存**
  ```typescript
  // ❌
  AModule -> BModule -> AModule
  ```

## 参考

- [サービス層アーキテクチャ](./service-structure.md)
- [NestJS Providers](https://docs.nestjs.com/providers)
- [NestJS Modules](https://docs.nestjs.com/modules)
- [NestJS DI System](https://docs.nestjs.com/fundamentals/custom-providers)
