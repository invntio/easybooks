export interface FormatedResponse<T> {
  success: boolean;
  data?: T;
  message: string;
  statusCode: number;
}

export interface FormatedErrorResponse {
  success: boolean;
  message: string;
  statusCode: number;
}
