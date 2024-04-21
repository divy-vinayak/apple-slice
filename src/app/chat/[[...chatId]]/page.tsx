"use client";
import ChatArea from "@/components/ChatArea";
import NewChatPage from "@/components/NewChatPage";

export default function Page({ params }: { params: { chatId: string } }) {
    return (
        <>
            {params.chatId ? <ChatArea chatId={params.chatId[0]}/> : <NewChatPage />}
        </>
    );
}
