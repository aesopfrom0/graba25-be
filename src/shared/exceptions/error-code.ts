export enum ErrorCode {
  UNKNOWN_ERROR = -1,
  AUTH_NOT_FOUND = 100001,
  SYSTEM_ERROR = 100002,
  PROCESSING_REQUEST = 100003,
  USER_INSERT_ERROR = 100004,
  USER_QUERY_ERROR = 100005,
  USER_EMAIL_EXISTS = 100006,
  USER_NOT_EXISTS = 100007,
  EXTERNAL_API_ERROR = 100008,
  TASK_NOT_FOUND = 100009,
  TIME_LOG_NOT_FOUND = 100010,
}