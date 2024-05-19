'use client';

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/auth_context";

export default function NavBar () {
    const { user } = useAuth();
    console.log(user);
    return (
        <nav className="flex items-center justify-between p-4 bg-dark-green-3 shadow-md z-50 fixed top-0 left-0 w-svw">
            <div className="flex items-center space-x-4">
                <Image src="/logo.png" alt="logo" width={40} height={40} />
                <h1 className="text-lg font-bold">HeyMart</h1>
            </div>
            {/* <div className="flex items-center space-x-10">
                <Link href="/">Home</Link>
                <Link href="/about"></Link>
                <Link href="/contact">Contact</Link>
            </div> */}
            <div className="font-bold">
                {user?.name}
            </div>
        </nav>
    );
}