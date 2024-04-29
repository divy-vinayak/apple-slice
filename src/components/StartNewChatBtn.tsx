"use client";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import Image from "next/image";

export default function StartNewChatBtn({
    type = "light",
    label,
    variant = "default",
}: {
    type?: "light" | "dark";
    label: string;
    variant?:
        | "link"
        | "default"
        | "destructive"
        | "outline"
        | "secondary"
        | "ghost"
        | null
        | undefined;
}) {
    const router = useRouter();

    let finalClassName =
        "flex justify-between hover:bg-slate-50 hover:bg-opacity-10";
    if (type === "dark") {
        finalClassName += " text-white";
    }

    async function handleCreateNewChat() {
        try {
            const res = await fetch("/api/chat/createNewChat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (res.redirected) {
                router.push(res.url);
                router.refresh();
            }
        } catch (error) {
            console.error({ error });
        }
    }

    return (
        <Button
            variant={variant}
            className={finalClassName}
            onClick={handleCreateNewChat}
        >
            <div className="flex gap-2 items-center font-semibold">
                <Image
                    src="/logo.jpeg"
                    alt=""
                    width={20}
                    height={20}
                    className="bg-white rounded-sm"
                />
                {label}
            </div>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                />
            </svg>
        </Button>
    );
}
