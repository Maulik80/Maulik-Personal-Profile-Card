import express from 'express';
import { createProfile, getUserProfiles, updateProfile, deleteProfile } from '../controllers/profileController.js';
import userAuth from '../middleware/userAuth.js';

const profileRouter = express.Router();

profileRouter.post('/add', userAuth, createProfile);
profileRouter.get('/get-user-profiles', userAuth, getUserProfiles);
profileRouter.post('/update', userAuth, updateProfile);
profileRouter.post('/delete', userAuth, deleteProfile);

export default profileRouter;