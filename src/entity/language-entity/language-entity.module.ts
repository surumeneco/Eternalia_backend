// #region Imports
import { Module } from '@nestjs/common';
import { LanguageEntityService } from './language-entity.service';
import { languageEntityRepositoryProviders } from './language-entity.providers';
// #endregion

// #region Module
@Module({
  providers: [LanguageEntityService, ...languageEntityRepositoryProviders],
  exports: [...languageEntityRepositoryProviders, LanguageEntityService],
})
export class LanguageEntityModule {}
// #endregion
