import { getServerSession } from "next-auth";
import LogoutButton from "./LogoutButton";
import { Button } from "./ui/button";
import StartNewChatBtn from "./StartNewChatBtn";

export default async function SideBar() {
    const session = await getServerSession();
    const chats = [
        {
            id: "flajdlfaj",
            title: "chat no. 1",
        },
        {
            id: "flajdlfajfad",
            title: "chat no. 2",
        },
        {
            id: "flajjfad",
            title: "chat no. 3",
        },
        {
            id: "flajjfaasd",
            title: "chat no. 4",
        },
    ];
    return (
        <div className="p-2 flex flex-col w-80 justify-between bg-blue-950">
            <div className="flex flex-col w-full gap-2">
                <StartNewChatBtn label='New Chat' variant='link' type="dark"/>
                {chats.map((chat, idx) => (
                    <Button
                        variant='link'
                        key={chat.id}
                        className="rounded-sm w-full text-white"
                    >
                        {chat.title}
                    </Button>
                ))}
            </div>
            <LogoutButton />
        </div>
    );
}
