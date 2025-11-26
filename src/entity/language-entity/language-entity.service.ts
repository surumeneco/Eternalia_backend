// #region Imports
import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
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

@Injectable()
export class LanguageEntityService {
  // #region Constructor Injection
  constructor(
    @Inject('D_LANGUAGE_REPOSITORY')
    private readonly languageRepo: Repository<D_Language>,

    @Inject('D_LANGUAGE_GRAMMAR_REPOSITORY')
    private readonly grammarRepo: Repository<D_LanguageGrammar>,

    @Inject('D_LANGUAGE_CHARACTER_REPOSITORY')
    private readonly characterRepo: Repository<D_LanguageCharacter>,

    @Inject('D_LANGUAGE_PHONOLOGY_REPOSITORY')
    private readonly phonologyRepo: Repository<D_LanguagePhonology>,

    @Inject('D_LANGUAGE_WORD_REPOSITORY')
    private readonly wordRepo: Repository<D_LanguageWord>,

    @Inject('D_LANGUAGE_MEAN_REPOSITORY')
    private readonly meanRepo: Repository<D_LanguageMean>,

    @Inject('D_LANGUAGE_ETYMOLOGY_REPOSITORY')
    private readonly etymologyRepo: Repository<D_LanguageEtymology>,
  ) {}
  // #endregion

  // #region D_Language CRUD (key: Name)
  createLanguage(payload: Partial<D_Language>) {
    return this.languageRepo.save(payload as D_Language);
  }

  findAllLanguages() {
    return this.languageRepo.find();
  }

  findLanguageByName(name: string) {
    return this.languageRepo.findOneBy({ Name: name });
  }

  async updateLanguage(name: string, payload: Partial<D_Language>) {
    await this.languageRepo.update({ Name: name }, payload);
    return this.findLanguageByName(name);
  }

  removeLanguage(name: string) {
    return this.languageRepo.delete({ Name: name });
  }
  // #endregion

  // #region D_LanguageGrammar CRUD (key: Language + Section)
  createGrammar(payload: Partial<D_LanguageGrammar>) {
    return this.grammarRepo.save(payload as D_LanguageGrammar);
  }

  findAllGrammars() {
    return this.grammarRepo.find();
  }

  findGrammar(language: string, section: string) {
    return this.grammarRepo.findOneBy({ Language: language, Section: section });
  }

  async updateGrammar(
    language: string,
    section: string,
    payload: Partial<D_LanguageGrammar>,
  ) {
    await this.grammarRepo.update(
      { Language: language, Section: section },
      payload,
    );
    return this.findGrammar(language, section);
  }

  removeGrammar(language: string, section: string) {
    return this.grammarRepo.delete({ Language: language, Section: section });
  }
  // #endregion

  // #region D_LanguageCharacter CRUD (key: Language + Character)
  createCharacter(payload: Partial<D_LanguageCharacter>) {
    return this.characterRepo.save(payload as D_LanguageCharacter);
  }

  findAllCharacters() {
    return this.characterRepo.find();
  }

  findCharacter(language: string, character: string) {
    return this.characterRepo.findOneBy({
      Language: language,
      Character: character,
    });
  }

  async updateCharacter(
    language: string,
    character: string,
    payload: Partial<D_LanguageCharacter>,
  ) {
    await this.characterRepo.update(
      { Language: language, Character: character },
      payload,
    );
    return this.findCharacter(language, character);
  }

  removeCharacter(language: string, character: string) {
    return this.characterRepo.delete({
      Language: language,
      Character: character,
    });
  }
  // #endregion

  // #region D_LanguagePhonology CRUD (key: Language + Character + FollowableCharacter)
  createPhonology(payload: Partial<D_LanguagePhonology>) {
    return this.phonologyRepo.save(payload as D_LanguagePhonology);
  }

  findAllPhonologies() {
    return this.phonologyRepo.find();
  }

  findPhonology(
    language: string,
    character: string,
    followableCharacter: string,
  ) {
    return this.phonologyRepo.findOneBy({
      Language: language,
      Character: character,
      FollowableCharacter: followableCharacter,
    });
  }

  async updatePhonology(
    language: string,
    character: string,
    followableCharacter: string,
    payload: Partial<D_LanguagePhonology>,
  ) {
    await this.phonologyRepo.update(
      {
        Language: language,
        Character: character,
        FollowableCharacter: followableCharacter,
      },
      payload,
    );
    return this.findPhonology(language, character, followableCharacter);
  }

  removePhonology(
    language: string,
    character: string,
    followableCharacter: string,
  ) {
    return this.phonologyRepo.delete({
      Language: language,
      Character: character,
      FollowableCharacter: followableCharacter,
    });
  }
  // #endregion

  // #region D_LanguageWord CRUD (key: Language + Spell)
  createWord(payload: Partial<D_LanguageWord>) {
    return this.wordRepo.save(payload as D_LanguageWord);
  }

  findAllWords() {
    return this.wordRepo.find();
  }

  findWord(language: string, spell: string) {
    return this.wordRepo.findOneBy({ Language: language, Spell: spell });
  }

  async updateWord(
    language: string,
    spell: string,
    payload: Partial<D_LanguageWord>,
  ) {
    await this.wordRepo.update({ Language: language, Spell: spell }, payload);
    return this.findWord(language, spell);
  }

  removeWord(language: string, spell: string) {
    return this.wordRepo.delete({ Language: language, Spell: spell });
  }
  // #endregion

  // #region D_LanguageMean CRUD (key: Language + Spell + Class)
  createMean(payload: Partial<D_LanguageMean>) {
    return this.meanRepo.save(payload as D_LanguageMean);
  }

  findAllMeans() {
    return this.meanRepo.find();
  }

  findMean(language: string, spell: string, classValue: string) {
    return this.meanRepo.findOneBy({
      Language: language,
      Spell: spell,
      Class: classValue,
    });
  }

  async updateMean(
    language: string,
    spell: string,
    classValue: string,
    payload: Partial<D_LanguageMean>,
  ) {
    await this.meanRepo.update(
      { Language: language, Spell: spell, Class: classValue },
      payload,
    );
    return this.findMean(language, spell, classValue);
  }

  removeMean(language: string, spell: string, classValue: string) {
    return this.meanRepo.delete({
      Language: language,
      Spell: spell,
      Class: classValue,
    });
  }
  // #endregion

  // #region D_LanguageEtymology CRUD (key: Language + Spell + Class + Order)
  createEtymology(payload: Partial<D_LanguageEtymology>) {
    return this.etymologyRepo.save(payload as D_LanguageEtymology);
  }

  findAllEtymologies() {
    return this.etymologyRepo.find();
  }

  findEtymology(
    language: string,
    spell: string,
    classValue: string,
    order: string,
  ) {
    return this.etymologyRepo.findOneBy({
      Language: language,
      Spell: spell,
      Class: classValue,
      Order: order,
    });
  }

  async updateEtymology(
    language: string,
    spell: string,
    classValue: string,
    order: string,
    payload: Partial<D_LanguageEtymology>,
  ) {
    await this.etymologyRepo.update(
      { Language: language, Spell: spell, Class: classValue, Order: order },
      payload,
    );
    return this.findEtymology(language, spell, classValue, order);
  }

  removeEtymology(
    language: string,
    spell: string,
    classValue: string,
    order: string,
  ) {
    return this.etymologyRepo.delete({
      Language: language,
      Spell: spell,
      Class: classValue,
      Order: order,
    });
  }
  // #endregion
}
