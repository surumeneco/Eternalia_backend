import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GeneralEntityModule } from './entity/general-entity/general-entity.module';
import { StoryEntityModule } from './entity/story-entity/story-entity.module';
import { TipEntityModule } from './entity/tip-entity/tip-entity.module';
import { LanguageEntityModule } from './entity/language-entity/language-entity.module';
import { GeneralModule } from './general/general.module';
import { StoryModule } from './story/story.module';
import { TipModule } from './tip/tip.module';
import { LanguageModule } from './language/language.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mssql',
        host: config.get<string>('DB_HOST'),
        port: Number(config.get<number>('DB_PORT') ?? 1433),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASS'),
        database: config.get<string>('DB_NAME'),
        synchronize: false,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        options: {
          encrypt: config.get<string>('DB_ENCRYPT') === 'true',
          enableArithAbort: true,
        },
      }),
    }),
    GeneralEntityModule,
    StoryEntityModule,
    TipEntityModule,
    LanguageEntityModule,
    GeneralModule,
    StoryModule,
    TipModule,
    LanguageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
