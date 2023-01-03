import {
  Controller,
  Get,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { CategoryService } from './categories.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('category')
@Controller('categories')
export class CategoryController {
  constructor(
    private categoryService: CategoryService
  ) { }

  @Get()
  public async getAllCategories(
    @Res() res,
  ) {
    const categories = await this.categoryService.findAll();
    return res.status(HttpStatus.OK).json(categories);
  }
}
