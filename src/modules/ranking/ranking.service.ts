import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { MongoHelper } from '../../common/db'
import { User } from '../user/schemas/user.schema';
import { ChallengeResult } from '../challenge-result/schemas/challenge-result.schema';
import { LoadRankingResult } from './interfaces/ranking.interface';

@Injectable()
export class RankingService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(ChallengeResult.name) private readonly challengeResultModel: Model<ChallengeResult>,
  ) { }

  public async load(days: number): Promise<LoadRankingResult[]> {
    // 1. Diminui a quantidade de dias e faz a busca pelos TEST-RESULTS
    const now = new Date()
    const dateToCompare = new Date(now.setDate(now.getDate() - days))
    const results = await this.challengeResultModel.find({
      updatedAt: {
        $gte: dateToCompare
      }
    }).limit(20).exec();

    // 2. Agrupa os resultados por ACCOUNT-ID
    const groupsByAccountId = results.reduce((groups, item) => ({
      ...groups,
      [item.accountId]: [...(groups[item.accountId] || []), item]
    }), {})

    const ranking: Array<LoadRankingResult> = []

    // 3. Para cada grupo, calcula a pontuação e busca o ACCOUNT
    for (const [key, value] of Object.entries(groupsByAccountId)) {
      const account = await this.userModel.findById(key)
      const results = value as Array<ChallengeResult>
      const scoreSum = results.reduce((previousValue, currentValue) => previousValue + currentValue.score, 0)
      ranking.push({
        position: 0,
        name: account.name,
        score: scoreSum,
        id: account.id,
        image_url: account.image_url
      })
    }

    // 4. Ordena o ranking por pontuação
    const inOrderRanking = ranking.sort((a, b) => { return b.score - a.score })

    // 5. Adiciona a posição no ranking
    let position = 1
    for (const result of inOrderRanking) {
      result.position = position
      position++
    }

    return ranking
  }
}
