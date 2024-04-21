"use client";

import { signOut } from "next-auth/react";
import { Button } from "./ui/button";

export default function LogoutButton() {
    return (
        // <button className="p-2 bg-white hover:font-semibold" onClick={() => {
        //     signOut()
        // }}>
        //   Logout
        // </button>
        <Button variant='outline' onClick={() => signOut()} className="flex gap-1">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                />
            </svg>
            Logout
        </Button>
    );
}
