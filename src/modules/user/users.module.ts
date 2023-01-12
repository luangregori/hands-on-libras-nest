import { forwardRef, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UserService } from './users.service';
import { UserController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, User } from './schemas/user.schema';
import { ChallengeResultsModule } from '../challenge-result/challenge-results.module';
import { AuthMiddleware } from 'src/common/middlewares';
import { RankingModule } from '../ranking/ranking.module';

@Module({
  imports: [
    ChallengeResultsModule,
    forwardRef(() => RankingModule),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
    ]),
  ]
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: '/users/register', method: RequestMethod.POST },
        { path: '/users/login', method: RequestMethod.POST },
      )
      .forRoutes('users');
  }
}

