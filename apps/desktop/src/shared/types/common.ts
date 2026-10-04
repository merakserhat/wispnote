export type TApiErrorCode = 'INVALID_REQUEST' | 'NOT_FOUND' | 'GENERIC_ERROR';

export type TCommonResponse<TResult> = {
  result: TResult;
};

export type TPaginatedResponse<TResult> = {
  result: {
    content: TResult[];
    isLastPage: boolean;
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
};

export type TPaginationRequestParams<TFilterParams = unknown> = TFilterParams & {
  page: number;
  size?: number;
};

export type TErrorResponse = {
  status: number;
  errorCode: TApiErrorCode | null;
  errorMessage: string;
};
