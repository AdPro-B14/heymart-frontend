'use client';

import axiosInstance from "@/helpers/axios_interceptor";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Cookies from "js-cookie";
import { useAuth } from "@/context/auth_context";

export default function SignUpPage() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState({ email: "", password: "" });
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const newError = { email: "", password: "" };
        let formIsValid = true;

        if (!formData.email) {
            formIsValid = false;
            newError.email = "Email is required";
        }

        if (!formData.password) {
            formIsValid = false;
            newError.password = "Password is required";
        }
        
        setError(newError);
        if (!formIsValid) return;
        
        login(formData.email, formData.password);
    }

    return (
        <>
            <title>Login</title>
            <section className="flex flex-col bg-light-green min-h-screen min-w-screen items-center justify-center">
                <div className="flex flex-col bg-gray-50 min-h-[400px] w-[500px] rounded-lg px-6 py-8 shadow-lg space-y-6">
                    <h1 className="flex text-black text-2xl font-bold items-center justify-center">Please sign in</h1>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex flex-col text-black space-y-2">
                            <label className="text-black font-bold" htmlFor="email">Email</label> 
                            <input onChange={(e) => setFormData({...formData, email: e.target.value})} type="text" name="email" id="email" className="p-2 rounded-lg"/>
                            {
                                error.email && <p className="text-red-500 text-sm">{error.email}</p>
                            }
                        </div>
                        <div className="flex flex-col text-black space-y-2">
                            <label className="text-black font-bold" htmlFor="password">Password</label> 
                            <input onChange={(e) => setFormData({...formData, password: e.target.value})} type="password" name="password" id="password" className="p-2 rounded-lg"/>
                            {
                                error.password && <p className="text-red-500 text-sm">{error.password}</p>
                            }
                        </div>
                        <div className="space-y-2">
                            <button type="submit" className="w-full focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Sign in</button>
                            <p className="flex text-sm font-light text-gray-500 dark:text-gray-400 justify-center">
                                Don't have an account yet?
                                <Link href="/auth/register" className="font-medium text-dark-green-2 hover:underline ml-2">Sign up</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </section>
            <ToastContainer />
        </>
    );
}