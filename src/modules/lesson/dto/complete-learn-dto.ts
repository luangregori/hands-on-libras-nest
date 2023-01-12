import {
  IsString,
  IsNotEmpty,
} from 'class-validator';
import { ProtectedRouteDto } from '../../../common/dto';

export class CompleteLearnDto extends ProtectedRouteDto {

  @IsString()
  @IsNotEmpty()
  readonly lessonId: string;
}
