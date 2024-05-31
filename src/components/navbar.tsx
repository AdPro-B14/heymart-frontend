'use client';

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/auth_context";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function NavBar () {
    const [openUserMenu, setOpenUserMenu] = useState(false);
    const { user, isLoggedIn, logout } = useAuth();
    const router = useRouter();

    const handleLogout = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setOpenUserMenu(false);
        logout();
    }
    
    return (
        <nav className="flex items-center justify-between p-4 bg-dark-green-3 shadow-md z-50 fixed top-0 left-0 w-svw">
            <div className="flex items-center space-x-4">
                <Image src="/logo.png" alt="logo" width={40} height={40} />
                <h1 className="text-lg font-bold">HeyMart</h1>
            </div>
            { isLoggedIn &&
            <div className="font-bold">
                <div>
                    <button onClick={(e) => setOpenUserMenu(!openUserMenu)} className="flex space-x-2 bg-transparent hover:bg-transparent" type="button" id="user-menu-button" aria-expanded="true" aria-haspopup="true">
                        {user?.name}
                        <svg className="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
                <div className={`absolute ${openUserMenu ? 'transition ease-out duration-100 transform opacity-100 scale-100' : 'transition ease-in duration-75 transform opacity-0 scale-95'} right-5 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`} role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabIndex={-1}>
                    <div className="py-1" role="none">
                    <form method="POST" onSubmit={handleLogout} role="none">
                        <button type="submit" className="bg-transparent hover:bg-transparent text-gray-700 block w-full px-4 py-2 text-left text-sm" role="menuitem" tabIndex={-1} id="menu-item-3">Sign out</button>
                    </form>
                </div>
            </div>
            </div> }
        </nav>
    );
}