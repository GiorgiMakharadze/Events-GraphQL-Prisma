import { GraphQLError } from 'graphql';

export const formatError = (err: GraphQLError) => {
  const { message, extensions } = err;
  const code = extensions?.code || 'INTERNAL_SERVER_ERROR';

  let statusCode = 500;
  switch (code) {
    case 'NOT_FOUND':
      statusCode = 404;
      break;
    case 'ALREADY_EXISTS':
      statusCode = 409;
      break;
    case 'BAD_REQUEST':
      statusCode = 400;
      break;
    case 'UNAUTHORIZED':
      statusCode = 401;
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

  return new GraphQLError(message, {
    extensions: {
      code,
      statusCode,
      ...extensions,
    },
  });
};
