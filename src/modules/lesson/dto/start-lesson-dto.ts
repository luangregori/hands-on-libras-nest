import {
  IsString,
  IsNotEmpty,
} from 'class-validator';
import { ProtectedRouteDto } from '../../../common/dto';

export class StartLessonDto extends ProtectedRouteDto {

  @IsString()
  @IsNotEmpty()
  readonly lessonId: string;
}
