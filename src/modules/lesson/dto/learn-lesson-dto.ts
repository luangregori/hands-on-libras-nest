import {
  IsString,
  IsNotEmpty,
} from 'class-validator';
import { ProtectedRouteDto } from '../../../common/dto';

export class LearnLessonDto extends ProtectedRouteDto {

  @IsString()
  @IsNotEmpty()
  readonly lessonId: string;
}
