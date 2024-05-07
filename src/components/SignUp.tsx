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
            if (data.message === "invalidEmail") {
                alert("Invalid Email");
            }
        }
        if (res.status === 409) {
            alert(data.message);
        }
        setFormData({
            email: "",
            password: "",
            confirmPassword: "",
            name: "",
        });
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen w-full bg-gradient-to-r from-blue-100 to-blue-200">
            <div className="w-1/4 p-6 bg-white rounded-lg shadow-lg">
                <div className="text-center mb-4">
                    <h2 className="text-2xl font-semibold text-blue-950">
                        Register User
                    </h2>
                    <p className="text-gray-700">
                        Create an account to get started.
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    <div>
                        <label
                            className="block text-lg font-semibold text-blue-950 mb-1"
                            htmlFor="email"
                        >
                            Email:
                        </label>
                        <input
                            type="email"
                            id="email"
                            required
                            value={formData.email}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    email: e.target.value,
                                })
                            }
                            placeholder="Email"
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950"
                        />
                    </div>

                    <div>
                        <label
                            className="block text-lg font-semibold text-blue-950 mb-1"
                            htmlFor="password"
                        >
                            Password:
                        </label>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            value={formData.password}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    password: e.target.value,
                                })
                            }
                            placeholder="Password"
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950"
                        />
                        <button
                            className="mt-2 text-blue-950"
                            onClick={() => setShowPassword((prev) => !prev)}
                        >
                            {showPassword ? "Hide Password" : "Show Password"}
                        </button>
                    </div>

                    <div>
                        <label
                            className="block text-lg font-semibold text-blue-950 mb-1"
                            htmlFor="confirmPassword"
                        >
                            Confirm Password:
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    confirmPassword: e.target.value,
                                })
                            }
                            placeholder="Confirm Password"
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950"
                        />
                    </div>

                    <button
                        className="bg-blue-950 hover:bg-blue-800 text-white p-3 rounded-md"
                        onClick={handleSubmit}
                    >
                        Register User
                    </button>
                </div>
            </div>
        </div>
    );
}
