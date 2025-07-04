import React, { useEffect } from 'react'
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import {UserContext} from "../context/userContext"
export const useUserAuth = () => {
    //get user state from context
    const {user,loading,clearUser}=useContext(UserContext);

    // react router navigation hook
    const navigate=useNavigate();

    useEffect(()=>{

        if(loading) return;//dont do anything if user is still loading

        if(!user)
        {
            clearUser(); //clear any user-related state
            navigate("/login");//redirect to login is user is not logged in
        }
    },[user,loading,clearUser,navigate]);//depenency array to trigger when user or loading changes
}

