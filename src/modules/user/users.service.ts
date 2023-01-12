import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken'
import { User } from './schemas/user.schema';
import { ChallengeResult } from '../challenge-result/schemas/challenge-result.schema';
import { MongoHelper } from 'src/common/db';
import { AuthResult } from './interfaces/auth.interface';
import { LoadUserInfo } from './interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(ChallengeResult.name) private readonly challengeResultModel: Model<ChallengeResult>,
    private readonly configService: ConfigService,
  ) { }

  public async createUser(name: string, email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 12)
    const newUser = {
      name,
      email,
      password: hashedPassword,
      email_verified: false,
      image_url: ''
    }

    const user = await this.userModel.create(newUser)
    return user
  }

  public async auth(email: string, password: string): Promise<AuthResult> {
    const user = await this.userModel.findOne({ email })
    if (user) {
      const isValid = await bcrypt.compare(password, user.password)
      if (isValid) {
        const expiresIn = this.configService.get('JWT_VERIFICATION_TOKEN_EXPIRATION_TIME')
        const accessToken = jwt.sign(
          { email: user.email, id: user.id },
          this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
          { expiresIn: `${expiresIn}s` }
        )
        return {
          accessToken,
          expiresIn,
          name: user.name
        }
      }
    }
    throw new UnauthorizedException()
  }

  public async loadScore(accountId: string): Promise<number> {
    let results = await this.challengeResultModel.find({ accountId }).exec();
    const sum = results.reduce((acc, result) => acc + result.score, 0)
    return sum
  }

  public async loadUserInfo(accountId: string): Promise<LoadUserInfo> {
    const result = await this.userModel.findById(accountId)
    const userInfo = MongoHelper.map(result.toObject())
    const { password, ...userWithOutPass } = userInfo

    // TODO: check achievements
    // const achievements = await this.findAchievementsRepository.find(accountId)
    // return Object.assign({}, userWithOutPass, { achievements })

    return Object.assign({}, userWithOutPass)
  }

  public async updateInfosById(accountId: string, params: any): Promise<User> {
    const account = await this.userModel.findById(accountId)
    if (params.newPassword) {
      const isValid = await bcrypt.compare(params.oldPassword, account.password)
      if (!isValid) {
        throw new UnauthorizedException('Invalid password')
      }
      const hashedPassword = await bcrypt.hash(params.newPassword, 12)
      params = { ...params, password: hashedPassword } as any
      delete params.oldPassword
      delete params.newPassword
    }

    if (params.email && params.email !== account.email) {
      params.email_verified = false
    }

    let updatedAccount = await this.userModel.findOneAndUpdate(
      { accountId },
      { $set: params },
      { returnOriginal: false }
    ).exec();

    updatedAccount = MongoHelper.map(updatedAccount.toObject())

    delete updatedAccount.password
    return updatedAccount
  }
}
