import React, { createContext, useState, useEffect, useContext } from 'react';

import * as api from '../api';



const AuthContext = createContext();



export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    useEffect(() => {

        const storedUser = JSON.parse(localStorage.getItem('profile'));

        if (storedUser) setUser(storedUser.result);

    }, []);



    const login = async (formData) => {

        try {

            const { data } = await api.signIn(formData);

            localStorage.setItem('profile', JSON.stringify(data));

            setUser(data.result);

        } catch (error) { alert("Error al entrar"); }

    };

    const register = async (formData) => {

        try {

            const { data } = await api.signUp(formData);

            localStorage.setItem('profile', JSON.stringify(data));

            setUser(data.result);

        } catch (error) { alert("Error al registrar"); }

    };

    const logout = () => { localStorage.clear(); setUser(null); };



    return (

        <AuthContext.Provider value={{ user, login, register, logout }}>

            {children}

        </AuthContext.Provider>

    );

};

export const useAuth = () => useContext(AuthContext);

