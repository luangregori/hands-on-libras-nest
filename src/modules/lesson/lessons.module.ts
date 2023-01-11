import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LessonService } from './lessons.service';
import { LessonController } from './lessons.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LessonSchema, Lesson } from './schemas/lesson.schema';
import { ChallengeResultsModule } from 'src/modules/challenge-result/challenge-results.module';
import { AuthMiddleware } from 'src/common/middlewares';

@Module({
  imports: [
    ChallengeResultsModule,
    MongooseModule.forFeature([
      { name: Lesson.name, schema: LessonSchema },
    ]),
  ],
  providers: [LessonService],
  controllers: [LessonController],
})
export class LessonsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes('lessons');
  }
}
