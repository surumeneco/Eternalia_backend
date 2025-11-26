// #region Imports
import { Module } from '@nestjs/common';
import { StoryEntityService } from './story-entity.service';
import { storyEntityRepositoryProviders } from './story-entity.providers';
// #endregion

// #region Module
@Module({
  providers: [StoryEntityService, ...storyEntityRepositoryProviders],
  exports: [...storyEntityRepositoryProviders, StoryEntityService],
})
export class StoryEntityModule {}
// #endregion
