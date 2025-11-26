// #region Imports
import { Controller, Get, Post, Put, Param, Body, Query } from '@nestjs/common';
import { TipService } from './tip.service';
// #endregion

@Controller('api/tip')
export class TipController {
  constructor(private readonly tipService: TipService) {}

  // #region Category APIs (public / manage)
  @Get('categories/public-info')
  selectCategoryPublicInfo() {
    // TODO: Implement controller logic if needed
    return this.tipService.selectCategoryPublicInfo();
  }

  @Get('categories/manage-info')
  selectCategoryManageInfo(@Query() filter: any) {
    // TODO: Implement controller logic if needed
    // Note: any `*DateTime` fields in `filter` should be objects `{ From, To }`.
    return this.tipService.selectCategoryManageInfo(filter);
  }

  @Get('categories/:categoryName/manage-detail')
  selectCategoryManageDetail(@Param('categoryName') categoryName: string) {
    // TODO: Implement controller logic if needed
    return this.tipService.selectCategoryManageDetail(categoryName);
  }

  @Get('categories')
  selectCategories() {
    // TODO: Implement controller logic if needed
    return this.tipService.selectCategories();
  }

  @Put('categories/orders')
  registerCategoryOrders(@Body() body: { CategoryList: string[] }) {
    // TODO: Implement controller logic if needed
    return this.tipService.registerCategoryOrders(body.CategoryList || []);
  }

  @Post('categories')
  registerCategory(@Body() body: any) {
    // TODO: Implement controller logic if needed
    // `PublicationDateTime` fields expected as `{ From, To }` when used for search ranges;
    // here they are single values for registration.
    return this.tipService.registerCategory(body);
  }
  // #endregion

  // #region Public Tip APIs
  @Get('select/public')
  selectPublicInfo(@Query() filter: any) {
    // TODO: Implement controller logic if needed
    // filter: { Category?: string, Tag?: string[], TipName?: string[] }
    return this.tipService.selectPublicInfo(filter);
  }

  @Get('public/:category/:name')
  selectPublicDetail(
    @Param('category') category: string,
    @Param('name') name: string,
  ) {
    // TODO: Implement controller logic if needed
    return this.tipService.selectPublicDetail(category, name);
  }
  // #endregion

  // #region Manage Tip APIs
  @Get('select/manage')
  selectManageInfo(@Query() filter: any) {
    // TODO: Implement controller logic if needed
    // filter may contain arrays and date-range objects
    return this.tipService.selectManageInfo(filter);
  }

  @Get('manage/:category/:name')
  selectManageDetail(
    @Param('category') category: string,
    @Param('name') name: string,
  ) {
    // TODO: Implement controller logic if needed
    return this.tipService.selectManageDetail(category, name);
  }

  @Post('register')
  register(@Body() body: any) {
    // TODO: Implement controller logic if needed
    // body contains Category, Name, Tags, PublicationState, PublicationDateTime, Overview, Sections, Relations
    return this.tipService.register(body);
  }
  // #endregion
}
