import { Response, NextFunction } from 'express';
import { UnauthorizedError } from '../errors';
import userModel from '_app/models/user.model';
import { IRequest } from '_app/interfaces/request.interface';

const userRoleValidation = (allowedRoles: string[]) => {
  return async (req: IRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedError(`Unauthorized access attempt detected from IP: ${req.ip}`);
    }

    const user = await userModel.findById(userId);
    if (!user) {
      throw new UnauthorizedError(`Unauthorized access attempt detected from IP: ${req.ip}`);
    }

    const userRoles = Array.isArray(user.role) ? user.role : [user.role];
    const hasAllowedRole = userRoles.some((role) => allowedRoles.includes(role));

    if (!hasAllowedRole) {
      throw new UnauthorizedError(`Access denied for user: ${user.username} from IP: ${req.ip}`);
    }

    next();
  };
};

export default userRoleValidation;
