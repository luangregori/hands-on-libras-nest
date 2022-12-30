import {
  MaxLength,
  IsNotEmpty,
  IsEmail,
  IsString,
} from 'class-validator';

export class LoginDto {

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  readonly password: string;
}
