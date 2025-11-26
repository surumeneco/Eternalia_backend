// #region Imports
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { LanguageService } from './language.service';
// #endregion

@Controller('api/language')
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  // #region Endpoints
  // Add endpoints here
  // #endregion
}
