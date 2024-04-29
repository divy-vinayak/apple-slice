import { getServerSession } from "next-auth";
import LogoutButton from "./LogoutButton";
import StartNewChatBtn from "./StartNewChatBtn";
import prisma from "@/db";
import { redirect } from "next/navigation";
import NavChats from "./NavChats";

export default async function SideBar() {
    const session = await getServerSession();
    if (!session) {
        redirect("/api/auth/signin");
    }
    if (!session.user?.email) {
        return <>User does not have an email</>;
    }
    const userDb = await prisma.user.findFirst({
        where: {
            email: session?.user?.email,
        },
    });
    const chats = await prisma.chats.findMany({
        where: {
            user_id: userDb?.id,
        },
        orderBy: {
            created_at: "desc",
        },
    });
    return (
        <div className="p-2 flex flex-col w-80 justify-between bg-blue-950 gap-2">
            <StartNewChatBtn label="New Chat" variant="link" type="dark" />
            <div className="flex flex-col flex-grow w-full gap-2 overflow-y-auto">
                <NavChats chats={chats} />
            </div>
            <LogoutButton />
        </div>
    );
}
