import express from 'express';
// 1. Import getPublicProfile
import { createProfile, getUserProfiles, updateProfile, deleteProfile, getPublicProfile } from '../controllers/profileController.js';
import userAuth from '../middleware/userAuth.js';
import upload from '../middleware/multer.js';

const profileRouter = express.Router();

// 2. Add the Public Route (No userAuth needed)
profileRouter.get('/public/:id', getPublicProfile); 

profileRouter.post('/add', userAuth, upload.single('photo'), createProfile);
profileRouter.post('/update', userAuth, upload.single('photo'), updateProfile);
profileRouter.get('/get-user-profiles', userAuth, getUserProfiles);
profileRouter.post('/delete', userAuth, deleteProfile);

export default profileRouter;