"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
    const router = useRouter();
    const [credentials, setCredentials] = useState<{
        username: string;
        password: string;
    }>({
        username: "",
        password: "",
    });

    return (
        <div className="flex w-full h-screen justify-center items-center">
            This is signin page
        </div>
    );
}
