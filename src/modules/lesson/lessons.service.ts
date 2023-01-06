import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Lesson } from './schemas/lesson.schema';

@Injectable()
export class LessonService {
  constructor(
    @InjectModel(Lesson.name) private readonly lessonModel: Model<Lesson>
  ) { }

  public async findAll(): Promise<Lesson[]> {
    return this.lessonModel.find().exec();
  }

  public async findByCategoryId(categoryId: string): Promise<Lesson[]> {
    return this.lessonModel.find({ categoryId }).exec();
  }
}
