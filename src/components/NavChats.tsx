"use client";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { useEffect } from "react";

interface chatType {
    id: string;
    created_at: Date;
    deleted: boolean;
    user_id: number;
    title: string;
}

export default function NavChats({ chats }: { chats: chatType[] }) {
    const router = useRouter();
    const pathname = usePathname();
    return (
        <>
            {chats.map((chat, idx) => {
                let btnCssClass =
                    "gap-2 rounded-sm w-full text-white justify-start hover:bg-slate-50 hover:bg-opacity-10";
                if (pathname.includes(chat.id)) {
                    btnCssClass += " bg-slate-50 bg-opacity-10";
                }
                return (
                    <Button
                        variant="link"
                        key={chat.id}
                        className={btnCssClass}
                        onClick={() => {
                            router.push(`/chat/${chat.id}`);
                        }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-5 h-5"
                        >
                            <path
                                fillRule="evenodd"
                                d="M3.43 2.524A41.29 41.29 0 0 1 10 2c2.236 0 4.43.18 6.57.524 1.437.231 2.43 1.49 2.43 2.902v5.148c0 1.413-.993 2.67-2.43 2.902a41.102 41.102 0 0 1-3.55.414c-.28.02-.521.18-.643.413l-1.712 3.293a.75.75 0 0 1-1.33 0l-1.713-3.293a.783.783 0 0 0-.642-.413 41.108 41.108 0 0 1-3.55-.414C1.993 13.245 1 11.986 1 10.574V5.426c0-1.413.993-2.67 2.43-2.902Z"
                                clipRule="evenodd"
                            />
                        </svg>
                        {chat.title.length > 25
                            ? chat.title.slice(0, 25) + "..."
                            : chat.title}
                    </Button>
                );
            })}
        </>
    );
}
