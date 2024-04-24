import prisma from "@/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const session = await getServerSession();
    if (!session) {
        redirect("/api/auth/signin");
    }
    if (!session.user?.email) {
        return NextResponse.json({ message: "User does not have email" });
    }
    const userDb = await prisma.user.findFirst({
        where: {
            email: session.user.email,
        },
        select: {
            id: true,
        },
    });
    const searchParams = request.nextUrl.searchParams;
    const chatId = searchParams.get("chatId")?.toString();
    const chatFromDb = await prisma.chats.findFirst({
        where: {
            id: chatId,
            user_id: userDb?.id,
        },
    });
    if (!chatFromDb) {
        NextResponse.json(
            { message: "Forbidden" },
            {
                status: 403,
            }
        );
    }
    const messages = await prisma.messages.findMany({
        where: {
            chat_id: chatFromDb?.id,
        },
        orderBy: {
            send_at: "desc",
        },
        select: {
            id: true,
            send_at: true,
            sent_by_user: true,
            message: true,
        },
    });
    return NextResponse.json({ messages });
}
