// client/src/context/AppContext.jsx
import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
    // Global Auth State
    const [isLoggedin, setIsLoggedin] = useState(false);
    const [userData, setUserData] = useState(null);
    const [isAccountVerified, setIsAccountVerified] = useState(false);

    // Backend URL from .env
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    // Configure Axios to always send/receive cookies
    axios.defaults.withCredentials = true;

    // Function to check if user is authenticated (Check Cookie)
    const getAuthState = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/auth/is-auth');
            if (data.success) {
                setIsLoggedin(true);
                getUserData(); // Fetch user details if logged in
            } else {
                setIsLoggedin(false);
            }
        } catch (error) {
            console.error("Auth Check Failed:", error.message);
        }
    };

    // Function to fetch User Data (Name, Email, Verification Status)
    const getUserData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/data');
            if (data.success) {
                setUserData(data.userData);
                // Important: Sets the verified flag for "Verified Actions"
                setIsAccountVerified(data.userData.isAccountVerified); 
            }
        } catch (error) {
            console.error("User Data Fetch Failed:", error.message);
        }
    };

    // Check Auth Status on App Load
    useEffect(() => {
        getAuthState();
    }, []);

    const value = {
        backendUrl,
        isLoggedin,
        setIsLoggedin,
        userData,
        setUserData,
        isAccountVerified,
        setIsAccountVerified,
        getUserData,
        getAuthState
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;