import { TNormalizeUrlOptions, TPathVariables, TQueryParams } from './normalizeUrl.types';

function normalizeUrl(apiEndpoint: string, options: TNormalizeUrlOptions = {}): string {
  const url = getUrlWithPathVariable(apiEndpoint, options.pathVariables);
  return getUrlWithQueryParams(url, options.queryParams);
}

function getUrlWithPathVariable(url: string, pathVariables?: TPathVariables): string {
  if (!pathVariables) {
    return url;
  }

  return Object.entries(pathVariables).reduce(function replaceParam(result, [key, value]) {
    return result.replace(`{${key}}`, encodeURIComponent(value));
  }, url);
}

function getUrlWithQueryParams(url: string, queryParams?: TQueryParams): string {
  if (!queryParams) {
    return url;
  }

  const search = new URLSearchParams();

  Object.entries(queryParams).forEach(function appendParam([key, value]) {
    if (value !== undefined) {
      search.append(key, String(value));
    }
  });

  const query = search.toString();
  return query ? `${url}?${query}` : url;
}

export default normalizeUrl;
