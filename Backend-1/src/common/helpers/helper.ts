/* eslint-disable prettier/prettier */
import { ValidationError } from 'class-validator';
import {
  HttpException,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function translateErrors(
  validationErrors: ValidationError[],
): UnprocessableEntityException {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const encounteredPayloads = new Set<string>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const encounteredErrors = new Set<string>();

  console.log(validationErrors, 'encounteredErrors');
  // validationErrors.forEach(error => {
  //     // Check if the error message contains "should not be empty"
  //     const constraints = Object.values(error.constraints).join(', ');
  //     if (constraints.includes('should not be empty')) {
  //         encounteredPayloads.add('Payload is missing');
  //     } else {
  //         encounteredErrors.add('Validation failed');
  //     }
  // });

  // const finalErrorMessage = [...encounteredPayloads, ...encounteredErrors].join(', ');
  // console.log("finalErrorMessage", finalErrorMessage);

  return new HttpException('Something Went Wrong!', 422);
}

export function convertToFullDayName(abbreviatedDay: string): string {
  switch (abbreviatedDay) {
    case 'M':
      return 'Monday';
    case 'T':
      return 'Tuesday';
    case 'W':
      return 'Wednesday';
    case 'T':
      return 'Thursday';
    case 'F':
      return 'Friday';
    case 'S':
      return 'Saturday';
    case 'S':
      return 'Sunday';
    default:
      return abbreviatedDay; // If the abbreviation is not recognized, return it as is
  }
}

export const storage = diskStorage({
  destination: 'public/uploads',
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    callback(
      null,
      file.fieldname + '-' + uniqueSuffix + extname(file.originalname),
    );
  },
});

export const imageFileFilter = (req, file, callback) => {
  if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|svg)$/)) {
    return callback(
      new HttpException(
        'Only image files are allowed!',
        HttpStatus.BAD_REQUEST,
      ),
      false,
    );
  }
  callback(null, true);
};
