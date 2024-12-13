import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { IsAtLeastOneProperty } from 'src/common/decorators/IsAtLeastOneProperty.decorator';
import { Match } from 'src/common/decorators/match.decorator';

export class ResetPasswordDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @ApiProperty({
    description: 'The password for the user',
    minLength: 4,
    maxLength: 20,
    required: true,
  })
  password: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Match('password')
  @ApiProperty({
    description: 'The confirmation of the password for the user',
    minLength: 4,
    maxLength: 20,
    required: true,
  })
  confirmPassword: string;
}

export class RequestResetDTO {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: 'Email address of the user requesting password reset',
    required: true,
  })
  email: string;
}

export class ForgotPasswordDTO {
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

  @IsAtLeastOneProperty('email', 'contact')
  contactOrEmailPresent: string;
}
