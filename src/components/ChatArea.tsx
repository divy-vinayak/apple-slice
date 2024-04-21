"use client";
import { useEffect, useState } from "react";
import ChatInputArea from "./ChatInputArea";
import { messageType } from "@/lib/types";

export default function ChatArea({ chatId }: { chatId: string }) {
    const [messages, setMessages] = useState<messageType[] | null>(null);

    useEffect(() => {
        // fetch messages from the backend
        // parameters to use: userId, chatId
    }, []);

    async function sendMessage(newMessage: messageType) {
        // send message
    }

    return (
        <div className="bg-white w-full flex flex-col">
            <div className="bg-gray-50 flex flex-grow p-2">Chat area</div>
            <ChatInputArea sendMessage={sendMessage}/>
        </div>
    );
}
