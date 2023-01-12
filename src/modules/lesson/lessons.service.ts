import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongoHelper } from '../../common/db';
import { Lesson } from './schemas/lesson.schema';
import { StartLessonResult } from './interfaces/lesson.interface';
import { ChallengeResult, StatusChallengeResult } from '../challenge-result/schemas/challenge-result.schema';
import { LearningInfo } from '../learning-info/schemas/learning-info.schema';
import { ChallengeQuestion } from '../challenge-question/schemas/challenge-question.schema';

@Injectable()
export class LessonService {
  constructor(
    @InjectModel(Lesson.name) private readonly lessonModel: Model<Lesson>,
    @InjectModel(ChallengeResult.name) private readonly challengeResultModel: Model<ChallengeResult>,
    @InjectModel(LearningInfo.name) private readonly learningInfoModel: Model<LearningInfo>,
    @InjectModel(ChallengeQuestion.name) private readonly challengeQuestionModel: Model<ChallengeQuestion>
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

  public async learn(lessonId: string): Promise<LearningInfo[]> {
    const result = await this.learningInfoModel.find({ lessonId }).exec();
    return result.map(el => MongoHelper.map(el.toObject()));
  }

  public async completeLearn(lessonId: string, accountId: string): Promise<void> {
    const challengeResult = await this.challengeResultModel.findOne({ lessonId, accountId }).exec();

    if (challengeResult.status === StatusChallengeResult.STARTED) {
      const challengeResultToUpdate = {
        status: StatusChallengeResult.LEARNED,
        score: challengeResult.score + 10
      }

      const set = { updatedAt: new Date() }

      for (const field in challengeResultToUpdate) {
        set[field] = challengeResultToUpdate[field]
      }

      await this.challengeResultModel.findOneAndUpdate({ accountId, lessonId }, { $set: set }, { returnOriginal: false })
    }
  }

  public async challengeLesson(lessonId: string, accountId: string): Promise<ChallengeQuestion[]> {
    const challengeResult = await this.challengeResultModel.findOne({ lessonId, accountId }).exec();

    // Se o test já for completo, não altera o status novamente
    challengeResult.status = challengeResult.status === StatusChallengeResult.COMPLETED
      ? StatusChallengeResult.COMPLETED
      : StatusChallengeResult.TESTED

    await this.challengeResultModel.findOneAndUpdate({ accountId, lessonId }, challengeResult, { returnOriginal: false })
    const questions = await this.challengeQuestionModel.find({ lessonId }).exec();
    return questions.map(el => MongoHelper.map(el.toObject()));
  }

  public async completeChallenge(lessonId: string, accountId: string, lives: number): Promise<void> {
    const challengeResult = await this.challengeResultModel.findOne({ lessonId, accountId }).exec();

    // Se ja completou o desafio, não dá mais pontos
    if (challengeResult.status === StatusChallengeResult.COMPLETED) {
      return
    }

    // Se acabou as vidas, reverte o status e não da pontos
    if (challengeResult.status === StatusChallengeResult.TESTED && lives === 0) {
      challengeResult.status = StatusChallengeResult.LEARNED
      await this.challengeResultModel.findOneAndUpdate({ accountId, lessonId }, challengeResult, { returnOriginal: false })
      return
    }

    // Da pontuação conforme a quantidade de vidas
    challengeResult.status = lives === 3 ? StatusChallengeResult.COMPLETED : StatusChallengeResult.TESTED
    challengeResult.score += lives === 3 ? 90 : lives * 30
    await this.challengeResultModel.findOneAndUpdate({ accountId, lessonId }, challengeResult, { returnOriginal: false })
    return
  }
}
