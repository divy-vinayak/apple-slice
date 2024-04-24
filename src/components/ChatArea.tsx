"use client";
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import ChatInputArea from "./ChatInputArea";
import { messageType } from "@/lib/types";

export default function ChatArea({ chatId }: { chatId: string }) {
    const [messages, setMessages] = useState<messageType[] | null>(null);
    const scrollableDivRef = useRef<HTMLDivElement>(null);
    const [streamingNewMessage, setStreamingNewMessage] = useState(false);
    const [incomingMessage, setIncomingMessage] = useState<messageType | null>(
        null
    );

    useEffect(() => {
        // fetch messages from the backend
        getMessages(chatId);
        // parameters to use: userId, chatId
    }, [chatId]);

    useEffect(() => {
        console.log({ messages });
    }, [messages]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    function scrollToBottom() {
        const scrollableDiv = scrollableDivRef.current;
        if (scrollableDiv) {
            scrollableDiv.scrollTop = scrollableDiv.scrollHeight;
        }
    }

    async function getMessages(chatId: string) {
        const res = await fetch(`/api/chat/getMessages?chatId=${chatId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (res.ok) {
            const data = await res.json();
            if (data?.messages.length > 0) setMessages(data?.messages);
        }
    }

    async function sendMessage(newMessage: { role: string; content: string }) {
        try {
            setMessages((messages) => {
                return [
                    {
                        send_at: new Date(),
                        sent_by_user: true,
                        message: newMessage.content,
                    },
                    ...(messages || []),
                ];
            });
            setStreamingNewMessage(true);
            const response = await fetch(`/api/chat/sendMessage`, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    chatId: chatId,
                    newMessage: newMessage,
                }),
            });
            const reader = response.body?.getReader();
            const textDecoder = new TextDecoder("utf-8");
            let responseStr = "";
            while (true) {
                const { done, value } = await reader?.read();
                if (done) {
                    setStreamingNewMessage(false);
                    setIncomingMessage(null);
                    break;
                }
                responseStr += textDecoder.decode(value);
                setIncomingMessage((incomingMessage) => {
                    if (!incomingMessage) {
                        return {
                            send_at: new Date(),
                            sent_by_user: false,
                            message: responseStr,
                        };
                    }
                    return {
                        ...incomingMessage,
                        message: responseStr,
                    };
                });
            }
            const responseMessage: messageType = {
                send_at: new Date(),
                sent_by_user: false,
                message: responseStr,
            };
            setMessages((messages) => {
                return [responseMessage, ...(messages || [])];
            });
            addNewMessageToChat(responseMessage, chatId);
        } catch (error) {
            console.error({ error });
        } finally {
            setStreamingNewMessage(false);
        }
    }

    async function addNewMessageToChat(
        newMessage: messageType,
        chatId: string
    ) {
        const res = await fetch("/api/chat/addNewMessageToChat", {
            method: "POST",
            body: JSON.stringify({ newMessage, chatId }),
        });
        if (res.ok) {
            const data = await res.json();
            console.log("Message added successfully");
            console.log(`Message: ${newMessage.message}`);
        } else {
            console.error(res.body);
        }
    }

    return (
        <div className="bg-white w-full flex flex-col">
            <div
                ref={scrollableDivRef}
                className="bg-gray-50 flex flex-grow flex-col-reverse overflow-y-scroll w-full"
            >
                {incomingMessage && (
                    <div className="bg-gray-300">
                        <Markdown className="px-2 py-4">
                            {incomingMessage?.message}
                        </Markdown>
                    </div>
                )}
                {messages &&
                    messages.map((message, idx) => {
                        return (
                            <div
                                key={idx}
                                className={
                                    message.sent_by_user
                                        ? "bg-gray-50"
                                        : "bg-gray-300"
                                }
                            >
                                <Markdown className="px-2 py-4">
                                    {message.message}
                                </Markdown>
                            </div>
                        );
                    })}
            </div>
            <ChatInputArea
                sendMessage={sendMessage}
                disabled={streamingNewMessage}
            />
        </div>
    );
}
