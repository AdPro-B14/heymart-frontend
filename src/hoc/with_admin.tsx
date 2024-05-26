import { useAuth } from "@/context/auth_context";
import { useRouter } from "next/navigation";
import { ComponentType, useEffect, useState } from "react";
import withAuth from "./with_auth";

const withAdmin = <T extends object>(Component: ComponentType<T>) => {
    return function WithAdmin(props: T) {
        const [loading, setLoading] = useState(true);
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
            setLoading(false);
        }, [user]);

        return !loading ? <Component {...props} /> : <div></div>;
    }
};

export default withAdmin;