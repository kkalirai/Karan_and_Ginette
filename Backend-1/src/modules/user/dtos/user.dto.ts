import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsNotEmpty, IsNumber, Matches } from 'class-validator';

export class heightDTO {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    example: 170,
    description: 'User Height',
    required: true,
  })
  readonly height: number;
}

export class weightDTO {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    example: 70,
    description: 'User weight',
    required: true,
  })
  readonly weight: number;
}

export class userIDDTO {
  @IsNotEmpty()
  @ApiProperty({
    example: 1,
    description: 'User ID',
    required: true,
  })
  readonly userID: number;
}

export class CompletedWorkoutsDTO {
  @IsNotEmpty()
  @ApiProperty({
    example: 1,
    description: 'User ID',
    required: true,
  })
  readonly userID: number;

  @IsNotEmpty()
  @Matches(/^([0-3][0-9])\/([0-1][0-9])\/\d{4}$/, {
    message: 'Date must be in the format DD/MM/YYYY',
  })
  @ApiProperty({
    example: 'DD/MM/YYYY',
    description: '',
    required: true,
  })
  readonly date: string;
}
