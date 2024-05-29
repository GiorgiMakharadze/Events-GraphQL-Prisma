import { Request } from "express";

const rateLimiterKeyGenerator = (req: Request): string => {
  return req.ip || "unknown";
};

export default rateLimiterKeyGenerator;
