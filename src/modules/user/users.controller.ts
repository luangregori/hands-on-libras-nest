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
import { LoginDto } from './dto';
import { RegisterDto } from './dto/register-dto';
import { ScoreDto } from './dto/score-dto';

@ApiTags('user')
@Controller('users')
export class UserController {
  constructor(
    private userService: UserService
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
}
