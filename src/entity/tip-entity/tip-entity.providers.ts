// #region Imports
import { DataSource } from 'typeorm';
import {
  D_CategorySectionPreset,
  D_Tip,
  D_TipRelation,
  D_TipSection,
  D_TipTag,
} from './tips';
// #endregion

// #region Providers
export const tipEntityRepositoryProviders = [
  {
    provide: 'D_CATEGORY_SECTION_PRESET_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(D_CategorySectionPreset),
    inject: [DataSource],
  },
  {
    provide: 'D_TIP_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(D_Tip),
    inject: [DataSource],
  },
  {
    provide: 'D_TIP_RELATION_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(D_TipRelation),
    inject: [DataSource],
  },
  {
    provide: 'D_TIP_SECTION_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(D_TipSection),
    inject: [DataSource],
  },
  {
    provide: 'D_TIP_TAG_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(D_TipTag),
    inject: [DataSource],
  },
];
// #endregion
