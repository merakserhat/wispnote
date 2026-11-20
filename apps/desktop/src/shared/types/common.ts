import ApiErrorCode from 'shared/enums/ApiErrorCode';

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
  errorCode: ApiErrorCode | null;
  errorMessage: string;
};
