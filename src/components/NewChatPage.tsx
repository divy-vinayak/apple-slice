import StartNewChatBtn from "./StartNewChatBtn";
import Image from "next/image";

export default function NewChatPage() {
    return (
        <div className="flex flex-col justify-center items-center bg-gray-50 w-full h-screen">
            {/* Logo at the top center */}
            <Image
                src="/logo.jpeg"
                alt="Logo"
                width={200}
                height={200}
                className="rounded-full mb-6"
            />

            {/* Text message to nudge the user to start a new chat */}
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-blue-950">
                    Ready to Chat?
                </h1>
                <p className="text-lg text-gray-700">
                    Start a new conversation with our AI assistant and get
                    personalized support for dementia-related queries.
                </p>
            </div>

            {/* Start New Chat Button at the bottom center */}
            <div className="flex justify-center">
                <StartNewChatBtn label={"Start New Chat"} variant={"outline"}/>
            </div>
        </div>
    );
}
