// #region Imports
import { DataSource } from 'typeorm';
import { M_Account, M_Div, M_Category, M_Class, M_Tag } from './generals';
// #endregion

// #region Providers
export const generalEntityRepositoryProviders = [
  {
    provide: 'M_ACCOUNT_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(M_Account),
    inject: [DataSource],
  },
  {
    provide: 'M_DIV_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(M_Div),
    inject: [DataSource],
  },
  {
    provide: 'M_CATEGORY_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(M_Category),
    inject: [DataSource],
  },
  {
    provide: 'M_CLASS_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(M_Class),
    inject: [DataSource],
  },
  {
    provide: 'M_TAG_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(M_Tag),
    inject: [DataSource],
  },
];
// #endregion
