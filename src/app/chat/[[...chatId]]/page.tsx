import ChatArea from "@/components/ChatArea";
import NewChatPage from "@/components/NewChatPage";
import ProfileSection from "@/components/patientProfile/ProfileSection";

export default function Page({ params }: { params: { chatId: string } }) {
    return (
        <>
            {params.chatId ? (
                <>
                    <ChatArea chatId={params.chatId[0]} />
                    <ProfileSection chatId={params.chatId[0]} />
                </>
            ) : (
                <NewChatPage />
            )}
        </>
    );
}
