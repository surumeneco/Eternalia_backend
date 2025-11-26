// #region Imports
import { DataSource } from 'typeorm';
import {
  D_Language,
  D_LanguageGrammar,
  D_LanguageCharacter,
  D_LanguagePhonology,
  D_LanguageWord,
  D_LanguageMean,
  D_LanguageEtymology,
} from './language';
// #endregion

// #region Providers
export const languageEntityRepositoryProviders = [
  {
    provide: 'D_LANGUAGE_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(D_Language),
    inject: [DataSource],
  },
  {
    provide: 'D_LANGUAGE_GRAMMAR_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(D_LanguageGrammar),
    inject: [DataSource],
  },
  {
    provide: 'D_LANGUAGE_CHARACTER_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(D_LanguageCharacter),
    inject: [DataSource],
  },
  {
    provide: 'D_LANGUAGE_PHONOLOGY_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(D_LanguagePhonology),
    inject: [DataSource],
  },
  {
    provide: 'D_LANGUAGE_WORD_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(D_LanguageWord),
    inject: [DataSource],
  },
  {
    provide: 'D_LANGUAGE_MEAN_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(D_LanguageMean),
    inject: [DataSource],
  },
  {
    provide: 'D_LANGUAGE_ETYMOLOGY_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(D_LanguageEtymology),
    inject: [DataSource],
  },
];
// #endregion
