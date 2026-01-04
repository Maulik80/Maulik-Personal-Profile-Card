// server/routes/profileRoutes.js
const express = require('express');
const { createProfile, getUserProfiles, deleteProfile, updateProfile } = require('../controllers/profileController');
const userAuth = require('../middleware/userAuth'); // Protects these routes

const profileRouter = express.Router();

// All routes require the user to be logged in (userAuth)
profileRouter.post('/add', userAuth, createProfile);
profileRouter.get('/get-user-profiles', userAuth, getUserProfiles);
profileRouter.post('/delete', userAuth, deleteProfile); // Using POST to send body data easily
profileRouter.post('/update', userAuth, updateProfile);

module.exports = profileRouter;