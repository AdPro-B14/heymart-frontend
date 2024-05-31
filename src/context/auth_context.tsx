'use client';

import axiosInstance from "@/helpers/axios_interceptor";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

interface AuthContext {
    isLoggedIn: boolean;
    isLoading: boolean;
    user: {name: string; email: string; role: string; manager_supermarket_id: number; balance: number}
    token: string;
    login: (email: string, password: string) => void;
    logout: () => void;
};

export const AuthContext = createContext<AuthContext>({
    isLoggedIn: false,
    isLoading: true,
    token: "",
    user: {
        name: "",
        email: "",
        role: "",
        manager_supermarket_id: 0,
        balance: 0
    },
    login: () => {},
    logout: () => {}   
});

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [token, setToken] = useState("");
    const [user, setUser] = useState({
        name: "",
        email: "",
        role: "",
        manager_supermarket_id:0,
        balance: 0
    });
    const router = useRouter();

    const login = async (email: string, password: string) => {
        try {
            const login_response = await axiosInstance.post('/api/auth/login', { email, password });

            if (login_response.status === 200) {
                localStorage.setItem('token', login_response.data.token);
                setToken(login_response.data.token);

                const user_response = await axiosInstance.get('/api/user/profile');
                setUser(user_response.data);
                setIsLoggedIn(true);

                toast.success("Login successful");
                router.push(`/${user_response.data['role'].toLowerCase()}/dashboard`);
            } else {
                toast.error("Login failed");
            }
        } catch (error) {
            toast.error("An error occurred during login");
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken("");
        setUser({
            name: "",
            email: "",
            role: "",
            manager_supermarket_id: 0,
            balance: 0
        });
        setIsLoggedIn(false);
    };

    useEffect(() => {
        let token = localStorage.getItem('token');
        if (token) {
            let decoded = jwtDecode<{exp: number; id: number; role: string}>(token);
            if (decoded.exp * 1000 < Date.now()) {
                logout();
                setIsLoading(false);
            } else {
                setToken(token);
                axiosInstance.get(`/api/user/profile`)
                    .then(res => {
                        setUser(res.data);
                        setIsLoading(false);
                    }).catch(err => {
                        console.log(err);
                    });
                setIsLoggedIn(true);
            }
        } else {
            setIsLoading(false);
        }
    }, []);

    const contextValue = useMemo(() => ({
        isLoggedIn,
        isLoading,
        token,
        user,
        login,
        logout
    }), [isLoggedIn, isLoading, token, user, login, logout]);

    return (
        <AuthContext.Provider value={contextValue}>
            {!isLoading ? children : <div></div>}
        </AuthContext.Provider>
    );
};

// useEffect(() => {
//     let token = localStorage.getItem('token');
//     if (token) {
//         let decoded = jwtDecode<{exp: number; id: number; role: string}>(token);
//         if (decoded.exp * 1000 < Date.now()) {
//             logout();
//         } else {
//             setAuthToken(token);
//             axiosInstance.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user`, {
//                 headers: {
//                     Authorization: `Bearer ${token}`
//                 }
//             }).then(res => {
//                 setUser(res.data.body);
//             }).catch(() => {
//                 logout();
//             });
//         }
//     }
// }, []);

export const useAuth = () => useContext(AuthContext);