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
import { StoryService } from './story.service';
// #endregion

@Controller('api/story')
export class StoryController {
  constructor(private readonly storyService: StoryService) {}

  // #region Endpoints
  // Add endpoints here
  // #endregion
}
