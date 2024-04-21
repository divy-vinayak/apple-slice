import prisma from "@/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const session = await getServerSession();
    if (!session || !session.user?.email) {
        return NextResponse.redirect(new URL('/api/auth/signin', request.url))
    }
    const user = await prisma.user.findFirst({
        where: {
            email: session.user?.email,
        },
        select: {
            id: true,
        },
    });
    if (user) {
        const chat = await prisma.chats.create({
            data: {
                user_id: user.id,
                title: "",
            },
        });
        return NextResponse.redirect(new URL(`/chat/${chat.id}`, request.url))
    }
    return Response.json(
        { message: "Internal Server Error" },
        {
            status: 500,
        }
    );
}
