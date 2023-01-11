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
import { LoadLessonsDto, StartLessonDto } from './dto';

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
  public async login(
    @Res() res,
    @Body() startLessonDto: StartLessonDto,
  ) {
    const infos = await this.lessonService.start(startLessonDto.lessonId, startLessonDto.accountId)
    return res.status(HttpStatus.OK).json(infos);
  }
}
