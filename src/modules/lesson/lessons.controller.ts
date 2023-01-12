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
import { LearnLessonDto, LoadLessonsDto, StartLessonDto } from './dto';

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
}
