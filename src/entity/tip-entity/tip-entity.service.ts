// #region Imports
import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import {
  D_CategorySectionPreset,
  D_Tip,
  D_TipRelation,
  D_TipSection,
  D_TipTag,
} from './tips';
// #endregion

@Injectable()
export class TipEntityService {
  // #region Constructor Injection
  constructor(
    @Inject('D_CATEGORY_SECTION_PRESET_REPOSITORY')
    private readonly categoryPresetRepo: Repository<D_CategorySectionPreset>,

    @Inject('D_TIP_REPOSITORY')
    private readonly tipRepo: Repository<D_Tip>,

    @Inject('D_TIP_RELATION_REPOSITORY')
    private readonly tipRelationRepo: Repository<D_TipRelation>,

    @Inject('D_TIP_SECTION_REPOSITORY')
    private readonly tipSectionRepo: Repository<D_TipSection>,

    @Inject('D_TIP_TAG_REPOSITORY')
    private readonly tipTagRepo: Repository<D_TipTag>,
  ) {}
  // #endregion

  // #region D_CategorySectionPreset CRUD (key: CategoryName + SectionName)
  createCategoryPreset(payload: Partial<D_CategorySectionPreset>) {
    return this.categoryPresetRepo.save(payload as D_CategorySectionPreset);
  }

  findAllCategoryPresets() {
    return this.categoryPresetRepo.find();
  }

  findCategoryPreset(categoryName: string, sectionName: string) {
    return this.categoryPresetRepo.findOneBy({
      CategoryName: categoryName,
      SectionName: sectionName,
    });
  }

  async updateCategoryPreset(
    categoryName: string,
    sectionName: string,
    payload: Partial<D_CategorySectionPreset>,
  ) {
    await this.categoryPresetRepo.update(
      { CategoryName: categoryName, SectionName: sectionName },
      payload,
    );
    return this.findCategoryPreset(categoryName, sectionName);
  }

  removeCategoryPreset(categoryName: string, sectionName: string) {
    return this.categoryPresetRepo.delete({
      CategoryName: categoryName,
      SectionName: sectionName,
    });
  }
  // #endregion

  // #region D_Tip CRUD (key: CategoryName + Name)
  createTip(payload: Partial<D_Tip>) {
    return this.tipRepo.save(payload as D_Tip);
  }

  findAllTips() {
    return this.tipRepo.find();
  }

  findTip(categoryName: string, name: string) {
    return this.tipRepo.findOneBy({ CategoryName: categoryName, Name: name });
  }

  async updateTip(categoryName: string, name: string, payload: Partial<D_Tip>) {
    await this.tipRepo.update(
      { CategoryName: categoryName, Name: name },
      payload,
    );
    return this.findTip(categoryName, name);
  }

  removeTip(categoryName: string, name: string) {
    return this.tipRepo.delete({ CategoryName: categoryName, Name: name });
  }
  // #endregion

  // #region D_TipRelation CRUD (key: CategoryName + TipName + RelateCategoryName + RelateTipName)
  createTipRelation(payload: Partial<D_TipRelation>) {
    return this.tipRelationRepo.save(payload as D_TipRelation);
  }

  findAllTipRelations() {
    return this.tipRelationRepo.find();
  }

  findTipRelation(
    categoryName: string,
    tipName: string,
    relateCategoryName: string,
    relateTipName: string,
  ) {
    return this.tipRelationRepo.findOneBy({
      CategoryName: categoryName,
      TipName: tipName,
      RelateCategoryName: relateCategoryName,
      RelateTipName: relateTipName,
    });
  }

  async updateTipRelation(
    categoryName: string,
    tipName: string,
    relateCategoryName: string,
    relateTipName: string,
    payload: Partial<D_TipRelation>,
  ) {
    await this.tipRelationRepo.update(
      {
        CategoryName: categoryName,
        TipName: tipName,
        RelateCategoryName: relateCategoryName,
        RelateTipName: relateTipName,
      },
      payload,
    );
    return this.findTipRelation(
      categoryName,
      tipName,
      relateCategoryName,
      relateTipName,
    );
  }

  removeTipRelation(
    categoryName: string,
    tipName: string,
    relateCategoryName: string,
    relateTipName: string,
  ) {
    return this.tipRelationRepo.delete({
      CategoryName: categoryName,
      TipName: tipName,
      RelateCategoryName: relateCategoryName,
      RelateTipName: relateTipName,
    });
  }
  // #endregion

  // #region D_TipSection CRUD (key: CategoryName + TipName + Name)
  createTipSection(payload: Partial<D_TipSection>) {
    return this.tipSectionRepo.save(payload as D_TipSection);
  }

  findAllTipSections() {
    return this.tipSectionRepo.find();
  }

  findTipSection(categoryName: string, tipName: string, name: string) {
    return this.tipSectionRepo.findOneBy({
      CategoryName: categoryName,
      TipName: tipName,
      Name: name,
    });
  }

  async updateTipSection(
    categoryName: string,
    tipName: string,
    name: string,
    payload: Partial<D_TipSection>,
  ) {
    await this.tipSectionRepo.update(
      { CategoryName: categoryName, TipName: tipName, Name: name },
      payload,
    );
    return this.findTipSection(categoryName, tipName, name);
  }

  removeTipSection(categoryName: string, tipName: string, name: string) {
    return this.tipSectionRepo.delete({
      CategoryName: categoryName,
      TipName: tipName,
      Name: name,
    });
  }
  // #endregion

  // #region D_TipTag CRUD (key: CategoryName + TipName + Tag)
  createTipTag(payload: Partial<D_TipTag>) {
    return this.tipTagRepo.save(payload as D_TipTag);
  }

  findAllTipTags() {
    return this.tipTagRepo.find();
  }

  findTipTag(categoryName: string, tipName: string, tag: string) {
    return this.tipTagRepo.findOneBy({
      CategoryName: categoryName,
      TipName: tipName,
      Tag: tag,
    });
  }

  async updateTipTag(
    categoryName: string,
    tipName: string,
    tag: string,
    payload: Partial<D_TipTag>,
  ) {
    await this.tipTagRepo.update(
      { CategoryName: categoryName, TipName: tipName, Tag: tag },
      payload,
    );
    return this.findTipTag(categoryName, tipName, tag);
  }

  removeTipTag(categoryName: string, tipName: string, tag: string) {
    return this.tipTagRepo.delete({
      CategoryName: categoryName,
      TipName: tipName,
      Tag: tag,
    });
  }
  // #endregion
}
