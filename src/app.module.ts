import { Application } from 'express';
import AuthRoutes from '_app/rest/routes/authRoutes';

export const AppModule = (app: Application) => {
  app.use('/api/v1/auth', AuthRoutes);
};
