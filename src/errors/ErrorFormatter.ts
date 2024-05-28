import { GraphQLError } from 'graphql';

export const formatError = (err: GraphQLError) => {
  const { message, extensions } = err;
  const code = extensions?.code || 'INTERNAL_SERVER_ERROR';

  let statusCode = 500;
  let customMessage = message;

  switch (code) {
    case 'GRAPHQL_VALIDATION_FAILED':
    case 'BAD_USER_INPUT':
      statusCode = 400;
      if (message.includes('password_String_NotNull_pattern')) {
        customMessage =
          'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character.';
      }
      break;
    case 'NOT_FOUND':
      statusCode = 404;
      customMessage = 'Resource not found.';
      break;
    case 'ALREADY_EXISTS':
      statusCode = 409;
      break;
    case 'BAD_REQUEST':
      statusCode = 400;
      break;
    case 'UNAUTHORIZED':
      statusCode = 401;
      customMessage = 'Unauthorized.';
      break;
    case 'UNAUTHENTICATED':
      statusCode = 403;
      break;
    case 'FORBIDDEN':
      statusCode = 403;
      break;
    case 'CONFLICT':
      statusCode = 409;
      break;
    case 'UNPROCESSABLE_ENTITY':
      statusCode = 422;
      customMessage = 'Unprocessable entity.';
      break;
    case 'TOO_MANY_REQUESTS':
      statusCode = 429;
      break;
    case 'SERVICE_UNAVAILABLE':
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
