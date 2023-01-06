import {
  IsString,
  IsOptional,
} from 'class-validator';

export class LoadLessonsDto {

  @IsString()
  @IsOptional()
  readonly categoryId: string;
}
