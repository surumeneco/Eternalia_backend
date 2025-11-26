// #region Imports
import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { M_Account, M_Div, M_Category, M_Class, M_Tag } from './generals';
// #endregion

@Injectable()
export class GeneralEntityService {
  // #region Constructor Injection
  constructor(
    @Inject('M_ACCOUNT_REPOSITORY')
    private readonly accountRepo: Repository<M_Account>,

    @Inject('M_DIV_REPOSITORY')
    private readonly divRepo: Repository<M_Div>,

    @Inject('M_CATEGORY_REPOSITORY')
    private readonly categoryRepo: Repository<M_Category>,

    @Inject('M_CLASS_REPOSITORY')
    private readonly classRepo: Repository<M_Class>,

    @Inject('M_TAG_REPOSITORY')
    private readonly tagRepo: Repository<M_Tag>,
  ) {}
  // #endregion

  // #region M_Account CRUD
  createAccount(payload: Partial<M_Account>) {
    return this.accountRepo.save(payload as M_Account);
  }

  findAllAccounts() {
    return this.accountRepo.find();
  }

  findAccountById(id: string) {
    return this.accountRepo.findOneBy({ Id: id });
  }

  async updateAccount(id: string, payload: Partial<M_Account>) {
    await this.accountRepo.update({ Id: id }, payload);
    return this.findAccountById(id);
  }

  removeAccount(id: string) {
    return this.accountRepo.delete({ Id: id });
  }
  // #endregion

  // #region M_Div CRUD (composite key: Kind + Name)
  createDiv(payload: Partial<M_Div>) {
    return this.divRepo.save(payload as M_Div);
  }

  findAllDivs() {
    return this.divRepo.find();
  }

  findDiv(kind: string, name: string) {
    return this.divRepo.findOneBy({ Kind: kind, Name: name });
  }

  async updateDiv(kind: string, name: string, payload: Partial<M_Div>) {
    await this.divRepo.update({ Kind: kind, Name: name }, payload);
    return this.findDiv(kind, name);
  }

  removeDiv(kind: string, name: string) {
    return this.divRepo.delete({ Kind: kind, Name: name });
  }
  // #endregion

  // #region M_Category CRUD (key: Name)
  createCategory(payload: Partial<M_Category>) {
    return this.categoryRepo.save(payload as M_Category);
  }

  findAllCategories() {
    return this.categoryRepo.find();
  }

  findCategoryByName(name: string) {
    return this.categoryRepo.findOneBy({ Name: name });
  }

  async updateCategory(name: string, payload: Partial<M_Category>) {
    await this.categoryRepo.update({ Name: name }, payload);
    return this.findCategoryByName(name);
  }

  removeCategory(name: string) {
    return this.categoryRepo.delete({ Name: name });
  }
  // #endregion

  // #region M_Class CRUD (key: Language + Name)
  createClass(payload: Partial<M_Class>) {
    return this.classRepo.save(payload as M_Class);
  }

  findAllClasses() {
    return this.classRepo.find();
  }

  findClass(language: string, name: string) {
    return this.classRepo.findOneBy({ Language: language, Name: name });
  }

  async updateClass(language: string, name: string, payload: Partial<M_Class>) {
    await this.classRepo.update({ Language: language, Name: name }, payload);
    return this.findClass(language, name);
  }

  removeClass(language: string, name: string) {
    return this.classRepo.delete({ Language: language, Name: name });
  }
  // #endregion

  // #region M_Tag CRUD (key: Group + Name)
  createTag(payload: Partial<M_Tag>) {
    return this.tagRepo.save(payload as M_Tag);
  }

  findAllTags() {
    return this.tagRepo.find();
  }

  findTag(group: string, name: string) {
    return this.tagRepo.findOneBy({ Group: group, Name: name });
  }

  async updateTag(group: string, name: string, payload: Partial<M_Tag>) {
    await this.tagRepo.update({ Group: group, Name: name }, payload);
    return this.findTag(group, name);
  }

  removeTag(group: string, name: string) {
    return this.tagRepo.delete({ Group: group, Name: name });
  }
  // #endregion
}
