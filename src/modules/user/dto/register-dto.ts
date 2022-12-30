import {
  MaxLength,
  IsNotEmpty,
  IsEmail,
  IsString,
  MinLength,

} from 'class-validator';

export class RegisterDto {

  @IsString()
  @IsNotEmpty()
  readonly name;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(30)
  @IsNotEmpty()
  readonly password: string;

  @IsString()
  @MinLength(6)
  @MaxLength(30)
  @IsNotEmpty()
  readonly passwordConfirmation;
}
