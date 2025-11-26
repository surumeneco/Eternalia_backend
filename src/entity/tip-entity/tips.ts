// #region Imports
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
// #endregion

// #region Entities (tip-entity)

// #region D_CategorySectionPreset
@Entity()
export class D_CategorySectionPreset {
  @PrimaryGeneratedColumn({ type: 'int' })
  Id: number;

  @Column()
  CategoryName: string;

  @Column()
  SectionName: string;

  @Column()
  Order: string;

  @Column({ nullable: true })
  Text: string;
}
// #endregion

// #region D_Tip
@Entity()
export class D_Tip {
  @PrimaryGeneratedColumn({ type: 'int' })
  Id: number;

  @Column()
  CategoryName: string;

  @Column()
  Name: string;

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

// #region D_TipRelation
@Entity()
export class D_TipRelation {
  @PrimaryGeneratedColumn({ type: 'int' })
  Id: number;

  @Column()
  CategoryName: string;

  @Column()
  TipName: string;

  @Column()
  RelateCategoryName: string;

  @Column()
  RelateTipName: string;

  @Column()
  Order: string;
}
// #endregion

// #region D_TipSection
@Entity()
export class D_TipSection {
  @PrimaryGeneratedColumn({ type: 'int' })
  Id: number;

  @Column()
  CategoryName: string;

  @Column()
  TipName: string;

  @Column()
  Name: string;

  @Column()
  Order: string;

  @Column({ nullable: true })
  Text: string;

  @Column({ length: 10, nullable: true })
  Disabled: string;
}
// #endregion

// #region D_TipTag
@Entity()
export class D_TipTag {
  @PrimaryGeneratedColumn({ type: 'int' })
  Id: number;

  @Column()
  CategoryName: string;

  @Column()
  TipName: string;

  @Column()
  Tag: string;
}

// #endregion
