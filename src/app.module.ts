import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule, CategoriesModule, LessonsModule, ChallengeResultsModule, ChallengeQuestionsModule, RankingModule } from './modules';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URL'),
        useNewUrlParser: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    CategoriesModule,
    LessonsModule,
    ChallengeResultsModule,
    ChallengeQuestionsModule,
    RankingModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
