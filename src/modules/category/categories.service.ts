import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schemas/category.schema';
import { MongoHelper } from 'src/common/db';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>
  ) { }

  public async findAll(): Promise<Category[]> {
    const result = await this.categoryModel.find().exec();
    return result.map(el => MongoHelper.map(el.toObject()));
  }
}
