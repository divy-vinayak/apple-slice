"use client";
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import ChatInputArea from "./ChatInputArea";
import { messageType } from "@/lib/types";
import Image from "next/image";

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
                // @ts-ignore
                const { done, value } = await reader?.read();
                if (done) {
                    setStreamingNewMessage(false);
                    setIncomingMessage(null);
                    break;
                }

                const chunk = textDecoder.decode(value);
                console.log({ chunk });
                const lines = chunk.split("\n");
                console.log({ lines });
                const parsedLines = lines
                    .map((line) => line.replace(/^data: /, "").trim()) // Remove the "data: " prefix
                    .filter((line) => line !== "" && line !== "[DONE]"); // Remove empty lines and "[DONE]"
                // .map((line) => JSON.parse(line)); // Parse the JSON string
                console.log({ parsedLines });
                for (const parsedLine of parsedLines) {
                    try {
                        const parsedLineJson = JSON.parse(parsedLine);
                        const { choices } = parsedLineJson;
                        const { delta } = choices[0];
                        const { content } = delta;
                        // Update the UI with the new content
                        if (content) {
                            responseStr += content;
                        }
                    } catch (error) {
                        console.log({ skipped: parsedLine });
                        console.error({ error });
                    }
                }

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
        <div className="bg-white flex flex-grow flex-col h-screen p-2 gap-1 pr-0">
            <div
                ref={scrollableDivRef}
                className={
                    messages
                        ? "bg-gray-50 flex flex-grow flex-col-reverse overflow-y-scroll p-3 border-gray-200 border-2 rounded-md"
                        : "bg-gray-50 flex flex-grow justify-center items-center border-gray-200 border-2 rounded-md"
                }
            >
                {(streamingNewMessage || incomingMessage) && (
                    <div className="bg-gray-300 flex gap-2 px-2 py-1">
                        <div className="w-7 h-7 min-w-7 min-h-7 shadow-sm shadow-gray-500 bg-white mt-4 rounded-sm items-center">
                            <Image
                                src={"/logo.jpeg"}
                                alt=""
                                width={26}
                                height={26}
                            />
                        </div>
                        {!incomingMessage && (
                            <div className="text-gray-500">
                                Awaiting response...
                            </div>
                        )}
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
                                    (message.sent_by_user
                                        ? "bg-gray-50"
                                        : "bg-gray-300") +
                                    " flex gap-2 px-4 py-1 rounded-sm"
                                }
                            >
                                {" "}
                                <div className="w-7 h-7 min-w-7 min-h-7 shadow-sm shadow-gray-500 bg-white mt-4 rounded-sm items-center">
                                    <Image
                                        src={
                                            message.sent_by_user
                                                ? "/user.svg"
                                                : "/logo.jpeg"
                                        }
                                        alt=""
                                        width={26}
                                        height={26}
                                    />
                                </div>
                                <Markdown className="px-2 py-4 flex flex-col gap-4 font-medium">
                                    {message.message}
                                </Markdown>
                            </div>
                        );
                    })}
                {!messages && (
                    <div className="text-3xl font-sans text-gray-500 flex flex-col justify-center items-center gap-4">
                        <div>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className=" w-28 h-28"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                                />
                            </svg>
                        </div>
                        <div>Send message to start chat</div>
                    </div>
                )}
            </div>
            <ChatInputArea
                sendMessage={sendMessage}
                disabled={streamingNewMessage}
            />
        </div>
    );
}
