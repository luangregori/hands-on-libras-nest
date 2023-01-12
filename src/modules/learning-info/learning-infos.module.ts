import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LearningInfoSchema, LearningInfo } from './schemas/learning-info.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LearningInfo.name, schema: LearningInfoSchema },
    ]),
  ],
  providers: [],
  controllers: [],
  exports: [
    MongooseModule.forFeature([
      { name: LearningInfo.name, schema: LearningInfoSchema },
    ]),
  ]
})
export class LearningInfosModule { }
