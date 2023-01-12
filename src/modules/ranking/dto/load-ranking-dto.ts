import {
  IsNotEmpty,
  IsNumber,
} from 'class-validator';
import { ProtectedRouteDto } from '../../../common/dto';

export class LoadRankingDto extends ProtectedRouteDto {

  @IsNumber()
  @IsNotEmpty()
  readonly days: number;
}
