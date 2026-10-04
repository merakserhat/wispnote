export type TPathVariables = Record<string, string>;

export type TQueryParams = Record<string, string | number | boolean | undefined>;

export type TNormalizeUrlOptions = {
  pathVariables?: TPathVariables;
  queryParams?: TQueryParams;
};
