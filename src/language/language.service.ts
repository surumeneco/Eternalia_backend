// #region Imports
import { Injectable } from '@nestjs/common';
import { LanguageEntityService } from '../entity/language-entity/language-entity.service';
// #endregion

@Injectable()
export class LanguageService {
  constructor(private readonly languageEntityService: LanguageEntityService) {}

  // #region Public Methods
  // Add business logic methods here
  // #endregion
}
