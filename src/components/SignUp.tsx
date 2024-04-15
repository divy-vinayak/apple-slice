"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUp() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
    });
    const [showPassword, setShowPassword] = useState(false);

    async function handleSubmit() {
        if (formData.password.localeCompare(formData.confirmPassword) !== 0) {
            alert("Passwords do not match");
            return;
        }
        const res = await fetch("/api/register", {
            method: "POST",
            body: JSON.stringify(formData),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await res.json();
        if (res.status === 201) {
            alert("User created successfully!");
            router.push("/api/auth/signin");
        }
        if (res.status === 400) {
            if (data.message === 'invalidEmail') {
                alert('Invalid Email')
            }
        }
    }

    return (
        <div className="flex flex-col gap-2 border-white border-[1px] rounded-md p-4">
            <div className="text-xl font-semibold mb-4">Register User</div>
            <label>Email: </label>
            <input
                type="email"
                required={true}
                onChange={(e) => {
                    setFormData({
                        ...formData,
                        email: e.target.value,
                    });
                }}
                placeholder="email"
                className="text-black rounded-sm p-1"
            />
            {/* <label>Password: <button className=" bg-teal-500 hover:bg-teal-400 rounded-sm p-1 text-sm" onClick={() => setShowPassword(val => !val)}>{showPassword? 'Hide Password' : 'Show Password'}</button></label> */}
            <label>Password: </label>
            <input
                type={!showPassword ? "password" : "text"}
                onChange={(e) => {
                    setFormData({
                        ...formData,
                        password: e.target.value,
                    });
                }}
                placeholder="password"
                className="text-black rounded-sm p-1"
            />
            <label>Confirm Password: </label>
            <input
                type="password"
                onChange={(e) => {
                    setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                    });
                }}
                placeholder="password"
                className="text-black rounded-sm p-1"
            />
            <button
                className="p-3 bg-teal-500 border-white rounded-md hover:bg-teal-300"
                onClick={handleSubmit}
            >
                Register User
            </button>
        </div>
    );
}
