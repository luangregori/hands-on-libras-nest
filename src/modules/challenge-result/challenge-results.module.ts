import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChallengeResultSchema, ChallengeResult } from './schemas/challenge-result.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChallengeResult.name, schema: ChallengeResultSchema },
    ]),
  ],
  providers: [],
  controllers: [],
  exports: [
    MongooseModule.forFeature([
      { name: ChallengeResult.name, schema: ChallengeResultSchema },
    ]),
  ]
})
export class ChallengeResultsModule { }
