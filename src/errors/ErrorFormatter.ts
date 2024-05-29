import { GraphQLError } from 'graphql';

const ERROR_MESSAGES = {
  PASSWORD_INVALID:
    'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character.',
  EMAIL_INVALID: 'Email must be in correct email format.',
  RESOURCE_NOT_FOUND: 'Resource not found.',
  UNAUTHORIZED: 'Unauthorized.',
  UNPROCESSABLE_ENTITY: 'Unprocessable entity.',
};

enum ErrorCodes {
  VALIDATION_FAILED = 'GRAPHQL_VALIDATION_FAILED',
  BAD_USER_INPUT = 'BAD_USER_INPUT',
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  UNAUTHENTICATED = 'UNAUTHENTICATED',
  FORBIDDEN = 'FORBIDDEN',
  CONFLICT = 'CONFLICT',
  UNPROCESSABLE_ENTITY = 'UNPROCESSABLE_ENTITY',
  TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
}

export const formatError = (err: GraphQLError) => {
  const { message, extensions } = err;
  const code = extensions?.code || ErrorCodes.INTERNAL_SERVER_ERROR;

  let statusCode = 500;
  let customMessage = message;

  switch (code) {
    case ErrorCodes.VALIDATION_FAILED:
    case ErrorCodes.BAD_USER_INPUT:
      statusCode = 400;
      if (message.includes('password_String_NotNull_pattern')) {
        customMessage = ERROR_MESSAGES.PASSWORD_INVALID;
      } else if (message.includes('email_String_NotNull')) {
        customMessage = ERROR_MESSAGES.EMAIL_INVALID;
      }
      break;
    case ErrorCodes.NOT_FOUND:
      statusCode = 404;
      customMessage = ERROR_MESSAGES.RESOURCE_NOT_FOUND;
      break;
    case ErrorCodes.ALREADY_EXISTS:
    case ErrorCodes.CONFLICT:
      statusCode = 409;
      break;
    case ErrorCodes.BAD_REQUEST:
      statusCode = 400;
      break;
    case ErrorCodes.UNAUTHORIZED:
      statusCode = 401;
      customMessage = ERROR_MESSAGES.UNAUTHORIZED;
      break;
    case ErrorCodes.UNAUTHENTICATED:
    case ErrorCodes.FORBIDDEN:
      statusCode = 403;
      break;
    case ErrorCodes.UNPROCESSABLE_ENTITY:
      statusCode = 422;
      customMessage = ERROR_MESSAGES.UNPROCESSABLE_ENTITY;
      break;
    case ErrorCodes.TOO_MANY_REQUESTS:
      statusCode = 429;
      break;
    case ErrorCodes.SERVICE_UNAVAILABLE:
      statusCode = 503;
      break;
    default:
      statusCode = 500;
  }

  return new GraphQLError(customMessage, {
    extensions: {
      code,
      statusCode,
      ...extensions,
    },
  });
};
