import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";

export default function HomePage() {
    return (
        <div className="h-screen w-full flex flex-col items-center justify-center">
            <div className="flex justify-center w-full">
                <Image
                    src="/logo.jpeg"
                    alt="Logo"
                    width={200}
                    height={200}
                    className="rounded-full"
                />
            </div>
            <div className="text-center mt-6 w-3/4">
                <h1 className="text-3xl font-bold text-blue-950 mb-2">
                    Welcome to Dementia Care Assistant
                </h1>
                <p className="text-xl font-medium text-gray-600 mb-4">
                    Compassionate, Reliable, and Personalized Dementia Care.
                </p>
                <h2 className="text-xl font-semibold text-blue-800 mb-4">
                    Empowering you with knowledge and support.
                </h2>
                <p className="text-lg text-gray-700 mb-4">
                    We&apos;re here to provide you with compassionate support
                    and reliable information about dementia. Our AI-powered
                    assistant offers personalized responses tailored to your
                    unique situation.
                </p>
                <p className="text-lg text-gray-700 mb-4">
                    Whether you have questions about symptoms, treatments, or
                    caregiving tips, we&apos;re here to help. Your well-being is
                    our priority. Feel free to ask us anything—you&apos;re not
                    alone on this journey.
                </p>
                <p className="font-bold text-xl text-blue-950">
                    Let&apos;s get started!
                </p>
            </div>
            <div className="flex gap-4 mt-8 justify-center w-1/2">
                <Link href={"/api/auth/signin"}>
                    <Button className="bg-blue-950 hover:bg-blue-800 text-white p-3 rounded-md shadow-lg">
                        Login
                    </Button>
                </Link>
                <Link href={'/signup'}>
                    <Button className="bg-blue-950 hover:bg-blue-800 text-white p-3 rounded-md shadow-lg">
                        Sign Up
                    </Button>
                </Link>
            </div>
        </div>
    );
}
