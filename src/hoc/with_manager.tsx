import { useAuth } from "@/context/auth_context";
import { useRouter } from "next/navigation";
import { ComponentType, useEffect, useState } from "react";

const withManager = <T extends object>(Component: ComponentType<T>) => {
    return function WithManager(props: T) {
        const [loading, setLoading] = useState(true);
        const router = useRouter();
        const { user, isLoggedIn } = useAuth();

        useEffect(() => {
            if (!isLoggedIn) {
                router.replace('/auth/login');
                return;
            }
            
            if (user.role.toLowerCase() !== 'manager') {
                router.replace(`/${user.role.toLowerCase()}/dashboard`);
            }
            setLoading(false);
        }, [user]);

        return !loading ? <Component {...props} /> : <div></div>
    }
};

export default withManager;