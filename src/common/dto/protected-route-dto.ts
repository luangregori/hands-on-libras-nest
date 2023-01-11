import {
  IsString,
  IsNotEmpty,
} from 'class-validator';

export class ProtectedRouteDto {

  @IsString()
  @IsNotEmpty()
  readonly accountId: string;
}
