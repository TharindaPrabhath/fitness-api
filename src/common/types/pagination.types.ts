export type Pagination = {
  skip: number;
  limit: number;
  sort?: { field: string; by: 'asc' | 'desc' };
};
