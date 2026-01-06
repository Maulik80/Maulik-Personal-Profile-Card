/* Server/routes/userRoutes.js */
import express from 'express';
import { getUserData } from '../controllers/userController.js';
import userAuth from '../middleware/userAuth.js';
import { apiLimiter } from '../middleware/rateLimits.js'; // ✅ Security

const userRouter = express.Router();

// Protect user data endpoint
userRouter.get('/data', userAuth, apiLimiter, getUserData);

export default userRouter;