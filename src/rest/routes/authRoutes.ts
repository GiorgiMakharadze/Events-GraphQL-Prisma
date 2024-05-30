import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
  forgotPassword,
  forgotPasswordConfirm,
  logIn,
  logOut,
  refreshAccessToken,
} from '_rest/controllers/auth.controller';
import rateLimiterKeyGenerator from '_rest/utils/rateLimiterKeyGenerator';
import authenticateToken from '_rest/utils/authenticateToken';

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
router.route('/forgot-password').post(forgotPasswordRateLimiter, forgotPassword);
router.route('/forgot-password/confirm').post(forgotPasswordConfirm);

router.use(authenticateToken);

router.route('/refresh-token').get(refreshAccessToken);
router.route('/logout').post(logOut);

export default router;
