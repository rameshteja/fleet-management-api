export interface ApiResponse<T = unknown, M = unknown> {
  success: boolean;
  message: string;
  statusCode: number;
  data: T;
  metadata: M;
}