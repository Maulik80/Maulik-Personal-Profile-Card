/* Client/src/context/AppContext.jsx */
import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from 'react-toastify';

export const AppContext = createContext();

export const AppContextProvider = (props) => {
    // Backend URL from .env
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    // Configure Axios globally
    axios.defaults.withCredentials = true;

    // Global Auth State
    const [isLoggedin, setIsLoggedin] = useState(false);
    const [userData, setUserData] = useState(null);
    const [isAccountVerified, setIsAccountVerified] = useState(false);
    
    // ✅ NEW: Loading state to prevent "flicker" of Login button on refresh
    const [appLoading, setAppLoading] = useState(true);

    // --- 1. Get User Data (Profile Info) ---
    const getUserData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/data');
            if (data.success) {
                setUserData(data.userData);
                setIsAccountVerified(data.userData.isAccountVerified); 
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("User Data Error:", error.message);
            // Don't toast here to avoid spamming on session expiry
        }
    };

    // --- 2. Check Auth Status (Run on App Start) ---
    const getAuthState = async () => {
        setAppLoading(true);
        try {
            const { data } = await axios.get(backendUrl + '/api/auth/is-auth');
            if (data.success) {
                setIsLoggedin(true);
                await getUserData(); // Wait for user data before finishing loading
            } else {
                setIsLoggedin(false);
            }
        } catch (error) {
            console.error("Auth Check Failed:", error.message);
            setIsLoggedin(false);
        } finally {
            setAppLoading(false);
        }
    };

    // --- 3. Logout Function ---
    const logout = async () => {
        try {
            const { data } = await axios.post(backendUrl + '/api/auth/logout');
            if (data.success) {
                setIsLoggedin(false);
                setUserData(null);
                setIsAccountVerified(false);
                toast.info("Logged Out Successfully 👋");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Check Auth Status on App Load
    useEffect(() => {
        getAuthState();
    }, []);

    const value = {
        backendUrl,
        isLoggedin, setIsLoggedin,
        userData, setUserData,
        isAccountVerified, setIsAccountVerified,
        appLoading, // Exported so pages can show a spinner if needed
        getUserData, 
        getAuthState,
        logout
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;