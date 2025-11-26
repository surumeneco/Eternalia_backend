// #region Imports
import { Injectable } from '@nestjs/common';
import { GeneralEntityService } from '../entity/general-entity/general-entity.service';
// #endregion

@Injectable()
export class GeneralService {
  constructor(private readonly generalEntityService: GeneralEntityService) {}

  // #region Public Methods
  // Add business logic methods here
  // #endregion
}
