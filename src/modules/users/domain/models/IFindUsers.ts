export interface IFindUsers {
  page?: number;
  limit?: number;
  sort?: string;
  limitFields?: string;
  [key: string]: any;
}
