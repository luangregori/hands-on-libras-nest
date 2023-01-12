import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChallengeQuestionSchema, ChallengeQuestion } from './schemas/challenge-question.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChallengeQuestion.name, schema: ChallengeQuestionSchema },
    ]),
  ],
  providers: [],
  controllers: [],
  exports: [
    MongooseModule.forFeature([
      { name: ChallengeQuestion.name, schema: ChallengeQuestionSchema },
    ]),
  ]
})
export class ChallengeQuestionsModule { }
