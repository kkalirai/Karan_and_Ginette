import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { Gender } from 'src/common/enum/gender.enum';

export class getCreatedWorkoutsDTO {
  @IsNotEmpty()
  pageNumber: number;
  @IsNotEmpty()
  pageLength: number;
  @IsNotEmpty()
  sortKey: string;
  @IsNotEmpty()
  sortOrder: string;
  @IsNotEmpty()
  instructorID: number;
}
export class getCreatedNutriton {
  @IsNotEmpty()
  pageNumber: number;
  @IsNotEmpty()
  pageLength: number;
  @IsNotEmpty()
  sortKey: string;
  @IsNotEmpty()
  sortOrder: string;
  @IsNotEmpty()
  instructorID: number;
}

export class createAdminDTO {
  @IsNotEmpty()
  @ApiProperty({
    example: 'firstname',
    description: 'The first name of the user',
    required: true,
  })
  firstName: string;
  @IsNotEmpty()
  @ApiProperty({
    example: 'Lastnamne',
    description: 'The last name of the user',
    required: true,
  })
  lastName: string;

  @ApiProperty({
    example: 'example@gmail.com',
    description: 'The email of the user',
    required: true,
  })
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsEnum(Gender)
  @ApiProperty({
    enum: Gender,
    example: Gender.male,
    description: 'The gender of the user',
    required: true,
  })
  gender: Gender;
}
