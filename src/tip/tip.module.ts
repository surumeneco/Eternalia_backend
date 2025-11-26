// #region Imports
import { Module } from '@nestjs/common';
import { TipEntityModule } from '../entity/tip-entity/tip-entity.module';
import { TipService } from './tip.service';
import { TipController } from './tip.controller';
// #endregion

// #region Module
@Module({
  imports: [TipEntityModule],
  providers: [TipService],
  controllers: [TipController],
  exports: [TipService],
})
export class TipModule {}
// #endregion
