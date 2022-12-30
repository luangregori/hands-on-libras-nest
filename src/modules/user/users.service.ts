import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken'
import { User } from './schemas/user.schema';
import { Authentication } from './dto/auth-dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
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

  public async auth(email: string, password: string): Promise<Authentication.Result> {
    const user = await this.userModel.findOne({ email })
    if (user) {
      const isValid = await bcrypt.compare(password, user.password)
      if (isValid) {
        const expiresIn = this.configService.get('JWT_VERIFICATION_TOKEN_EXPIRATION_TIME')
        const accessToken = jwt.sign(
          { email: user.email },
          this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
          { expiresIn }
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
}
