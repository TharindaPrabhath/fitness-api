import { Pagination } from '../types';

export const DefaultPagination: Pagination = {
  skip: 0,
  limit: 20,
  sort: { field: 'createdAt', by: 'desc' }
};
