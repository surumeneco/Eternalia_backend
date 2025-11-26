// #region Imports
import { Module } from '@nestjs/common';
import { StoryEntityModule } from '../entity/story-entity/story-entity.module';
import { StoryService } from './story.service';
import { StoryController } from './story.controller';
// #endregion

// #region Module
@Module({
  imports: [StoryEntityModule],
  providers: [StoryService],
  controllers: [StoryController],
  exports: [StoryService],
})
export class StoryModule {}
// #endregion
