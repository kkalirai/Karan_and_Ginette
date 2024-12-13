import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  Validate,
} from 'class-validator';

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

export class LoginUserDTO {
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
  @ApiProperty({
    description: 'The password for the user',
    required: true,
  })
  password: string;

  @Validate(ValidateAtLeastOne, ['email', 'contact'])
  contactOrEmailPresent: string; // This property is not used, it's just for validation purposes
}
