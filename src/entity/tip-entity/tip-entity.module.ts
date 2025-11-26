// #region Imports
import { Module } from '@nestjs/common';
import { TipEntityService } from './tip-entity.service';
import tipEntityProviders from './tip-entity.providers';
// #endregion

// #region Module
@Module({
  providers: [...tipEntityProviders, TipEntityService],
  exports: [...tipEntityProviders, TipEntityService],
})
export class TipEntityModule {}
// #endregion
