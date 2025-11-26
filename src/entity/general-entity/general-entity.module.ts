// #region Imports
import { Module } from '@nestjs/common';
import { GeneralEntityService } from './general-entity.service';
import { generalEntityRepositoryProviders } from './general-entity.providers';
// #endregion

// #region Module
@Module({
  providers: [GeneralEntityService, ...generalEntityRepositoryProviders],
  exports: [...generalEntityRepositoryProviders, GeneralEntityService],
})
export class GeneralEntityModule {}
// #endregion
