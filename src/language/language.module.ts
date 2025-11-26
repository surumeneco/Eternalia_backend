// #region Imports
import { Module } from '@nestjs/common';
import { LanguageEntityModule } from '../entity/language-entity/language-entity.module';
import { LanguageService } from './language.service';
import { LanguageController } from './language.controller';
// #endregion

// #region Module
@Module({
  imports: [LanguageEntityModule],
  providers: [LanguageService],
  controllers: [LanguageController],
  exports: [LanguageService],
})
export class LanguageModule {}
// #endregion
