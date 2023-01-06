import { Module } from '@nestjs/common';
import { LessonService } from './lessons.service';
import { LessonController } from './lessons.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LessonSchema, Lesson } from './schemas/lesson.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Lesson.name, schema: LessonSchema },
    ]),
  ],
  providers: [LessonService],
  controllers: [LessonController],
})
export class LessonsModule { }
