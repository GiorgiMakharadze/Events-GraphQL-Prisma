import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { logIn, refreshAccessToken } from '_app/rest/controllers/auth.controller';
import rateLimiterKeyGenerator from '_app/rest/utils/rateLimiterKeyGenerator';
import authenticateToken from '_app/rest/utils/authenticateToken';

const router = Router();

const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: rateLimiterKeyGenerator,
  handler: (req, res) => {
    res.status(429).json({
      msg: 'Too many login attempts from this IP, please try again after 15 minutes',
    });
  },
});

const forgotPasswordRateLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: rateLimiterKeyGenerator,
  message: 'Too many password reset attempts from this IP, please try again after 30 minutes',
});

router.route('/login').post(loginRateLimiter, logIn);

router.use(authenticateToken);

router.route('/refresh-token').get(refreshAccessToken);

export default router;
