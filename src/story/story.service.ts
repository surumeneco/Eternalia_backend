// #region Imports
import { Injectable } from '@nestjs/common';
import { StoryEntityService } from '../entity/story-entity/story-entity.service';
// #endregion

@Injectable()
export class StoryService {
  constructor(private readonly storyEntityService: StoryEntityService) {}

  // #region Public Methods
  // Add business logic methods here
  // #endregion
}
