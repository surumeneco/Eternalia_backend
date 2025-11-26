// #region Imports
import { DataSource } from 'typeorm';
import {
  D_StoryVolume,
  D_StoryPart,
  D_StoryChapter,
  D_StoryBody,
} from './story';
// #endregion

// #region Providers
export const storyEntityRepositoryProviders = [
  {
    provide: 'D_STORY_VOLUME_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(D_StoryVolume),
    inject: [DataSource],
  },
  {
    provide: 'D_STORY_PART_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(D_StoryPart),
    inject: [DataSource],
  },
  {
    provide: 'D_STORY_CHAPTER_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(D_StoryChapter),
    inject: [DataSource],
  },
  {
    provide: 'D_STORY_BODY_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(D_StoryBody),
    inject: [DataSource],
  },
];
// #endregion
