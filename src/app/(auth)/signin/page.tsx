"use client"
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Page() {
    const router = useRouter();
    const [credentials, setCredentials] = useState<{username: string, password: string}>({
        username: '',
        password: ''
    });
    
    return <div>
        <label>Username</label>
        <input type='text' placeholder='Username' onChange={(e) => {
            setCredentials({
                ...credentials,
                username: e.target.value,
            })
        }}/>
        <label>Password</label>
        <input type='password' placeholder='password' onChange={(e) => {
            setCredentials({
                ...credentials,
                password: e.target.value
            })
        }}/>
        <button onClick={async () => {
            console.log({credentials})
            const res = await signIn("credentials", {
                username: credentials.username,
                password: credentials.password,
                redirect: false,
            });
            console.log(res);
            router.push("/")
        }}>Login with email</button>
        
    </div>
}