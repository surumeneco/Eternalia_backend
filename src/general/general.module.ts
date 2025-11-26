// #region Imports
import { Module } from '@nestjs/common';
import { GeneralEntityModule } from '../entity/general-entity/general-entity.module';
import { GeneralService } from './general.service';
import { GeneralController } from './general.controller';
// #endregion

// #region Module
@Module({
  imports: [GeneralEntityModule],
  providers: [GeneralService],
  controllers: [GeneralController],
  exports: [GeneralService],
})
export class GeneralModule {}
// #endregion
