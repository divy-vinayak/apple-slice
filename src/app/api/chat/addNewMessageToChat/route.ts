import prisma from "@/db";
import { messageType } from "@/lib/types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const requestBody = await request.json();
        const {
            chatId,
            newMessage,
        }: { chatId: string; newMessage: messageType } = requestBody;
        if (newMessage.message.trim().length === 0) return NextResponse.json({
            message: "Can't store empty message to chat"
        }, {
            status: 400
        })
        const newMessageDb = await prisma.messages.create({
            data: {
                chat_id: chatId,
                message: newMessage.message,
            },
        });
        if (newMessageDb) {
            return NextResponse.json({ newMessageDb }, { status: 201 });
        }
        return NextResponse.json(
            { message: "Could not add message to DB" },
            { status: 400 }
        );
    } catch (error) {
        console.error({ error });
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
