'use client'

import { useAuth } from "@/context/auth_context";
import { useRouter } from "next/navigation";
import { useEffect } from "react"

export default function Custom404() {
    const router = useRouter();
    const { user, isLoggedIn } = useAuth();

    useEffect(() => {
        if (!isLoggedIn) {
            router.replace('/auth/login');
            return;
        }
    
        if (user.role.toLowerCase() !== 'admin') {
            router.replace(`/${user.role.toLowerCase()}/dashboard`);
        }
    }, []);

    return null;
}