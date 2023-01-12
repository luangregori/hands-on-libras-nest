import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LessonService } from './lessons.service';
import { LessonController } from './lessons.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LessonSchema, Lesson } from './schemas/lesson.schema';
import { AuthMiddleware } from '../../common/middlewares';
import { ChallengeResultsModule } from '../challenge-result/challenge-results.module';
import { LearningInfosModule } from '../learning-info/learning-infos.module';
import { ChallengeQuestionsModule } from '../challenge-question/challenge-questions.module';


@Module({
  imports: [
    ChallengeResultsModule,
    LearningInfosModule,
    ChallengeQuestionsModule,
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
