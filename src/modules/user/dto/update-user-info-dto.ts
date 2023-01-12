import {
  MaxLength,
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsUrl,
} from 'class-validator';
import { ProtectedRouteDto } from 'src/common/dto';

export class UpdateUserInfoDto extends ProtectedRouteDto {

  @IsString()
  @IsOptional()
  readonly name;

  @IsString()
  @IsEmail()
  @IsOptional()
  readonly email: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  readonly image_url: string;

  @IsString()
  @MinLength(6)
  @MaxLength(30)
  @IsOptional()
  readonly oldPassword: string;

  @IsString()
  @MinLength(6)
  @MaxLength(30)
  @IsOptional()
  readonly newPassword;

  @IsString()
  @MinLength(6)
  @MaxLength(30)
  @IsOptional()
  readonly password;
}
