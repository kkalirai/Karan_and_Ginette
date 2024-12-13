// Custom validation class
class ValidateAtLeastOne {
  validate(value: any, args: any) {
    const [firstPropertyName, secondPropertyName] = args.constraints;
    const firstProperty = value[firstPropertyName];
    const secondProperty = value[secondPropertyName];
    if (!firstProperty && !secondProperty) {
      return false;
    }
    return true;
  }

  defaultMessage(args: any) {
    const [firstPropertyName, secondPropertyName] = args.constraints;
    return `${firstPropertyName} or ${secondPropertyName} is required.`;
  }
}

import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  IsOptional,
  Validate,
  isNumber,
  IsNumber,
  isString,
} from 'class-validator';
import { Match } from 'src/common/decorators/match.decorator';
import { Gender } from 'src/common/enum/gender.enum';
import { RoleENUM } from 'src/common/enum/userRole.enum';

export class verifyOTPDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'xxxxxx',
  })
  otp: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @ApiProperty({
    example: 'example@gmail.com',
  })
  email: string;
}

export class resendOTPDTO {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    example: 'xx',
  })
  userID: number;
}

export class CreateUserDTO {
  @IsNotEmpty()
  @ApiProperty({
    example: 'Nikhil',
    description: 'The first name of the user',
    required: true,
  })
  firstName: string;

  @ApiProperty({
    example: 'Bansal',
    description: 'The last name of the user',
    required: true,
  })
  @IsNotEmpty()
  lastName: string;

  @IsOptional()
  @IsEmail()
  @ApiProperty({
    example: 'nikhil@example.com',
    description: 'The email address of the user',
  })
  email?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: '+1234567890',
    description: 'The contact number of the user',
  })
  contact?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @ApiProperty({
    description: 'The password for the user',
    minLength: 4,
    maxLength: 20,
    required: true,
  })
  password: string;

  @Validate(ValidateAtLeastOne, ['email', 'contact'])
  contactOrEmailPresent: string;

  @IsEnum(RoleENUM)
  @ApiProperty({
    enum: RoleENUM,
    example: RoleENUM.user,
    description: 'The role of the user',
  })
  role: RoleENUM;
}

export class updateProfileDTO {
  @IsNotEmpty()
  @ApiProperty({
    example: 'Nikhil',
    description: 'The first name of the user',
    required: true,
  })
  firstName: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'Bansal',
    description: 'The last name of the user',
    required: true,
  })
  lastName: string;

  @IsOptional()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    message:
      'Password must be at least 8 characters long and contain at least one letter and one number',
  })
  @ApiProperty({
    example: 'password123',
    description: 'The password of the user',
  })
  password?: string;

  @IsOptional()
  @ApiProperty({
    example: 'password123',
    description: 'Confirmation of the password',
  })
  confirmPassword?: string;
}
