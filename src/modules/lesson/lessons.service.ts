import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Lesson } from './schemas/lesson.schema';
import { StartLessonResult } from './interfaces/lesson.interface';
import { ChallengeResult, StatusChallengeResult } from 'src/modules/challenge-result/schemas/challenge-result.schema';
import { MongoHelper } from 'src/common/db';

@Injectable()
export class LessonService {
  constructor(
    @InjectModel(Lesson.name) private readonly lessonModel: Model<Lesson>,
    @InjectModel(ChallengeResult.name) private readonly challengeResultModel: Model<ChallengeResult>
  ) { }

  public async findAll(): Promise<Lesson[]> {
    const result = await this.lessonModel.find().exec();
    return result.map(el => MongoHelper.map(el.toObject()));
  }

  public async findByCategoryId(categoryId: string): Promise<Lesson[]> {
    const result = await this.lessonModel.find({ categoryId }).exec();
    return result.map(el => MongoHelper.map(el.toObject()));
  }

  public async start(lessonId: string, accountId: string): Promise<StartLessonResult> {
    const lessonInfoResult = await this.lessonModel.findById(lessonId).exec();
    const lessonInfo = MongoHelper.map(lessonInfoResult.toObject())

    let userInfo;

    let userInfoResult = await this.challengeResultModel.findOne({ lessonId, accountId }).exec();
    if (userInfoResult) {
      userInfo = MongoHelper.map(userInfoResult.toObject())
    } else {
      const newChallengeResult = {
        accountId,
        lessonId,
        status: StatusChallengeResult.STARTED,
        score: 0,
        updatedAt: new Date()
      }

      const userInfoCreated = await this.challengeResultModel.create(newChallengeResult)
      userInfo = MongoHelper.map(userInfoCreated.toObject())
    }

    return {
      lessonInfo,
      userInfo
    }
  }
}
