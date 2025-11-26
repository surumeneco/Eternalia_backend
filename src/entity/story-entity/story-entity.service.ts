// #region Imports
import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import {
  D_StoryVolume,
  D_StoryPart,
  D_StoryChapter,
  D_StoryBody,
} from './story';
// #endregion

@Injectable()
export class StoryEntityService {
  // #region Constructor Injection
  constructor(
    @Inject('D_STORY_VOLUME_REPOSITORY')
    private readonly volumeRepo: Repository<D_StoryVolume>,

    @Inject('D_STORY_PART_REPOSITORY')
    private readonly partRepo: Repository<D_StoryPart>,

    @Inject('D_STORY_CHAPTER_REPOSITORY')
    private readonly chapterRepo: Repository<D_StoryChapter>,

    @Inject('D_STORY_BODY_REPOSITORY')
    private readonly bodyRepo: Repository<D_StoryBody>,
  ) {}
  // #endregion

  // #region D_StoryVolume CRUD (key: Title)
  createVolume(payload: Partial<D_StoryVolume>) {
    return this.volumeRepo.save(payload as D_StoryVolume);
  }

  findAllVolumes() {
    return this.volumeRepo.find();
  }

  findVolumeByTitle(title: string) {
    return this.volumeRepo.findOneBy({ Title: title });
  }

  async updateVolume(title: string, payload: Partial<D_StoryVolume>) {
    await this.volumeRepo.update({ Title: title }, payload);
    return this.findVolumeByTitle(title);
  }

  removeVolume(title: string) {
    return this.volumeRepo.delete({ Title: title });
  }
  // #endregion

  // #region D_StoryPart CRUD (key: VolumeTitle + Title)
  createPart(payload: Partial<D_StoryPart>) {
    return this.partRepo.save(payload as D_StoryPart);
  }

  findAllParts() {
    return this.partRepo.find();
  }

  findPart(volumeTitle: string, title: string) {
    return this.partRepo.findOneBy({ VolumeTitle: volumeTitle, Title: title });
  }

  async updatePart(
    volumeTitle: string,
    title: string,
    payload: Partial<D_StoryPart>,
  ) {
    await this.partRepo.update(
      { VolumeTitle: volumeTitle, Title: title },
      payload,
    );
    return this.findPart(volumeTitle, title);
  }

  removePart(volumeTitle: string, title: string) {
    return this.partRepo.delete({ VolumeTitle: volumeTitle, Title: title });
  }
  // #endregion

  // #region D_StoryChapter CRUD (key: VolumeTitle + PartTitle + Title)
  createChapter(payload: Partial<D_StoryChapter>) {
    return this.chapterRepo.save(payload as D_StoryChapter);
  }

  findAllChapters() {
    return this.chapterRepo.find();
  }

  findChapter(volumeTitle: string, partTitle: string, title: string) {
    return this.chapterRepo.findOneBy({
      VolumeTitle: volumeTitle,
      PartTitle: partTitle,
      Title: title,
    });
  }

  async updateChapter(
    volumeTitle: string,
    partTitle: string,
    title: string,
    payload: Partial<D_StoryChapter>,
  ) {
    await this.chapterRepo.update(
      { VolumeTitle: volumeTitle, PartTitle: partTitle, Title: title },
      payload,
    );
    return this.findChapter(volumeTitle, partTitle, title);
  }

  removeChapter(volumeTitle: string, partTitle: string, title: string) {
    return this.chapterRepo.delete({
      VolumeTitle: volumeTitle,
      PartTitle: partTitle,
      Title: title,
    });
  }
  // #endregion

  // #region D_StoryBody CRUD (key: VolumeTitle + PartTitle + ChapterTitle + Page)
  createBody(payload: Partial<D_StoryBody>) {
    return this.bodyRepo.save(payload as D_StoryBody);
  }

  findAllBodies() {
    return this.bodyRepo.find();
  }

  findBody(
    volumeTitle: string,
    partTitle: string,
    chapterTitle: string,
    page: string,
  ) {
    return this.bodyRepo.findOneBy({
      VolumeTitle: volumeTitle,
      PartTitle: partTitle,
      ChapterTitle: chapterTitle,
      Page: page,
    });
  }

  async updateBody(
    volumeTitle: string,
    partTitle: string,
    chapterTitle: string,
    page: string,
    payload: Partial<D_StoryBody>,
  ) {
    await this.bodyRepo.update(
      {
        VolumeTitle: volumeTitle,
        PartTitle: partTitle,
        ChapterTitle: chapterTitle,
        Page: page,
      },
      payload,
    );
    return this.findBody(volumeTitle, partTitle, chapterTitle, page);
  }

  removeBody(
    volumeTitle: string,
    partTitle: string,
    chapterTitle: string,
    page: string,
  ) {
    return this.bodyRepo.delete({
      VolumeTitle: volumeTitle,
      PartTitle: partTitle,
      ChapterTitle: chapterTitle,
      Page: page,
    });
  }
  // #endregion
}
