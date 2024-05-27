import { Application } from 'express';

export const AppModule = (app: Application) => {
  app.use('/api/v1/login', (req, res) => res.status(200).json({ msg: 'loged in' }));
};
