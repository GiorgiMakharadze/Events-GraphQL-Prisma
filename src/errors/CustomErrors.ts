import { GraphQLError } from 'graphql';

const createError = (code: string, message: string) => {
  return new GraphQLError(message, {
    extensions: { code },
  });
};

const notFoundError = (message: string) => createError('NOT_FOUND', message);
const alreadyExistsError = (message: string) => createError('ALREADY_EXISTS', message);
const badRequestError = (message: string) => createError('BAD_REQUEST', message);
const internalServerError = (message: string) => createError('INTERNAL_SERVER_ERROR', message);
const unauthorizedError = (message: string) => createError('UNAUTHORIZED', message);
const unauthenticatedError = (message: string) => createError('UNAUTHENTICATED', message);
const forbiddenError = (message: string) => createError('FORBIDDEN', message);
const conflictError = (message: string) => createError('CONFLICT', message);
const unprocessableEntityError = (message: string) => createError('UNPROCESSABLE_ENTITY', message);
const tooManyRequestsError = (message: string) => createError('TOO_MANY_REQUESTS', message);
const serviceUnavailableError = (message: string) => createError('SERVICE_UNAVAILABLE', message);

export {
  notFoundError,
  alreadyExistsError,
  badRequestError,
  internalServerError,
  unauthorizedError,
  unauthenticatedError,
  forbiddenError,
  conflictError,
  unprocessableEntityError,
  tooManyRequestsError,
  serviceUnavailableError,
};
