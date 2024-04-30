import prisma from "@/db";
import PatientProfile from "./PatientProfile";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import SelectPatient from "./SelectPatient";

interface PropsType {
    chatId: string;
}

export default async function ProfileSection({ chatId }: PropsType) {
    const session = await getServerSession();
    if (!session || !session.user?.email) {
        redirect("/api/auth/signin");
    }
    const patientAssociatedWithChat = await prisma.chats.findFirst({
        where: {
            id: chatId,
        },
        select: {
            patient: {
                include: {
                    country: true,
                    dementiaTypes: true
                }
            },
        },
    });
    const patientAssociatedWithUser = await prisma.patient.findMany({
        where: {
            user: {
                email: session.user?.email,
            },
        },
    });

    console.log({ patientAssociatedWithChat });

    return (
        <div className="min-w-[500px] max-w-[500px] h-full flex">
            {patientAssociatedWithChat?.patient ? (
                <PatientProfile patient={patientAssociatedWithChat.patient} />
            ) : (
                <SelectPatient
                    patients={patientAssociatedWithUser}
                    chatId={chatId}
                />
            )}
        </div>
    );
}
