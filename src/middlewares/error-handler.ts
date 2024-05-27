import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Prisma } from '@prisma/client';

const errorHandlerMiddleware = (
  err: Error | any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err);

  const defaultError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong',
  };

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      defaultError.statusCode = StatusCodes.BAD_REQUEST;
      defaultError.msg = `${err.meta?.target} field has to be unique`;
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    defaultError.statusCode = StatusCodes.BAD_REQUEST;
    defaultError.msg = 'Validation error';
  }

  res.status(defaultError.statusCode).json({ msg: defaultError.msg });
};

export default errorHandlerMiddleware;
