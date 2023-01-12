import {
  IsString,
  IsNotEmpty,
} from 'class-validator';
import { ProtectedRouteDto } from '../../../common/dto';

export class CompleteChallengeDto extends ProtectedRouteDto {

  @IsString()
  @IsNotEmpty()
  readonly lessonId: string;

  @IsString()
  @IsNotEmpty()
  readonly lives: string;
}
