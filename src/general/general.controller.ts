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
import { GeneralService } from './general.service';
// #endregion

@Controller('api/general')
export class GeneralController {
  constructor(private readonly generalService: GeneralService) {}

  // #region Endpoints
  // Add endpoints here
  // #endregion
}
