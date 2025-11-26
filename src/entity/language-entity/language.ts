// #region Imports
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
// #endregion

// #region Entities (language-entity)

// #region D_Language
@Entity()
export class D_Language {
  @PrimaryGeneratedColumn({ type: 'int' })
  Id: number;

  @Column()
  Name: string;

  @Column()
  Order: string;

  @Column({ nullable: true })
  Overview: string;

  @Column()
  PublishState: string;

  @Column({ length: 30 })
  PublishDateTime: string;

  @Column({ length: 30 })
  UpdateDateTime: string;

  @Column({ length: 30 })
  InsertDateTime: string;

  @Column({ length: 10, nullable: true })
  Disabled: string;
}
// #endregion

// #region D_LanguageGrammar
@Entity()
export class D_LanguageGrammar {
  @PrimaryGeneratedColumn({ type: 'int' })
  Id: number;

  @Column()
  Language: string;

  @Column()
  Section: string;

  @Column()
  Order: string;

  @Column({ nullable: true })
  Text: string;

  @Column()
  PublishState: string;

  @Column({ length: 30 })
  PublishDateTime: string;

  @Column({ length: 30 })
  UpdateDateTime: string;

  @Column({ length: 30 })
  InsertDateTime: string;
}
// #endregion

// #region D_LanguageCharacter
@Entity()
export class D_LanguageCharacter {
  @PrimaryGeneratedColumn({ type: 'int' })
  Id: number;

  @Column()
  Language: string;

  @Column()
  Character: string;

  @Column()
  Order: string;

  @Column({ nullable: true })
  Pronounce: string;

  @Column({ nullable: true })
  AllowHead: string;

  @Column({ nullable: true })
  AllowTail: string;
}
// #endregion

// #region D_LanguagePhonology
@Entity()
export class D_LanguagePhonology {
  @PrimaryGeneratedColumn({ type: 'int' })
  Id: number;

  @Column()
  Language: string;

  @Column()
  Character: string;

  @Column()
  FollowableCharacter: string;
}
// #endregion

// #region D_LanguageWord
@Entity()
export class D_LanguageWord {
  @PrimaryGeneratedColumn({ type: 'int' })
  Id: number;

  @Column()
  Language: string;

  @Column()
  Spell: string;

  @Column()
  PublishState: string;

  @Column({ length: 30 })
  PublishDateTime: string;

  @Column({ length: 30 })
  UpdateDateTime: string;

  @Column({ length: 30 })
  InsertDateTime: string;

  @Column({ length: 10, nullable: true })
  Disabled: string;
}
// #endregion

// #region D_LanguageMean
@Entity()
export class D_LanguageMean {
  @PrimaryGeneratedColumn({ type: 'int' })
  Id: number;

  @Column()
  Language: string;

  @Column()
  Spell: string;

  @Column()
  Class: string;

  @Column()
  Order: string;

  @Column({ nullable: true })
  Description: string;
}
// #endregion

// #region D_LanguageEtymology
@Entity()
export class D_LanguageEtymology {
  @PrimaryGeneratedColumn({ type: 'int' })
  Id: number;

  @Column()
  Language: string;

  @Column()
  Spell: string;

  @Column()
  Class: string;

  @Column()
  EtymLanguage: string;

  @Column()
  EtymSpell: string;

  @Column()
  Order: string;

  @Column({ nullable: true })
  Mean: string;
}

// #endregion
