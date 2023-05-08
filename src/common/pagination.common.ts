import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { DefaultPagination } from './constants';
import { Pagination } from './types';

export const GetPagination = createParamDecorator((data, context: ExecutionContext): Pagination => {
  const req = context.switchToHttp().getRequest();

  const skip = req?.query?.skip ? parseInt(req?.query?.skip.toString()) : DefaultPagination.skip;
  const limit = req?.query?.limit ? parseInt(req?.query?.limit?.toString()) : DefaultPagination.limit;
  const sortField = req.query.sort ? req?.query?.sort?.toString() : DefaultPagination.sort.field;

  return { skip, limit: limit > 100 ? 100 : limit, sort: { field: sortField, by: 'desc' } };
});
