import {
  Controller,
  Get,
  Res,
  HttpStatus,
  Post,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto, RegisterDto, ScoreDto, UpdateUserInfoDto, UserInfoDto, } from './dto';
import { RankingService } from '../ranking/ranking.service';

@ApiTags('user')
@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private rankingService: RankingService
  ) { }

  @Post('/register')
  public async register(
    @Res() res,
    @Body() registerDto: RegisterDto,
  ) {
    try {
      if (registerDto.password !== registerDto.passwordConfirmation) {
        throw new BadRequestException('passwordConfirmation must be equal to password')
      }

      const user = await this.userService.createUser(registerDto.name, registerDto.email, registerDto.password)
      const accessToken = await this.userService.auth(user.email, registerDto.password);
      return res.status(HttpStatus.OK).json(accessToken);
    } catch (err) {
      if (err.message.includes('E11000 duplicate key error collection')) {
        return res.status(HttpStatus.FORBIDDEN).json({ statusCode: HttpStatus.FORBIDDEN, message: 'Email already in use' })
      }
      return res.status(err.status).json(err.response);
    }
  }

  @Post('/login')
  public async login(
    @Res() res,
    @Body() loginDto: LoginDto,
  ) {
    try {
      const accessToken = await this.userService.auth(loginDto.email, loginDto.password);
      return res.status(HttpStatus.OK).json(accessToken);
    } catch (err) {
      return res.status(err.status).json(err.response);
    }
  }

  @Post('/score')
  public async score(
    @Res() res,
    @Body() scoreDto: ScoreDto,
  ) {
    const score = await this.userService.loadScore(scoreDto.accountId)
    return res.status(HttpStatus.OK).json(score);
  }

  @Post('/info')
  public async infos(
    @Res() res,
    @Body() userInfoDto: UserInfoDto,
  ) {
    const { accountId } = userInfoDto
    const userInfo = await this.userService.loadUserInfo(accountId)
    const userScore = await this.userService.loadScore(accountId);
    const userRanking = await this.rankingService.load(7);
    const userPosition = userRanking.find(user => user.id.toString() === accountId)?.position;
    return res.status(HttpStatus.OK).json({ userInfo, userScore, userPosition });
  }

  @Post('/update')
  public async updateInfos(
    @Res() res,
    @Body() updateUserInfoDto: UpdateUserInfoDto,
  ) {
    if (updateUserInfoDto.newPassword && !updateUserInfoDto.oldPassword) {
      return new BadRequestException('Missing param: oldPassword')
    }

    const protectedFields = ['id', '_id', 'password']
    for (const field of protectedFields) {
      if (updateUserInfoDto[field]) {
        delete updateUserInfoDto[field]
      }
    }

    const { accountId, ...params } = updateUserInfoDto
    const userInfo = await this.userService.updateInfosById(accountId, params)
    return res.status(HttpStatus.OK).json(userInfo);
  }
}
