import {
  IsString,
  IsNotEmpty,
} from 'class-validator';

export class StartLessonDto {

  @IsString()
  @IsNotEmpty()
  readonly lessonId: string;
}
