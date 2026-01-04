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

    // --- 1. Define getUserData FIRST ---
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
            // Optional: toast.error("Failed to load user data"); 
            // Kept silent to avoid spamming errors on logout
        }
    };

    // --- 2. Define getAuthState SECOND (Because it uses getUserData) ---
    const getAuthState = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/auth/is-auth');
            if (data.success) {
                setIsLoggedin(true);
                getUserData(); // <--- Now this works because getUserData exists above
            } else {
                setIsLoggedin(false);
            }
        } catch (error) {
            console.error("Auth Check Failed:", error.message);
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
                toast.success("Logged Out Successfully");
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