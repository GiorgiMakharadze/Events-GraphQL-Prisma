import { CustomAPIError } from './customApi';
import { StatusCodes } from 'http-status-codes';

export class InternalServerError extends CustomAPIError {
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  }
}
