import {
  Controller,
  Get,
  Res,
  HttpStatus,
  Post,
  Body,
} from '@nestjs/common';
import { LessonService } from './lessons.service';
import { ApiTags } from '@nestjs/swagger';
import { ChallengeLessonDto, CompleteChallengeDto, CompleteLearnDto, LearnLessonDto, LoadLessonsDto, StartLessonDto } from './dto';

@ApiTags('lesson')
@Controller('lessons')
export class LessonController {
  constructor(
    private lessonService: LessonService
  ) { }

  @Post()
  public async getAllLessons(
    @Res() res,
    @Body() loadLessonsDto: LoadLessonsDto,
  ) {
    const lessons = loadLessonsDto.categoryId ?
      await this.lessonService.findByCategoryId(loadLessonsDto.categoryId) :
      await this.lessonService.findAll();
    return res.status(HttpStatus.OK).json(lessons);
  }

  @Post('/start')
  public async start(
    @Res() res,
    @Body() startLessonDto: StartLessonDto,
  ) {
    const infos = await this.lessonService.start(startLessonDto.lessonId, startLessonDto.accountId);
    return res.status(HttpStatus.OK).json(infos);
  }

  @Post('/learn')
  public async learn(
    @Res() res,
    @Body() learnLessonDto: LearnLessonDto,
  ) {
    const infos = await this.lessonService.learn(learnLessonDto.lessonId);
    return res.status(HttpStatus.OK).json(infos);
  }

  @Post('/learn/complete')
  public async completeLearn(
    @Res() res,
    @Body() completeLearnDto: CompleteLearnDto,
  ) {

    await this.lessonService.completeLearn(completeLearnDto.lessonId, completeLearnDto.accountId);
    //TODO: check achievements

    return res.status(HttpStatus.OK).json();
  }

  @Post('/challenge')
  public async challengeLesson(
    @Res() res,
    @Body() challengeLessonDto: ChallengeLessonDto,
  ) {

    const infos = await this.lessonService.challengeLesson(challengeLessonDto.lessonId, challengeLessonDto.accountId);

    return res.status(HttpStatus.OK).json(infos);
  }

  @Post('/challenge/complete')
  public async completeChallenge(
    @Res() res,
    @Body() completeChallengeDto: CompleteChallengeDto,
  ) {

    await this.lessonService.completeChallenge(completeChallengeDto.lessonId, completeChallengeDto.accountId, Number(completeChallengeDto.lives));
    //TODO: check achievements

    return res.status(HttpStatus.OK).json();
  }
}
