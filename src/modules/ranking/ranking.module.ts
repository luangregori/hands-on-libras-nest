import { forwardRef, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RankingService } from './ranking.service';
import { RankingController } from './ranking.controller';
import { AuthMiddleware } from '../../common/middlewares';
import { ChallengeResultsModule } from '../challenge-result/challenge-results.module';
import { UsersModule } from '../user/users.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    ChallengeResultsModule
  ],
  providers: [RankingService],
  controllers: [RankingController],
  exports: [
    RankingService
  ]
})
export class RankingModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes('ranking');
  }
}

