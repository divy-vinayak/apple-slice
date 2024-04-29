import prisma from "@/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const session = await getServerSession();
        if (!session || !session.user || !session.user.email) {
            redirect("/api/auth/singin");
        }
        // get the chatId and PatientId
        const requestBody = await request.json();
        const { chatId, patientId }: { chatId: string; patientId: number } =
            requestBody;

        // check if the chatId and patientId both belong the user
        const chatDb = await prisma.chats.findFirst({
            where: {
                id: chatId,
                User: {
                    email: session.user.email,
                },
            },
            select: {
                id: true,
            },
        });
        const patientDb = await prisma.patient.findFirst({
            where: {
                id: patientId,
                user: {
                    email: session.user.email,
                },
            },
            select: {
                id: true,
            },
        });

        if (!chatDb || !patientDb) {
            return NextResponse.json({ message: "Forbidded" }, { status: 403 });
        }

        // update the chat to have patient with patientId
        const updatedChat = await prisma.chats.update({
            where: {
                id: chatDb.id,
            },
            data: {
                patient_id: patientDb.id,
            },
        });

        return NextResponse.json({ updatedChat }, { status: 200 });
    } catch (error) {
        console.error({ error });
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
