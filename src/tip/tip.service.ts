// #region Imports
import { Injectable } from '@nestjs/common';
import { TipEntityService } from '../entity/tip-entity/tip-entity.service';
// #endregion

type DateRange = { From: string; To: string };

@Injectable()
export class TipService {
  constructor(private readonly tipEntityService: TipEntityService) {}

  // #region Category APIs
  async selectCategoryPublicInfo(): Promise<any> {
    // TODO: Implement - fetch public category info with latest tips
    // Returns: { categoryList: [{ categoryName, tipsNum, latestTips: [{ publicationDateTime, tipName }] }] }
    return Promise.resolve({ categoryList: [] });
  }

  async selectCategoryManageInfo(filter: {
    CategoryName?: string;
    PublicationState?: string;
    PublicationDateTime?: DateRange;
    UpdateDateTime?: DateRange;
    InsertDateTime?: DateRange;
  }): Promise<any> {
    // TODO: Implement - fetch manage category info with filters
    return Promise.resolve({ categoryList: [] });
  }

  async selectCategoryManageDetail(categoryName: string): Promise<any> {
    // TODO: Implement - fetch category detail with presets
    return Promise.resolve({});
  }

  async selectCategories(): Promise<any> {
    // TODO: Implement - fetch all category names
    return Promise.resolve({ categoryList: [] });
  }

  async registerCategoryOrders(categoryList: string[]): Promise<any> {
    // TODO: Implement - update category order
    return Promise.resolve({ effectedNum: 0 });
  }

  async registerCategory(payload: any): Promise<any> {
    // TODO: Implement - register new category with presets
    // payload: { CategoryName, PublicationState, PublicationDateTime, Presets }
    return Promise.resolve({ effectedNum: 0 });
  }
  // #endregion

  // #region Public Tip APIs
  async selectPublicInfo(filter: {
    Category?: string;
    Tag?: string[];
    TipName?: string[];
  }): Promise<any> {
    // TODO: Implement - fetch public tip info with filters
    return Promise.resolve({ tipList: [] });
  }

  async selectPublicDetail(category: string, name: string): Promise<any> {
    // TODO: Implement - fetch public tip detail with sections and relations
    return Promise.resolve({});
  }
  // #endregion

  // #region Manage Tip APIs
  async selectManageInfo(filter: {
    CategoryName?: string[];
    Tag?: string[];
    TipName?: string[];
    PublicationState?: string;
    PublicationDateTime?: DateRange;
    UpdateDateTime?: DateRange;
    InsertDateTime?: DateRange;
  }): Promise<any> {
    // TODO: Implement - fetch manage tip info with filters
    return Promise.resolve({ tipList: [] });
  }

  async selectManageDetail(category: string, name: string): Promise<any> {
    // TODO: Implement - fetch manage tip detail with sections and relations
    return Promise.resolve({});
  }

  async register(payload: any): Promise<any> {
    // TODO: Implement - register new tip with sections and relations
    // payload: { Category, Name, Tags, PublicationState, PublicationDateTime, Overview, Sections, Relations }
    return Promise.resolve({ effectedNum: 0 });
  }
  // #endregion
}
