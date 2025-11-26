// #region Imports
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
// #endregion

// #region Entities (story-entity)

// #region D_StoryVolume
@Entity()
export class D_StoryVolume {
  @PrimaryGeneratedColumn({ type: 'int' })
  Id: number;

  @Column()
  Title: string;

  @Column({ nullable: true })
  Overview: string;

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

// #region D_StoryPart
@Entity()
export class D_StoryPart {
  @PrimaryGeneratedColumn({ type: 'int' })
  Id: number;

  @Column()
  VolumeTitle: string;

  @Column()
  Title: string;

  @Column({ nullable: true })
  Summary: string;

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

// #region D_StoryChapter
@Entity()
export class D_StoryChapter {
  @PrimaryGeneratedColumn({ type: 'int' })
  Id: number;

  @Column()
  VolumeTitle: string;

  @Column()
  PartTitle: string;

  @Column()
  Title: string;

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

// #region D_StoryBody
@Entity()
export class D_StoryBody {
  @PrimaryGeneratedColumn({ type: 'int' })
  Id: number;

  @Column()
  VolumeTitle: string;

  @Column()
  PartTitle: string;

  @Column()
  ChapterTitle: string;

  @Column()
  Page: string;

  @Column({ nullable: true })
  Text: string;
}

// #endregion
