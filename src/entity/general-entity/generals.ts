import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

// #region Entities (general-entity)

// #region M_Account
@Entity()
export class M_Account {
  @PrimaryColumn({ length: 450 })
  Id: string;

  @Column()
  Name: string;

  @Column()
  Password: string;

  @Column()
  Email: string;

  @Column()
  Authorization: string;

  @Column({ length: 30 })
  UpdateDateTime: string;

  @Column({ length: 30 })
  InsertDateTime: string;
}
// #endregion

// #region M_Div
@Entity()
export class M_Div {
  @PrimaryColumn({ length: 100 })
  Kind: string;

  @PrimaryColumn({ length: 100 })
  Name: string;

  @Column()
  Value: string;

  @Column()
  Order: string;
}
// #endregion

// #region M_Category
@Entity()
export class M_Category {
  @PrimaryGeneratedColumn({ type: 'int' })
  Id: number;

  @Column()
  Name: string;

  @Column()
  Order: string;

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

// #region M_Class
@Entity()
export class M_Class {
  @PrimaryGeneratedColumn({ type: 'int' })
  Id: number;

  @Column()
  Language: string;

  @Column()
  Name: string;

  @Column()
  Order: string;

  @Column({ nullable: true })
  Overview: string;
}
// #endregion

// #region M_Tag
@Entity()
export class M_Tag {
  @PrimaryGeneratedColumn({ type: 'int' })
  Id: number;

  @Column({ nullable: true })
  Group: string;

  @Column()
  Name: string;

  @Column()
  Order: string;
}
// #endregion

// #endregion
