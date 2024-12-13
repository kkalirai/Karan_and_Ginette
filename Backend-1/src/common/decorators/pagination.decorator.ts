/* eslint-disable prettier/prettier */
import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

interface QueryParamsOptions {
  validSortKeys: string[];
  validSortOrders: string[];
}

export const QueryParams = (options: QueryParamsOptions): ParameterDecorator =>
  createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const {
      pageNumber = 1,
      pageLength = 10,
      sortKey = 'workoutName',
      sortOrder = 'asc',
      searchKey,
    } = request.query;

    const { validSortKeys, validSortOrders } = options;

    const parsedPageNumber = parseInt(pageNumber, 10);
    const parsedPageLength = parseInt(pageLength, 10);

    if (
      isNaN(parsedPageNumber) ||
      parsedPageNumber <= 0 ||
      isNaN(parsedPageLength) ||
      parsedPageLength <= 0 ||
      !validSortKeys.includes(sortKey) ||
      !validSortOrders.includes(sortOrder)
    ) {
      throw new HttpException(
        'Invalid pageNumber, pageLength, sortKey, or sortOrder.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      pageNumber: parsedPageNumber,
      pageLength: parsedPageLength,
      sortKey: sortKey,
      sortOrder: sortOrder,
      searchKey: searchKey,
    };
  });
