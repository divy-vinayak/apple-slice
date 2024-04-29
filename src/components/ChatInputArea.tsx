"use client";
import { useState } from "react";
import { Button } from "./ui/button";

interface newMessageType {
    role: string;
    content: string;
}

export default function ChatInputArea({
    disabled,
    sendMessage,
}: {
    disabled: boolean;
    sendMessage: (newMessage: newMessageType) => void;
}) {
    const [message, setMessage] = useState<newMessageType>({
        role: "user",
        content: "",
    });

    const handleSubmit = (): void => {
        sendMessage(message);
        setMessage({
            ...message,
            content: "",
        });
    };

    return (
        <div className="flex p-2 border-t-2 gap-2 bg-white shadow-md bottom-0">
            <input
                disabled={disabled}
                className="text-black p-2 flex flex-grow rounded-sm min-h-10 border-2 bg-gray-50"
                type="text"
                placeholder="Send Message..."
                autoFocus={true}
                value={message.content}
                onChange={(e) =>
                    setMessage({ ...message, content: e.target.value })
                }
            />
            <div className="w-px bg-gray-300 -my-2"></div>
            <Button
                disabled={disabled}
                className="bg-blue-950 hover:bg-blue-800 text-white p-2 rounded-sm gap-1"
                onClick={handleSubmit}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                    />
                </svg>
            </Button>
        </div>
    );
}
