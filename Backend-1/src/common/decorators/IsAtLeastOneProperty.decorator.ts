/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsAtLeastOneProperty(
  property1: string,
  property2: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isAtLeastOneProperty',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property1, property2],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [property1, property2] = args.constraints;
          return !!args.object[property1] || !!args.object[property2];
        },
        defaultMessage(args: ValidationArguments) {
          const [property1, property2] = args.constraints;
          return `${property1} or ${property2} is required`;
        },
      },
    });
  };
}
